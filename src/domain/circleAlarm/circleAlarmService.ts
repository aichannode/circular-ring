import { getLogger } from "@core/logger/logger";
import { Channel } from "@domain/device/channels";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import {
	deserializeAlarmData,
	getAlarmId,
	Melody,
	RingAlarm,
	serializeAlarmData,
	serializeMelody,
} from "@domain/ring/ringAlarm";
import { alarmDataEOF } from "@domain/ring/ringData";
import { observable } from "micro-observables";
import { Storage } from "@core/storage";

const quickAccessAlarmStorageKey = "@quickAccessAlarm";
const ID_FOR_CREATION = 255;
export const MAX_ALARMS = 16;

export class CircleAlarmService {
	private logger = getLogger("⏰ CircleAlarmService");

	private _ringAlarms = observable<RingAlarm[]>([]);
	quickAccessRingAlarmId = observable<RingAlarm | null>(null);
	ringAlarms = this._ringAlarms.readOnly();

	constructor(private readonly deviceService: BleDeviceService) {
		this.loadQuickAccessAlarmFromStorage();
	}

	saveQuickAccessAlarm(quickAccessAlarm: RingAlarm) {
		this.quickAccessRingAlarmId.update(() => ({ ...quickAccessAlarm }));
		Storage.save(quickAccessAlarmStorageKey, quickAccessAlarm);
	}

	async loadQuickAccessAlarmFromStorage() {
		const quickAccessAlarmStorage = await Storage.load<RingAlarm | null>(quickAccessAlarmStorageKey);
		this.quickAccessRingAlarmId.set(quickAccessAlarmStorage);
	}

	async fetchAlarmList() {
		this.logger.info("Retrieving alarm data...");
		const allData = await new Promise<string>(async (resolve) => {
			let data = "";

			const unsubscribe = await this.deviceService.listen(Channel.ALARM, Channel.ALARM, (value) => {
				if (value !== alarmDataEOF) {
					data += "," + value.trim();
				}
				if (value === alarmDataEOF) {
					unsubscribe();
					resolve(data);
				}
			});
		});
		const encodeAlarmList = allData.split(",");
		const newAlarmList: RingAlarm[] = [];
		for (let i = 1; i < encodeAlarmList.length; i++) {
			const data = deserializeAlarmData(encodeAlarmList[i]);

			if (data) {
				newAlarmList.push(data);
			}
		}
		this._ringAlarms.set(newAlarmList);
	}

	async createAlarm(alarm: Omit<RingAlarm, "id" | "isExisting" | "isActivated">) {
		const response = await this.deviceService.getResponse(
			serializeAlarmData({ ...alarm, id: ID_FOR_CREATION, isExisting: true, isActivated: true }),
			Channel.ALARM
		);
		if (!response) {
			this.logger.warn("No response after alarm creation");
			throw Error("Invalid alarm data message " + response);
		}
		const id = getAlarmId(response);
		this._ringAlarms.update((alarms) => [...alarms, { ...alarm, id, isExisting: true, isActivated: true }]);
		return { ...alarm, id, isExisting: true, isActivated: true };
	}

	playMelody(melody: Melody, power: number) {
		return this.deviceService.write(serializeMelody(melody, power));
	}

	async deleteAlarm(alarm: RingAlarm) {
		await this.deviceService.write(serializeAlarmData({ ...alarm, isExisting: false }));
		this._ringAlarms.update((alarms) => alarms.filter((el) => el.id !== alarm.id));
	}

	async updateAlarm(alarm: RingAlarm) {
		await this.deviceService.write(serializeAlarmData({ ...alarm, isExisting: true }));
		this._ringAlarms.update((alarms) => alarms.map((el) => (el.id === alarm.id ? { ...el, ...alarm } : el)));
	}
}
