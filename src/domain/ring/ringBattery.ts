export enum RingBatteryStatus {
	DISCHARGING = "DISCHARGING",
	CHARGING = "CHARGING",
	CHARGED = "CHARGED",
	FAULT = "FAULT",
}

export interface RingBattery {
	charge: number;
	status: RingBatteryStatus;
}

const statusFromCodes = {
	"00": RingBatteryStatus.DISCHARGING,
	"01": RingBatteryStatus.CHARGING,
	"02": RingBatteryStatus.CHARGED,
	"03": RingBatteryStatus.FAULT,
} as const;

export function deserializeBattery(battery: string): RingBattery {
	const batteryMessageRegex = /BAT(\d\d0?)\/(0[0|1|2|3])/;
	const matches = battery.match(batteryMessageRegex);

	if (!matches) {
		throw Error("Invalid battery message " + battery);
	}

	const [batteryLevel, batteryStatusCode] = matches.slice(1);
	return {
		charge: +batteryLevel,
		status: statusFromCodes[batteryStatusCode as keyof typeof statusFromCodes],
	};
}
