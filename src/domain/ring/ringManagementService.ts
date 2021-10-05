import { getLogger } from "@core/logger/logger";
import { Channel } from "@domain/device/channels";
import { BleDeviceService } from "@domain/device/bleDeviceService";
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

	private _userRings = observable<NamedUserRing[]>([]);
	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);

	userRings = this._userRings.readOnly();
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
				this.getRings();
				unsubscribe();
			}
		});
	}

	async init() {
		const loadedRings = await this.userRingsStorage.load();
		this._userRings.set(loadedRings ?? []);
		this.syncData();
	}

	async getRings() {
		const oldNamedRings = this._userRings.get();
		const connectedRingId = this.deviceService.favoriteDeviceSNU.get();
		const connectedRingName = this.deviceService.favoriteDevice.get()?.name;

		const rings = await this.ringApi.getRings();
		const newNamedRings: NamedUserRing[] = rings.map((r) => {
			return {
				...r,
				name:
					connectedRingName && connectedRingId && connectedRingId === r.id
						? connectedRingName
						: oldNamedRings.filter((oldRing) => oldRing.id === r.id)[0]?.name,
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
				const alreadyRegistered = userRings.filter((ring) => ring.id === id).length > 0;
				if (!alreadyRegistered) {
					const userRing = await this.ringApi.addRing({ id, firmware });
					const namedRing = { ...userRing, name: deviceName };
					this._userRings.update((rings) => [...rings, namedRing]);
					this.userRingsStorage.save(userRings);
					return userRing;
				}
			} catch (e) {
				this.deviceService.disconnect();
				throw e;
			}
		} else {
			this.deviceService.disconnect();
		}
	}

	async deleteRing(ring: NamedUserRing) {
		const ringToDelete = this._userRings.get().filter((knownRing) => knownRing.id === ring.id)[0];
		if (ringToDelete) {
			this.logger.debug(`Deleting ring ${ringToDelete.name} (snu: ${ringToDelete.id})`);
			try {
				const idToDelete = ringToDelete.id;
				if (this.deviceService.favoriteDeviceSNU.get() === idToDelete) {
					await this.deviceService.disconnect();
				} else {
					this.logger.debug(
						`No need to disconnect. Current connected ring : ${
							this.deviceService.favoriteDevice.get()?.name
						} (snu: ${this.deviceService.favoriteDeviceSNU.get()})`
					);
				}
				await this.ringApi.deleteRing(idToDelete);
				this._userRings.update((oldRings) => oldRings.filter((r) => r.id !== idToDelete));
				await this.userRingsStorage.save(this._userRings.get());
			} catch (e) {
				this.logger.warn("Delete ring failed : " + e);
				throw e;
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
					await this.userRingsStorage.save(this._userRings.get());
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
					data += value;
					if (data !== ringDataEOF) {
						// There has been data since start
						this._currentRingSyncState.set(SyncState.SYNCING);
					} else {
						this.logger.info("Nothing to sync");
					}
					if (value === ringDataEOF) {
						unsubscribe();
						resolve(data);
					}
				});
			});
			try {
				// Api call
				if (allData !== ringDataEOF) {
					this.logger.info("Sending data to server...");
					await this.ringApi.sendData(ring, allData);
					this.logger.info("Successfully sent data...");
					setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout);
				}
				this.ringDataStorage.clear();
				this._currentRingSyncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
			} catch (e) {
				this.logger.warn("An error occured during save. Storing data, length:", allData.length);
				this.ringDataStorage.save(allData);
				throw e;
			}
		} catch (e) {
			this.logger.warn("Error during sync:", e);
			this._currentRingSyncState.set(SyncState.ERROR);
			throw e;
		}
	}
}
