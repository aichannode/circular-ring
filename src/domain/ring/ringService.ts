import { getLogger } from "@core/logger/logger";
import { AuthService } from "@domain/auth/authService";
import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { UserRing } from "./ring";
import { RingApi } from "./ringApi";
import { deserializeBattery, RingBattery } from "./ringBattery";
import { ringDataEOF } from "./ringData";
import { RingDataStorage } from "./ringDataStorage";
import { deserializeLiveData, RingLiveData } from "./ringLiveData";
import { UserRingsStorage } from "./userRingsStorage";

const syncFinishedTimeout = 3000;

export enum SyncState {
	NONE = "NONE",
	PREPARING = "PREPARING",
	SYNCING = "SYNCING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}
export class RingService {
	private logger = getLogger("💍 RingService");

	private _userRing = observable<UserRing | null>(null);
	private _ringBattery = observable<RingBattery | null>(null);
	private _syncState = observable<SyncState>(SyncState.NONE);
	private _ringLiveData = observable<{ listening: boolean; data?: RingLiveData | null }>({ listening: false });

	userRing = this._userRing.readOnly();
	ringBattery = this._ringBattery.readOnly();
	syncState = this._syncState.readOnly();
	ringLiveData = this._ringLiveData.readOnly();

	constructor(
		private readonly authService: AuthService,
		private readonly deviceService: DeviceService,
		private readonly userRingsStorage: UserRingsStorage,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi
	) {
		const unsubscribe = this.authService.authToken.subscribe((token) => {
			if (token) {
				this.getRings();
				unsubscribe();
			}
		});
	}

	async init() {
		const loadedRings = await this.userRingsStorage.load();
		this._userRing.set(loadedRings?.[0] ?? null);
		this.listenBattery();
		this.syncData();
	}

	listenLiveData() {
		this._ringLiveData.set({ listening: true });
		return this.deviceService.listen("FBL1", Channel.LIVE, (value) => {
			if (value) {
				const deserializedData = deserializeLiveData(value);
				if (deserializedData) {
					this._ringLiveData.update((c) => {
						const maxHeartRate = c.data
							? Math.max(deserializedData.heartRate, c.data.heartRate)
							: deserializedData.heartRate;
						return { ...c, data: { ...deserializedData, maxHeartRate } };
					});
				}
			}
		});
	}

	async getRings() {
		const rings = await this.ringApi.getRings();
		this._userRing.set(rings[0] ?? null);
	}

	stopLiveData() {
		this._ringLiveData.update((c) => ({ ...c, listening: false }));
		return this.deviceService.write("FBL0");
	}

	listenBattery() {
		return this.deviceService.listen(Channel.BATTERY, Channel.BATTERY, (value) => {
			if (value) {
				this._ringBattery.set(deserializeBattery(value));
			}
		});
	}

	async registerCurrentRing() {
		const id = await this.deviceService.getResponse(Channel.MAC);
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		if (id && firmware) {
			try {
				if (this._userRing.get()?.id !== id) {
					const userRing = await this.ringApi.addRing({
						id,
						firmware,
					});
					this._userRing.set(userRing);
					this.userRingsStorage.save([userRing]);
					return userRing;
				}
			} catch (e) {
				this.deviceService.disconnect();
				this._userRing.set(null);
				this.userRingsStorage.save([]);
				throw e;
			}
		} else {
			this.deviceService.disconnect();
			this._userRing.set(null);
			this.userRingsStorage.save([]);
		}
	}

	async syncData() {
		const ring = this._userRing.get();
		if (!ring) {
			this.logger.info("Sync cancelled: No ring");
			return;
		}
		try {
			this._syncState.set(SyncState.PREPARING);
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
						this._syncState.set(SyncState.SYNCING);
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
					setTimeout(() => this._syncState.set(SyncState.NONE), syncFinishedTimeout);
				}
				this.ringDataStorage.clear();
				this._syncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
			} catch (e) {
				this.logger.warn("An error occured during save. Storing data, length:", allData.length);
				this.ringDataStorage.save(allData);
				throw e;
			}
		} catch (e) {
			this.logger.warn("Error during sync:", e);
			this._syncState.set(SyncState.ERROR);
			throw e;
		}
	}
}
