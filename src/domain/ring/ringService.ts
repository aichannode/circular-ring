import { delay } from "@core/utils";
import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { RingApi } from "./ringApi";
import { deserializeBattery, RingBattery } from "./ringBattery";
import { ringDataEOF } from "./ringData";
import { RingDataStorage } from "./ringDataStorage";
import { deserializeLiveData, RingLiveData } from "./ringLiveData";

const liveData = [
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",

	"FBL6143080E0046270700000B6D0000390056000000000000000000000000000000",
	"FBL6143080F004626F92E000B6D000039005C000000000000000000000000000000",
	"FBL61430810004626F22E000B860000390059000000000000000000000000000000",
	"FBL61430811004626F02E000B86000039005B000000000000000000000000000000",
	"FBL61430812004526F931000B86000039005A000000000000000000000000000000",
	"FBL61430813004426FB2E000B9F0000390059000000000000000000000000000000",
	"FBL61430814004326F92D000B9F000039005D000000000000000000000000000000",
	"FBL61430815004326F52E000BB80000390055000000000000000000000000000000",
	"FBL61430816004326F52D000B9F0000390058000000000000000000000000000000",
	"FBL61430817004326F92D000B9F0000390060000000000000000000000000000000",
	"FBL61430818004326E82B000B6D000039005A000000000000000000000000000000",
	"FBL61430819004326DB2D000B86000039005B000000000000000000000000000000",
	"FBL6143081A004426CC2C000B86000039005A000000000000000000000000000000",
	"FBL6143081B004326D32D000B9F0000390059000000000000000000000000000000",
	"FBL6143081C004326EE2D000AA5000039003F000000000000000000000000000000",
	"FBL6143081D0000000000000BB80000390041000000000000000000000000000000",
	"FBL6143081E0000000000000BB80000390032000000000000000000000000000000",
	"FBL6143081F004326DE2D000BB80000390046000000000000000000000000000000",
	"FBL61430820004326EA2C000BB8000039003E000000000000000000000000000000",
	"FBL61430821004426F02F000BD10000390054000000000000000000000000000000",
	"FBL61430822004426F02F000BB8000039004F000000000000000000000000000000",
	"FBL61430823004426F22F000BD10000390049000000000000000000000000000000",
	"FBL61430824004426FB2F000BB80000390050000000000000000000000000000000",
	"FBL61430808004427012E000BEA000039004A000000000000000000000000000000",
	"FBL61430826004426FD2E000BEA000039005B000000000000000000000000000000",
	"FBL61430827004426ED2E000BD1000039005F000000000000000000000000000000",
	"FBL614308280044269D2E000BB8000039005C000000000000000000000000000000",
	"FBL61430829004426852D000BB80000390053000000000000000000000000000000",
	"FBL6143082A0044268E2D000B9F000039004E000000000000000000000000000000",
	"FBL6143082B004426872D000BB8000039003D000000000000000000000000000000",
];

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
	}

	async listenLiveData() {
		this._ringLiveData.set({ listening: true });
		let i = 0;
		while (this._ringLiveData.get().listening) {
			const data = deserializeLiveData(liveData[i % liveData.length]);
			this._ringLiveData.update((c) => {
				const maxHeartRate = c.data ? Math.max(data!.heartRate, c.data.maxHeartRate) : data!.heartRate;
				return { ...c, data: { ...data!, maxHeartRate } };
			});
			i++;
			await delay(1000);
		}
		// return this.deviceService.listen("FBL1", "FBL", (value) => {
		// 	if (value) {
		// 		const deserializedData = deserializeLiveData(value);
		// 		if (deserializedData) {
		// 			this._ringLiveData.update((c) => {
		// 				const maxHeartRate = c.data
		// 					? Math.max(deserializedData.heartRate, c.data.heartRate)
		// 					: deserializedData.heartRate;
		// 				return { ...c, data: { ...deserializedData, maxHeartRate } };
		// 			});
		// 		}
		// 	}
		// });
	}
	// 40% and 55% of user’s max HR it is considered low intensity activity,  between 55% and 70% of user’s max HR it is considered medium intensity activity, between 70% and 100% o
	stopLiveData() {
		// this._ringLiveData.update((c) => ({ ...c, listening: false }));
		this._ringLiveData.update((c) => ({ listening: false }));
		// return this.deviceService.write("FBL0");
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
