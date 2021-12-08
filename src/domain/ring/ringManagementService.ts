import { getLogger } from "@core/logger/logger";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { Channel } from "@domain/device/channels";
import { UserService } from "@domain/user/userService";
import { observable } from "micro-observables";
import { NamedUserRing } from "./ring";
import { RingApi } from "./ringApi";
import { ringDataEOF } from "./ringData";
import { RingDataStorage } from "./ringDataStorage";
import { UserRingsStorage } from "./userRingsStorage";

const syncFinishedTimeout = 3000;

export enum SyncState {
	NONE = "NONE",
	PREPARING = "PREPARING",
	SYNCING = "SYNCING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}

export class RingManagementService {
	private logger = getLogger("💍 RingService");

	_userRings = observable<NamedUserRing[]>([]);
	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);

	userRings = this._userRings;
	currentRingSyncState = this._currentRingSyncState.readOnly();
	constructor(
		private readonly userService: UserService,
		private readonly deviceService: BleDeviceService,
		private readonly userRingsStorage: UserRingsStorage,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi
	) {
		const unsubscribe = this.userService.user.subscribe((user) => {
			if (user) {
				// this.getRings();
				unsubscribe();
			}
		});

		// once device is connected, retrieve its name and set it to our ring info
		this.deviceService.favoriteDeviceSNU.subscribe((snu) => {
			this._userRings.update((rings) => {
				console.log("USERRINGS UPDATE", rings);
				return rings.map((ring) => {
					if (ring.id === snu) {
						return { ...ring, name: this.deviceService.favoriteDevice.get()?.name ?? ring.name, connected: true };
					} else {
						return ring;
					}
				});
			});
		});

		this._userRings.subscribe((rings) => {
			this.userRingsStorage.save(rings);
		});
	}

	async init() {
		const loadedRings = await this.userRingsStorage.load();
		if (!loadedRings) this._userRings.set([]);
		else
			this._userRings.set(
				loadedRings.map((ring) => {
					if (ring.name === this.deviceService.favoriteDevice.get()?.name) return { ...ring, connected: true };
					else return { ...ring, connected: false };
				})
			);
		console.log("CIR-266  Loaded Rings", loadedRings);
		this.syncData();
	}

	async getRings() {
		const rings = await this.ringApi.getRings();

		const oldNamedRings = this._userRings.get();
		const connectedRingId = this.deviceService.favoriteDeviceSNU.get();
		const connectedRingName = this.deviceService.favoriteDevice.get()?.name;

		const newNamedRings: NamedUserRing[] = rings.map((r) => {
			const oldRingName = oldNamedRings.filter((oldRing) => oldRing.id === r.id)[0]?.name;
			return {
				connected: connectedRingId === r.id ? true : false,
				...r,
				name: connectedRingName && connectedRingId && connectedRingId === r.id ? connectedRingName : oldRingName,
			};
		});
		this._userRings.set(newNamedRings);
	}

	async registerConnectedRing() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const deviceName = this.deviceService.favoriteDevice.get()?.name;
		const id = await this.deviceService.favoriteDeviceSNU.get();
		if (id && firmware && deviceName) {
			try {
				const userRings = this._userRings.get();
				console.log("987 CIR-266 USER RING Booting", [...userRings]);
				const alreadyRegistered = userRings.filter((ring) => ring.id === id).length > 0;
				if (!alreadyRegistered) {
					const userRing = await this.ringApi.addRing({ id, firmware });
					const namedRing = { ...userRing, name: deviceName, connected: true };
					console.log("CIR-266 USER RING REGISTERING", [...userRings, namedRing]);
					// this.userRings.update((rings) => {
					// 	console.log("UPDATE SHIT", [...rings], namedRing); 
					// 	return [...rings, namedRing]});
					this.userRings.set([...userRings, namedRing])
					return userRing;
				}
			} catch (e) {
				this.deviceService.disconnect();
				throw e;
			}
		} else {
			await this.deviceService.disconnect();
		}
	}

	async deleteRing(ring: NamedUserRing) {
		const ringToDelete = this._userRings.get().filter((knownRing) => knownRing.id === ring.id)[0];
		if (ringToDelete) {
			this.logger.debug(`Deleting ring ${ringToDelete.name} (snu: ${ringToDelete.id})`);
			try {
				console.log("checking favorite ring : " + this.deviceService.favoriteDevice.get()?.name);
				const idToDelete = ringToDelete.id;
				if (this.deviceService.favoriteDevice.get()?.name === ringToDelete.name) {
					await this.deviceService.disconnect();
				} else {
					this.logger.debug(
						`No need to disconnect. Current active ring is "${
							this.deviceService.favoriteDevice.get()?.name
						}" (snu: ${this.deviceService.favoriteDeviceSNU.get()})`
					);
				}
				await this.ringApi.deleteRing(idToDelete);
				this._userRings.update((oldRings) => oldRings.filter((r) => r.id !== idToDelete));
			} catch (e) {
				this.logger.warn("Delete ring failed : " + JSON.stringify(e));

				// @ts-ignore
				if (e.statusCode === 500) {
					// SERVER PATCH : DELETE /rings/{id} returns error 500, but ring is correctly deleted from user
					this.logger.debug("**** SERVER PATCH ****");
					this.logger.debug("Consider ring deletion succeeded");
					this.logger.debug("**********************");
					this._userRings.update((oldRings) => oldRings.filter((r) => r.id !== ring.id));
				} else {
					throw e;
				}
			}
		} else {
			throw new Error("Unknown ring");
		}
	}

	async factoryResetCurrentRing() {
		const idToReset = this.deviceService.favoriteDeviceSNU.get();
		if (idToReset) {
			const ringToReset = this._userRings.get().filter((ring) => ring.id === idToReset)[0];
			if (ringToReset) {
				try {
					await this.deviceService.factoryResetCurrentRing();
					await this.ringApi.deleteRing(idToReset);
					this._userRings.update((oldRings) => oldRings.filter((r) => r.id !== idToReset));
				} catch (error) {
					this.logger.warn("Error removing ring from account after factory-reset :", error);
					throw error;
				}
			} else {
				throw new Error("Unknown ring");
			}
		} else {
			throw new Error("No connected ring");
		}
	}

	async syncData() {
		const ring = this._userRings.get()[0];
		if (!ring) {
			this.logger.info("Sync cancelled: No ring");
			return;
		}
		try {
			this._currentRingSyncState.set(SyncState.PREPARING);
			const waitingData = await this.ringDataStorage.load();
			if (waitingData) {
				this.logger.info("Waiting data has to be sent, length:", waitingData.length);
			}
			this.logger.info("Retrieving data...");
			const allData = await new Promise<string>(async (resolve) => {
				let data = waitingData ?? "";

				const unsubscribe = await this.deviceService.listen(Channel.DATA, Channel.DATA, (value) => {
					this.logger.debug("FBC value", value);
					if (value === ringDataEOF) {
						unsubscribe();
						resolve(data);
					} else {
						data += value + "\n";
						this._currentRingSyncState.set(SyncState.SYNCING);
					}
				});
			});
			try {
				// Api call
				if (allData !== ringDataEOF) {
					this.logger.info("Sending data to server...");
					try {
						await this.ringApi.sendData(ring, allData);
						this.logger.info("Successfully sent data...");
					} catch (err) {
						this.logger.warn("Error sent data...", err);
					}
					setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout);
				}
				await this.ringDataStorage.clear();
				this._currentRingSyncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
			} catch (e) {
				this.logger.warn("An error occured during save. Storing data, length:", allData.length);
				await this.ringDataStorage.save(allData);
				throw e;
			}
		} catch (e) {
			this.logger.warn("Error during sync:", e);
			this._currentRingSyncState.set(SyncState.ERROR);
			throw e;
		}
	}

	async submitFirmwareVersion() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		console.log("SUBMITE firmware", firmware);
		const connectedRing = this._userRings.get().filter((r) => r.connected === true);
		if (firmware && connectedRing.length) {
			const { id } = connectedRing[0];
			this.logger.info("Submit User Ring", connectedRing);
			try {
				// await this.updateStoredRings({ ...connectedRing[0], firmware });
				await this.ringApi.submitFirmwareVersion(id, firmware);
			} catch (err) {
				this.logger.warn("Error Submiting User Ring", err);
			}
		}
	}

	async updateStoredRings(updatedRing: NamedUserRing) {
		this._userRings.update((oldRings) => oldRings.filter((r) => r.id !== updatedRing.id));
		this._userRings.update((rings) => [updatedRing, ...rings]);
	}
}
