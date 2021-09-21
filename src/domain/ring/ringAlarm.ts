export enum Weekdays {
	SUNDAY = "SUNDAY",
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	FRIDAY = "FRIDAY",
	THURSTDAY = "THURSTDAY",
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
	isDisabled: boolean;
	snooze: number;
	smart: number;
	melody: Melody;
	weekdays: Weekdays[];
	vibrationPower: number;
	vibrationRepetition: number;
	time: Date;
	label: string;
}
