import { getLogger } from "@core/logger/logger";
import { AppStateService } from "@domain/appState/appStateService";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { Channel } from "@domain/device/channels";
import { observable } from "micro-observables";
import { NamedUserRing } from "./ring";
import { RingApi } from "./ringApi";
import { ringDataEOF } from "./ringData";
import { RingDataStorage } from "./ringDataStorage";

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

	// _userRings = observable<NamedUserRing[]>([]);
	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);
	private _FBCQuantity = observable(0);

	readonly FBCQuantity = this._FBCQuantity.readOnly();
	// userRings = this._userRings;
	currentRingSyncState = this._currentRingSyncState.readOnly();
	constructor(
		private readonly deviceService: BleDeviceService,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi,
		private readonly appStateService: AppStateService
	) {}

	async init() {
		if (!this.appStateService.isInSleepMode) this.syncData();
	}

	async registerConnectedRing() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const deviceName = this.deviceService.favoriteDevice.get()?.name;
		const id = await this.deviceService.favoriteDeviceSNU.get();
		if (id && firmware && deviceName) {
			try {
				const userRing = await this.ringApi.addRing({ id, firmware });
				return userRing;
			} catch (e) {
				this.deviceService.disconnect({ dissociate: true });
				throw e;
			}
		} else {
			await this.deviceService.disconnect({ dissociate: true });
		}
	}

	async deleteRing(ring: NamedUserRing) {
		if (ring) {
			this.logger.debug(`Deleting ring ${ring.name} (snu: ${ring.id})`);
			try {
				const idToDelete = ring.id;
				await this.deviceService.disconnect({ dissociate: true, ring: ring });
				await this.ringApi.deleteRing(idToDelete);
			} catch (e) {
				this.logger.warn("Delete ring failed : " + JSON.stringify(e));
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if (e.statusCode === 500) {
					// SERVER PATCH : DELETE /rings/{id} returns error 500, but ring is correctly deleted from user
					this.logger.debug("**** SERVER PATCH ****");
					this.logger.debug("Consider ring deletion succeeded");
					this.logger.debug("**********************");
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
			const ringToReset = this.appStateService.userRings.get().find((ring) => ring.id === idToReset);
			if (ringToReset) {
				try {
					await this.deviceService.factoryResetCurrentRing();
					await this.ringApi.deleteRing(idToReset);
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
		const ring = this.appStateService.userRings.get().find((ring) => ring.connected);
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
			let dataQuantity = 0;
			const responseDataQuantiy = await this.deviceService.getResponse(Channel.DATA_QUANTITY);
			if (typeof responseDataQuantiy === "string") dataQuantity = parseInt(responseDataQuantiy);
			this.logger.info("FBC Quantity", dataQuantity);
			this._FBCQuantity.set(dataQuantity);
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
				this._FBCQuantity.set(0);
			} catch (e) {
				this.logger.warn("An error occured during save. Storing data, length:", allData.length);
				this._FBCQuantity.set(0);
				await this.ringDataStorage.save(allData);
				throw e;
			}
		} catch (e) {
			this.logger.warn("Error during sync:", e);
			this._currentRingSyncState.set(SyncState.ERROR);
			this._FBCQuantity.set(0);
			throw e;
		}
	}

	async submitFirmwareVersion() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const connectedRing = this.appStateService.userRings.get().find((ring) => ring.connected);
		if (firmware && connectedRing) {
			const { id } = connectedRing;
			this.logger.info("Submit User Ring", connectedRing);
			try {
				await this.updateStoredRings({ ...connectedRing, firmware });
				await this.ringApi.submitFirmwareVersion(id, firmware);
			} catch (err) {
				this.logger.warn("Error Submiting User Ring", err);
			}
		}
	}

	async updateStoredRings(updatedRing: NamedUserRing) {
		this.appStateService.userRings.update((oldRings) =>
			oldRings.map((ring) => {
				if (ring.id === updatedRing.id) {
					return { ...updatedRing };
				}
				return ring;
			})
		);
	}
}
