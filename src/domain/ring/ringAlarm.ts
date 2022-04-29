import dayjs from "dayjs";

export enum Weekdays {
	SUNDAY = "SUNDAY",
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	THURSDAY = "THURSDAY",
	FRIDAY = "FRIDAY",
	SATURDAY = "SATURDAY",
}

export enum Melody {
	NOTIF1 = "notif1",
	NOTIF2 = "notif2",
	NOTIF3 = "notif3",
	NOTIF4 = "notif4",
	ALERT = "alert",
	HEARTBEAT = "heartbeat",
	QUICK = "quick",
	RAPID = "rapid",
	SOS = "sos",
	STACCATO = "staccato",
	SYMPHONY = "symphony",
}

export interface AlarmTime {
	hour: number;
	minute: number;
}

export interface RingAlarm {
	id: number;
	snooze: number;
	smart: number;
	isActivated: boolean;
	isExisting: boolean;
	isSmart: boolean;
	weekdays: Weekdays[];
	time: AlarmTime;
	vibrationPower: number;
	vibrationRepetition: number;
	melody: Melody;
	label: string;
}

export const weekdaysOrderedList = [
	Weekdays.SUNDAY,
	Weekdays.MONDAY,
	Weekdays.TUESDAY,
	Weekdays.WEDNESDAY,
	Weekdays.THURSDAY,
	Weekdays.FRIDAY,
	Weekdays.SATURDAY,
];

export const melodyOrderedList = [
	Melody.NOTIF1,
	Melody.NOTIF2,
	Melody.NOTIF3,
	Melody.NOTIF4,
	Melody.ALERT,
	Melody.HEARTBEAT,
	Melody.QUICK,
	Melody.RAPID,
	Melody.SOS,
	Melody.STACCATO,
	Melody.SYMPHONY,
];

const melodyIds: { [key in Melody]: string } = {
	[Melody.NOTIF1]: "00",
	[Melody.NOTIF2]: "01",
	[Melody.NOTIF3]: "02",
	[Melody.NOTIF4]: "03",
	[Melody.ALERT]: "04",
	[Melody.HEARTBEAT]: "05",
	[Melody.QUICK]: "06",
	[Melody.RAPID]: "07",
	[Melody.SOS]: "08",
	[Melody.STACCATO]: "09",
	[Melody.SYMPHONY]: "0A",
};

function activationHexToData(activationHex: string): {
	snooze: number;
	smart: number;
	isActivated: boolean;
	isExisting: boolean;
} {
	const activationDec = parseInt(activationHex, 16);
	const isExisting = !(activationDec & 1);
	const isActivated = !!((activationDec >> 1) & 1);

	const smart = (activationDec >> 2) & 0x7;
	const snooze = (activationDec >> 5) & 0x7;

	return { snooze, smart, isActivated, isExisting };
}

function dataToActivationHex(snooze: number, smart: number, isActivated: boolean, isExisting: boolean): string {
	const activatedValue = isActivated ? 1 : 0;
	const existingValue = isExisting ? 0 : 1;
	const activationValue = (((((snooze << 3) + smart) << 1) + activatedValue) << 1) + existingValue;

	return activationValue.toString(16).padStart(2, "0");
}

export function deserializeAlarmData(alarmData: string): RingAlarm | undefined {
	const alarmDataMessageRegex = /ALR(\w\w)r(\w\w)h(\w\w)m(\w\w)v(\w\w)n(\w\w)M(\w\w)i(\w\w)L((?:\w|\W)*)/;
	const matches = alarmData.match(alarmDataMessageRegex);

	if (alarmData === "ALREOS") {
		return;
	}
	if (!matches) {
		throw Error("Invalid alarm data message " + alarmData);
	}

	const [activationHex, weekdayHex, hour, min, vibrationPower, vibrationRepetition, melodyHex, alarmId, alarmLabel] =
		matches.slice(1);

	const { snooze, smart, isActivated, isExisting } = activationHexToData(activationHex);

	const weekdays: Weekdays[] = [];
	const weekdayDec = parseInt(weekdayHex, 16);
	let index = 0;
	while (index < 7) {
		const lastBit = (weekdayDec >> index) & 1;
		if (lastBit === 1) {
			weekdays.push(weekdaysOrderedList[index]);
		}
		index += 1;
	}
	const isSmart = (weekdayDec >> 7) & 1;

	const time = fromGMT({ hour: Number(hour), minute: Number(min) });

	return {
		id: parseInt(alarmId, 16),
		isExisting,
		isActivated,
		isSmart: !!isSmart,
		vibrationPower: parseInt(vibrationPower, 16),
		vibrationRepetition: Number(vibrationRepetition),
		snooze,
		smart,
		label: alarmLabel,
		melody: melodyOrderedList[parseInt(melodyHex, 16)],
		weekdays,
		time,
	};
}

export function serializeAlarmData(alarmData: RingAlarm): string {
	const {
		id,
		snooze,
		smart,
		isActivated,
		isExisting,
		isSmart,
		weekdays,
		time,
		vibrationPower,
		vibrationRepetition,
		melody,
		label,
	} = alarmData;

	const melodyHex = melodyIds[melody];

	let weekdaysValue = 0;
	for (let i = 0; i < weekdays.length; i++) {
		const weekdaysIndex = weekdaysOrderedList.findIndex((value) => value === weekdays[i]);
		if (weekdaysIndex > -1) {
			weekdaysValue += Math.pow(2, weekdaysIndex);
		}
	}
	if (isSmart) {
		weekdaysValue += Math.pow(2, 7);
	}

	const gmtTime = toGMT(time);

	return (
		"ALR" +
		dataToActivationHex(snooze, smart, isActivated, isExisting) +
		"r" +
		weekdaysValue.toString(16).padStart(2, "0") +
		"h" +
		gmtTime.hour.toString().padStart(2, "0") +
		"m" +
		gmtTime.minute.toString().padStart(2, "0") +
		"v" +
		vibrationPower.toString(16).padStart(2, "0") +
		"n" +
		"0" +
		vibrationRepetition +
		"M" +
		melodyHex +
		"i" +
		(id < 10 ? "0" + id.toString(16) : id.toString(16)) +
		"L" +
		label
	);
}

export function getAlarmId(alarmData: string): number {
	const alarmDataMessageRegex = /(\w\w)r(\w\w)h(\w\w)m(\w\w)v(\w\w)n(\w\w)M(\w\w)i(\w\w)L((?:\w|\W)*)/;
	const matches = alarmData.match(alarmDataMessageRegex);

	if (!matches) {
		throw Error("Invalid alarm data message " + alarmData);
	}

	const [, , , , , , , alarmId] = matches.slice(1);

	return parseInt(alarmId, 16);
}

export function serializeMelody(melody: Melody, power: number) {
	return "PRE" + melodyIds[melody] + power.toString(16);
}

function toGMT(time: AlarmTime): AlarmTime {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	const dateJS = dayjs(date);
	const utcOffset = dateJS.utcOffset();
	const gmtDate = dateJS.add(-utcOffset, "minute").toDate();
	return { hour: gmtDate.getHours(), minute: gmtDate.getMinutes() };
}

function fromGMT(time: AlarmTime): AlarmTime {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	const dateJS = dayjs(date);
	const utcOffset = dateJS.utcOffset();
	const gmtDate = dateJS.add(utcOffset, "minute").toDate();
	return { hour: gmtDate.getHours(), minute: gmtDate.getMinutes() };
}

export function alarmTimeToDate(time: AlarmTime): Date {
	const date = new Date();
	date.setHours(time.hour);
	date.setMinutes(time.minute);
	return date;
}

export function dateToAlarmTime(date: Date): AlarmTime {
	return { hour: date.getHours(), minute: date.getMinutes() };
}
