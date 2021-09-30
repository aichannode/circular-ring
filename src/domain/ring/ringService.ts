import { getLogger } from "@core/logger/logger";
import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { UserService } from "@domain/user/userService";
import { observable } from "micro-observables";
import { NamedUserRing } from "./ring";
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

	private _userRings = observable<NamedUserRing[]>([]);
	private _currentRingBattery = observable<RingBattery | null>(null);
	private _currentRingSyncState = observable<SyncState>(SyncState.NONE);
	private _currentRingLiveData = observable<{ listening: boolean; data?: RingLiveData | null }>({ listening: false });

	userRings = this._userRings.readOnly();
	currentRingBattery = this._currentRingBattery.readOnly();
	currentRingSyncState = this._currentRingSyncState.readOnly();
	currentRingLiveData = this._currentRingLiveData.readOnly();

	constructor(
		private readonly userService: UserService,
		private readonly deviceService: DeviceService,
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
		this.listenBattery();
		this.syncData();
	}

	listenLiveData() {
		this._currentRingLiveData.set({ listening: true });
		return this.deviceService.listen("FBL1", Channel.LIVE, (value) => {
			if (value) {
				const deserializedData = deserializeLiveData(value);
				if (deserializedData) {
					this._currentRingLiveData.update((c) => {
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
		const oldNamedRings = this._userRings.get();
		const rings = await this.ringApi.getRings();
		const newNamedRings: NamedUserRing[] = rings.map((r) => {
			return {
				...r,
				name:
					oldNamedRings.filter((oldRing) => {
						return oldRing.id === r.id;
					})[0].name ?? "?",
			};
		});
		this._userRings.set(newNamedRings);
	}

	stopLiveData() {
		this._currentRingLiveData.update((c) => ({ ...c, listening: false }));
		return this.deviceService.write("FBL0");
	}

	listenBattery() {
		return this.deviceService.listen(Channel.BATTERY, Channel.BATTERY, (value) => {
			if (value) {
				this._currentRingBattery.set(deserializeBattery(value));
			}
		});
	}

	async registerConnectedRing() {
		const id = await this.deviceService.getResponse(Channel.MAC);
		const firmware = await this.deviceService.getResponse(Channel.FIRMWARE_VERSION);
		const deviceName = this.deviceService.favoriteDevice.get()?.name;
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
			try {
				await this.ringApi.deleteRing(ring.id);
				const newUserRings = this._userRings.get().filter((r) => r.id !== ringToDelete.id);
				this._userRings.set(newUserRings);
				await this.userRingsStorage.save(newUserRings);
				if (this.deviceService.favoriteDevice.get()?.name === ringToDelete.name) {
					await this.deviceService.disconnect();
				}
			} catch (e) {
				this.logger.warn("Delete ring failed : " + e);
				throw e;
			}
		} else {
			throw new Error("Unknown ring");
		}
	}

	async syncData() {
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
					await this.ringApi.sendData(allData);
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
