import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import {
	deserializeAlarmData,
	RingAlarm,
	serializeAlarmData,
	getAlarmId,
	serializeMelody,
	Melody,
} from "@domain/ring/ringAlarm";
import { alarmDataEOF } from "@domain/ring/ringData";
import { observable } from "micro-observables";

const ID_FOR_CREATION = 255;

export class CircleAlarmService {
	private _ringAlarms = observable<RingAlarm[]>([]);
	ringAlarms = this._ringAlarms.readOnly();

	constructor(private readonly deviceService: DeviceService) {}

	async fetchAlarmList() {
		this.log("Retrieving data...");
		const allData = await new Promise<string>(async (resolve) => {
			let data = "";

			const unsubscribe = await this.deviceService.listen(Channel.ALARM, Channel.ALARM, (value) => {
				this.log("ALR value", value);

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
		if (encodeAlarmList) {
			for (let i = 1; i < encodeAlarmList.length; i++) {
				const data = deserializeAlarmData(encodeAlarmList[i]);
				if (data) {
					newAlarmList.push(data);
				}
			}
			this._ringAlarms.set(newAlarmList);
		}
	}

	async createAlarm(alarm: Omit<RingAlarm, "id">) {
		const response = await this.deviceService.getResponse(serializeAlarmData({ ...alarm, id: ID_FOR_CREATION }));
		if (!response) {
			throw Error("Invalid live data message " + response);
		}
		const id = getAlarmId(response);
		this._ringAlarms.update((alarms) => [...alarms, { ...alarm, id }]);
	}

	playMelody(melody: Melody, power: number) {
		return this.deviceService.write(serializeMelody(melody, power));
	}

	// async removeAlarm(alarm: RingAlarm) {

	// }

	async updateAlarm(alarm: RingAlarm) {
		await this.deviceService.getResponse(serializeAlarmData(alarm));
		this._ringAlarms.update((alarms) => alarms.map((el, i) => (i === alarm.id ? { ...el, ...alarm } : el)));
	}

	log(...args: unknown[]) {
		console.log("💍 [ALARM]", ...args);
	}
}
