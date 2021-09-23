import { CircleAlarmService } from "@domain/circleAlarm/circleAlarmService";
import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { RingApi } from "./ringApi";
import { deserializeBattery, RingBattery } from "./ringBattery";
import { ringDataEOF } from "./ringData";
import { RingDataStorage } from "./ringDataStorage";
import { deserializeLiveData, RingLiveData } from "./ringLiveData";

const syncFinishedTimeout = 3000;

export enum SyncState {
	NONE = "NONE",
	PREPARING = "PREPARING",
	SYNCING = "SYNCING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}
export class RingService {
	private _ringBattery = observable<RingBattery | null>(null);
	private _syncState = observable<SyncState>(SyncState.NONE);
	private _ringLiveData = observable<{ listening: boolean; data?: RingLiveData | null }>({ listening: false });

	ringBattery = this._ringBattery.readOnly();
	syncState = this._syncState.readOnly();
	ringLiveData = this._ringLiveData.readOnly();

	constructor(
		private readonly deviceService: DeviceService,
		private readonly circlealarmService: CircleAlarmService,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi
	) {
		this._ringBattery.subscribe((v) => {
			this.log(v?.charge, v?.status);
		});
	}

	async init() {
		this.listenBattery();
		this.syncData();
		this.circlealarmService.fetchAlarmList();
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
			return this.ringApi.addRing({
				id,
				firmware,
			});
		}
	}

	async syncData() {
		try {
			this._syncState.set(SyncState.PREPARING);
			const waitingData = await this.ringDataStorage.load();
			if (waitingData) {
				this.log("Waiting data has to be sent, length:", waitingData.length);
			}
			this.log("Retrieving data...");
			const allData = await new Promise<string>(async (resolve) => {
				let data = waitingData ?? "";

				const unsubscribe = await this.deviceService.listen(Channel.DATA, Channel.DATA, (value) => {
					this.log("FBC value", value);
					data += value;
					if (data !== ringDataEOF) {
						// There has been data since start
						this._syncState.set(SyncState.SYNCING);
					} else {
						this.log("Nothing to sync");
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
					this.log("Sending data to server...");
					await this.ringApi.sendData(allData);
					this.log("Successfully sent data...");
					setTimeout(() => this._syncState.set(SyncState.NONE), syncFinishedTimeout);
				}
				this.ringDataStorage.clear();
				this._syncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
			} catch (e) {
				this.log("An error occured during save. Storing data, length:", allData.length);
				this.ringDataStorage.save(allData);
				throw e;
			}
		} catch (e) {
			this.log("Error during sync:", e);
			this._syncState.set(SyncState.ERROR);
			throw e;
		}
	}

	log(...args: unknown[]) {
		console.log("💍 [RING]", ...args);
	}
}
