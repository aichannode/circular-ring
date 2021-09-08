import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { RingApi } from "./ringApi";
import { deserializeBattery, RingBattery } from "./ringBattery";
import { RingDataStorage } from "./ringDataStorage";

const syncFinishedTimeout = 3000;

export enum SyncState {
	NONE = "NONE",
	SYNCING = "SYNCING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}
export class RingService {
	private _ringBattery = observable<RingBattery | null>(null);
	private _syncState = observable<SyncState>(SyncState.NONE);

	ringBattery = this._ringBattery.readOnly();
	syncState = this._syncState.readOnly();

	constructor(
		private readonly deviceService: DeviceService,
		private readonly ringDataStorage: RingDataStorage,
		private readonly ringApi: RingApi
	) {
		this._ringBattery.subscribe((v) => {
			this.log(v?.charge, v?.status);
		});
	}

	async init() {
		this.listenBattery();
	}

	listenBattery() {
		this.deviceService.listen("BAT", (err, value) => {
			if (err) {
				throw err;
			}
			if (value) {
				this._ringBattery.set(deserializeBattery(value));
			}
		});
	}

	async syncData() {
		try {
			this._syncState.set(SyncState.SYNCING);
			const waitingData = await this.ringDataStorage.load();
			if (waitingData) {
				this.log("Waiting data has to be sent, length:", waitingData.length);
			}
			const allData = await new Promise<string>(async (resolve, reject) => {
				let data = waitingData ?? "";
				const subscription = await this.deviceService.listen("FBC", (err, value) => {
					if (err) {
						subscription?.remove();
						reject(err);
						return;
					}
					if (value) {
						data += value;
						if (value === "FBCEOS") {
							subscription?.remove();
							resolve(data);
						}
						this.log("FBC value", value);
					}
				});
			});
			try {
				// Api call
				await this.ringApi.sendData(allData);
				this.ringDataStorage.clear();
				this._syncState.set(SyncState.SUCCESS);
				setTimeout(() => this._syncState.set(SyncState.NONE), syncFinishedTimeout);
			} catch (e) {
				this.ringDataStorage.push(allData);
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
