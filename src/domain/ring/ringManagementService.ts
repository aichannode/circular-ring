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

const syncErrors = new Set<string>([
	"home.sync.error.fetching",
	"home.sync.error.uploading",
	"home.sync.error.processing",
]);

export class RingManagementService {
	private logger = getLogger("💍 RingService");

	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);
	private _FBCQuantity = observable(0);
	private _syncStatus = observable<WordingKey>("home.sync.fetching");
	private _errorMessage = observable<WordingKey>("home.sync.error.unknown");
	private _transmissionStatus = observable({ packetTransmitted: 0, totalPacket: 0 });

	readonly FBCQuantity = this._FBCQuantity.readOnly();
	currentRingSyncState = this._currentRingSyncState.readOnly();
	errorMessage = this._errorMessage.readOnly();
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
			if (monitoring) {
				this.logger.info("Device service monitoring restart sync");
				setTimeout(() => this.syncData(), 500);
			} else {
				if (this._currentRingSyncState.get() === SyncState.SYNCING) {
					this._currentRingSyncState.set(SyncState.ERROR);
					setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout);
				}
			}
		});
		// Sync ring data each 5 min
		// setInterval(() => this.syncData(), 5 * 60 * 1000);
	}

	async reset() {
		this._currentRingSyncState.set(SyncState.NONE);
		this._FBCQuantity.set(0);
		this._syncStatus.set("home.sync.fetching");
		this._transmissionStatus.set({ packetTransmitted: 0, totalPacket: 0 });
	}

	async registerConnectedRing() {
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const deviceName = this.deviceService.connectedDevice.get()?.name;
		const id = await this.deviceService.connectedDeviceSnu.get();
		this.logger.info(`🔧 registerConnectedRing Firmware Version: ${firmware}`);
		if (id && firmware && deviceName) {
			try {
				const ring = await this.ringApi.addRing({ id: id, firmware });
				await this.deviceService.initializeDevice();
				await this.deviceService.saveDeviceAsFavorite();
				return ring;
			} catch (e) {
				await this.deviceService.disconnect({ dissociate: true });
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
				throw e;
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
		if (this._currentRingSyncState.get() !== SyncState.NONE) {
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
			const allData = await new Promise<string>(async (resolve, error) => {
				let data = waitingData ?? "";
				try {
					const unsubscribe = await this.deviceService.listen(Channel.DATA, Channel.DATA, async (value) => {
						if (value === ringDataEOF) {
							if (this._currentRingSyncState.get() !== SyncState.SYNCING) {
								error(new Error("Bad state while fetching data."));
								unsubscribe();
								return;
							}
							this.logger.info("Saving FBCs in phone..., length: ", data.length);
							await this.ringDataStorage.save(data);
							unsubscribe();
							resolve(data);
						} else {
							this._transmissionStatus.update((lastValues) => ({
								packetTransmitted: lastValues.packetTransmitted + 1,
								totalPacket: dataQuantity,
							}));
							data += value + "\n";
							if (this._currentRingSyncState.get() !== SyncState.SYNCING) {
								error(new Error("Bad state while fetching data."));
								unsubscribe();
							}
						}
					});
				} catch (err) {
					this.logger.debug("error listening", err);
					error(new Error("home.sync.error.sync"));
				}
			});
			this._transmissionStatus.update((lastValues) => ({
				packetTransmitted: 0,
				totalPacket: 1,
			}));
			try {
				// Api call
				if (allData?.length) {
					this._syncStatus.set("home.sync.uploading");
					this.logger.info("Sending data to server...");
					await this.ringApi.sendData(
						ring,
						allData,
						() => {
							this._syncStatus.set("home.sync.processing");
						},
						(event) => {
							this._transmissionStatus.set({ packetTransmitted: event.loaded, totalPacket: event.total });
						}
					);
					this.logger.info("Sending data to server: OK");
					await this.ringDataStorage.clear();
					this.logger.info("Clearing phone memory");
				}
				this._currentRingSyncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
				setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), syncFinishedTimeout + 5000);
			} catch (e) {
				this.logger.warn("An error occurred during upload. Storing data, length:", allData.length, "error:", e);
				throw new Error(
					this._syncStatus.get() === "home.sync.processing" ? "home.sync.error.processing" : "home.sync.error.uploading"
				);
			}
		} catch (e: any) {
			this.logger.error("Error during sync:", e);
			this._currentRingSyncState.set(SyncState.ERROR);
			this._errorMessage.set(syncErrors.has(e?.message) ? e.message : "home.sync.error.unknown");
			setTimeout(() => this._currentRingSyncState.set(SyncState.NONE), 10000);
			throw e;
		} finally {
			this._FBCQuantity.set(0);
		}
		this._syncStatus.set("home.sync.fetching");
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
