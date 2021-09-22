import { useMemo } from "react";

export enum Weekdays {
	SUNDAY = "SUNDAY",
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	FRIDAY = "FRIDAY",
	THURSDAY = "THURSDAY",
	SATURDAY = "SATURDAY",
}

export enum Melody {
	NOTIF1 = "NOTIF1",
	NOTIF2 = "NOTIF2",
	NOTIF3 = "NOTIF3",
	NOTIF4 = "NOTIF4",
	ALERT = "ALERT",
	HEARTBEAT = "HEARTBEAT",
	QUICK = "QUICK",
	RAPID = "RAPID",
	SOS = "SOS",
	STACCATO = "STACCATO",
	SYMPHONY = "SYMPHONY",
	DISCHARGE = "DISCHARGE",
}

export interface RingAlarm {
	id: number;
	isActivated: boolean;
	isExisting: boolean;
	snooze: number;
	smart: number;
	melody: Melody;
	weekdays: Weekdays[];
	vibrationPower: number;
	vibrationRepetition: number;
	time: Date;
	label: string;
}

export function activationHexToData(activationHex: string): {
	snooze: number;
	smart: number;
	isActivated: boolean;
	isExisting: boolean;
} {
	const snoozeTime = [0, 1, 2, 5, 10, 15];
	const activationDec = parseInt(activationHex, 16);
	const isExisting = !(activationDec & 1);
	const isActivated = !((activationDec >> 1) & 1);

	const smartValue = (activationDec >> 2) & 0x7;
	const snoozeValue = (activationDec >> 5) & 0x7;
	const smart = 15 * smartValue + 15;

	return { snooze: snoozeTime[snoozeValue], smart, isActivated, isExisting };
}

export function deserializeAlarmData(alarmData: string) {
	const alarmDataMessageRegex = /ALR(\w\w)r(\w\w)h(\w\w)m(\w\w)v(\w\w)n(\w\w)M(\w\w)i(\w\w)L((?:\w|\W)*)/;
	const matches = alarmData.match(alarmDataMessageRegex);

	if (alarmData === "FBLEOS") {
		return;
	}
	if (!matches) {
		throw Error("Invalid live data message " + alarmData);
	}

	const weekdaysOrderedList = useMemo(
		() => [
			Weekdays.SUNDAY,
			Weekdays.MONDAY,
			Weekdays.TUESDAY,
			Weekdays.WEDNESDAY,
			Weekdays.THURSDAY,
			Weekdays.FRIDAY,
			Weekdays.SATURDAY,
		],
		[]
	);

	const melodyOrderedList = useMemo(
		() => [
			Melody.NOTIF1,
			Melody.NOTIF2,
			Melody.NOTIF3,
			Melody.NOTIF4,
			Melody.HEARTBEAT,
			Melody.QUICK,
			Melody.RAPID,
			Melody.SOS,
			Melody.STACCATO,
			Melody.SYMPHONY,
			Melody.DISCHARGE,
		],
		[]
	);

	const [activationHex, weekdayHex, hour, min, vibrationPower, vibrationRepetition, melodyHex, alarmId, alarmLabel] =
		matches.slice(1);

	const { snooze, smart, isActivated, isExisting } = activationHexToData(activationHex);

	const weekdays: Weekdays[] = [];
	let weekdayDec = parseInt(weekdayHex, 16);
	let index = 0;
	while (weekdayDec > 0) {
		const lastBit = weekdayDec % 2;
		if (lastBit === 1) {
			weekdays.push(weekdaysOrderedList[index]);
		}
		weekdayDec %= 2;
		index += 1;
	}

	const time = new Date();
	time.setHours(Number(hour));
	time.setMinutes(Number(min));

	return {
		id: Number(alarmId),
		isExisting,
		isActivated,
		vibrationPower: Number(vibrationPower),
		vibrationRepetition: Number(vibrationRepetition),
		snooze,
		smart,
		label: alarmLabel,
		melody: melodyOrderedList[parseInt(melodyHex, 16)],
		weekdays,
		time,
	};
}
