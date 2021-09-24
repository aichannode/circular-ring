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
	DISCHARGE = "discharge",
}

export interface RingAlarm {
	id: number;
	snooze: number;
	smart: number;
	isActivated: boolean;
	isExisting: boolean;
	weekdays: Weekdays[];
	time: Date;
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
	Melody.DISCHARGE,
];

const snoozeTime = [0, 1, 2, 5, 10, 15];

export function activationHexToData(activationHex: string): {
	snooze: number;
	smart: number;
	isActivated: boolean;
	isExisting: boolean;
} {
	const activationDec = parseInt(activationHex, 16);
	const isExisting = !(activationDec & 1);
	const isActivated = !((activationDec >> 1) & 1);

	const smartValue = (activationDec >> 2) & 0x7;
	const snoozeValue = (activationDec >> 5) & 0x7;
	const smart = smartValue === 0 ? 0 : 15 * smartValue + 15;

	return { snooze: snoozeTime[snoozeValue], smart, isActivated, isExisting };
}

export function dataToActivationHex(snooze: number, smart: number, isActivated: boolean, isExisting: boolean): string {
	const snoozeValue = snoozeTime.findIndex((value) => value === snooze);
	const smartValue = smart === 0 ? 0 : (smart - 15) / 15;
	const activatedValue = isActivated ? 0 : 1;
	const existingValue = isExisting ? 0 : 1;

	return ((((((snoozeValue << 3) + smartValue) << 1) + activatedValue) << 1) + existingValue).toString(16);
}

export function deserializeAlarmData(alarmData: string): RingAlarm | undefined {
	const alarmDataMessageRegex = /ALR(\w\w)r(\w\w)h(\w\w)m(\w\w)v(\w\w)n(\w\w)M(\w\w)i(\w\w)L((?:\w|\W)*)/;
	const matches = alarmData.match(alarmDataMessageRegex);

	if (alarmData === "FBLEOS") {
		return;
	}
	if (!matches) {
		throw Error("Invalid live data message " + alarmData);
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

export function serializeAlarmData(alarmData: RingAlarm): string {
	const {
		id,
		snooze,
		smart,
		isActivated,
		isExisting,
		weekdays,
		time,
		vibrationPower,
		vibrationRepetition,
		melody,
		label,
	} = alarmData;

	const melodyHex = melodyOrderedList.findIndex((value) => value === melody).toString(16);

	let weekdaysValue = 0;
	for (let i = 0; i < weekdays.length; i++) {
		const weekdaysIndex = weekdaysOrderedList.findIndex((value) => value === weekdays[i]);
		if (weekdaysIndex > -1) {
			weekdaysValue += Math.pow(2, weekdaysIndex);
		}
	}

	return (
		"ALR" +
		dataToActivationHex(snooze, smart, isActivated, isExisting) +
		"r" +
		weekdaysValue.toString(16) +
		"h" +
		time.getHours() +
		"m" +
		time.getMinutes() +
		"v" +
		vibrationPower +
		"n" +
		vibrationRepetition +
		"M" +
		melodyHex +
		"i" +
		id.toString(16) +
		"L" +
		label
	);
}

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
	[Melody.DISCHARGE]: "0B",
};
export function serializeMelody(melody: Melody, power: number) {
	return "PRE" + melodyIds[melody] + power.toString(16);
}
