import { DeviceService } from "@domain/device/deviceService";
import { observable } from "micro-observables";
import { deserializeBattery, RingBattery } from "./ringBattery";

export class RingService {
	private _ringBattery = observable<RingBattery | null>(null);

	ringBattery = this._ringBattery.readOnly();

	constructor(private readonly deviceService: DeviceService) {
		this._ringBattery.subscribe((v) => {
			this.log(v?.charge, v?.status);
		});
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

	log(...args: unknown[]) {
		console.log("💍 [RING]", ...args);
	}
}
