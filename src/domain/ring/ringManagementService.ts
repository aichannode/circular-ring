import { getLogger } from "@core/logger/logger";
import { AppStateService } from "@domain/appState/appStateService";
import { DeviceConnectionState } from "@domain/device/bleDeviceService";
import { Channel } from "@domain/device/channels";
import { observable } from "micro-observables";
import { WordingKey } from "src/wordings";
import { BleDeviceService } from "./../device/bleDeviceService";
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

	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);
	private _FBCQuantity = observable(0);
	private _syncStatus = observable<WordingKey>("home.sync.syncing");
	private _transmissionStatus = observable({ packetTransmitted: 0, totalPacket: 0 });

	readonly FBCQuantity = this._FBCQuantity.readOnly();
	currentRingSyncState = this._currentRingSyncState.readOnly();
	readonly syncStatus = this._syncStatus.readOnly();
	readonly transmissionStatus = this._transmissionStatus.readOnly();

	constructor(
		private readonly deviceService: BleDeviceService,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi,
		private readonly appStateService: AppStateService
	) {}

	async init() {
		this.deviceService.monitoring.subscribe((monitoring) => {
			// on ring connection without Timeout The ring get DDOS
			if (monitoring) setTimeout(() => this.syncData(), 500);
			else {
				if (this._currentRingSyncState.get() === SyncState.SYNCING) {
					this._currentRingSyncState.set(SyncState.ERROR);
					setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout);
				}
			}
		});
		// Sync ring data each 30 min
		setInterval(() => this.syncData(), 30 * 60 * 1000);
	}

	async registerConnectedRing() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const deviceName = this.deviceService.favoriteDevice.get()?.name;
		const id = await this.deviceService.favoriteDeviceSNU.get();
		this.logger.info(`🔧 registerConnectedRing Firmware Version: ${firmware}`);
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

	async setTimezone() {
		const ring = this.appStateService.userRings.get().find((ring) => ring.connected);
		this.logger.info(`tutorial ring ${JSON.stringify(ring)}`);
		if (ring) await this.ringApi.setTimezone(ring);
	}

	async syncData() {
		this.logger.info("Sync Start");
		const ring = this.appStateService.userRings.get().find((ring) => ring.connected);
		if (this._currentRingSyncState.get() === SyncState.SYNCING) {
			this.logger.info("Sync cancelled: Already Syncing");
			return;
		}
		if (this.appStateService.isInSleepMode.get()) {
			this.logger.info("Sync cancelled: SleepMode");
			return;
		}
		if (!ring || this.deviceService.connectionState.get() !== DeviceConnectionState.CONNECTED) {
			this.logger.info("Sync cancelled: No ring");
			return;
		}
		try {
			this._currentRingSyncState.set(SyncState.PREPARING);
			const waitingData = await this.ringDataStorage.load();
			this.logger.info("Waiting data has to be sent, length:", waitingData?.length ?? 0);
			this.logger.info("Retrieving data...");
			let dataQuantity = 0;
			const responseDataQuantiy = await this.deviceService.getResponse(Channel.DATA_QUANTITY);
			if (typeof responseDataQuantiy === "string") dataQuantity = parseInt(responseDataQuantiy);
			this._transmissionStatus.set({ packetTransmitted: 0, totalPacket: dataQuantity });
			this.logger.info("FBC Quantity", dataQuantity);
			this._FBCQuantity.set(dataQuantity);
			this._currentRingSyncState.set(SyncState.SYNCING);
			const allData = await new Promise<string>(async (resolve) => {
				let data = waitingData ?? "";
				try {
					const unsubscribe = await this.deviceService.listen(Channel.DATA, Channel.DATA, async (value) => {
						this.logger.debug("FBC value", value);
						if (value === ringDataEOF) {
							await this.ringDataStorage.save(data);
							unsubscribe();
							resolve(data);
						} else {
							data += value + "\n";
							this._currentRingSyncState.set(SyncState.SYNCING);
						}
					});
				} catch (err) {
					this.logger.debug("error listenning", err);
				}
			});
			try {
				// Api call
				if (allData?.length) {
					this.logger.info("Sending data to server...");
					await this.ringApi.sendData(ring, allData);
					this.logger.info("Sending data to server: OK");
					await this.ringDataStorage.clear();
					this.logger.info("Clearing phone memory");
				}
				this._currentRingSyncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
				setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout + 5000);
				this._FBCQuantity.set(0);
			} catch (e) {
				this.logger.warn("An error occured during save. Storing data, length:", allData.length, "error:", e);
				this._FBCQuantity.set(0);
				await this.ringDataStorage.save(allData);
				this.logger.warn("Data stored in phone memory");
				throw e;
			}
		} catch (e) {
			this.logger.warn("Error during sync:", e);
			this._currentRingSyncState.set(SyncState.ERROR);
			setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), 1000);
			this._FBCQuantity.set(0);
			throw e;
		}
		this._syncStatus.set("home.sync.syncing");
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
