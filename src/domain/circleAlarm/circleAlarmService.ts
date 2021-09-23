import { Channel } from "@domain/device/channels";
import { DeviceService } from "@domain/device/deviceService";
import { deserializeAlarmData, RingAlarm, serializeAlarmData } from "@domain/ring/ringAlarm";
import { alarmDataEOF } from "@domain/ring/ringData";
import { observable } from "micro-observables";

export class CircleAlarmService {
	private _ringAlarms = observable<RingAlarm[] | null>(null);
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

	// async createAlarm(alarm: RingAlarm) {

	// }

	// async removeAlarm(alarm: RingAlarm) {

	// }

	async updateAlarm(alarm: RingAlarm) {
		const response = await this.deviceService.getResponse(serializeAlarmData(alarm));
		console.log(response);
	}

	log(...args: unknown[]) {
		console.log("💍 [ALARM]", ...args);
	}
}
