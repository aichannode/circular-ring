import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { RingApi } from "./ringApi";
import { deserializeBattery, RingBattery } from "./ringBattery";
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
		return this.deviceService.listen(Channel.BATTERY, (value) => {
			if (value) {
				this._ringBattery.set(deserializeBattery(value));
			}
		});
	}

	async syncData() {
		try {
			this._syncState.set(SyncState.PREPARING);
			const waitingData = await this.ringDataStorage.load();
			if (waitingData) {
				this.log("Waiting data has to be sent, length:", waitingData.length);
			}
			const allData = await new Promise<string>(async (resolve) => {
				let data = waitingData ?? "";

				const unsubscribe = await this.deviceService.listen(Channel.DATA, (value) => {
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
					await this.ringApi.sendData(allData);
					setTimeout(() => this._syncState.set(SyncState.NONE), syncFinishedTimeout);
				}
				this.ringDataStorage.clear();
				this._syncState.set(allData !== ringDataEOF ? SyncState.SUCCESS : SyncState.NONE);
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
