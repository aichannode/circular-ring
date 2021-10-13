export interface CalendarTag {
	id: number;
	name: string;
	system: boolean;
	category: string;
}

export interface CalendarNote {
	id: number;
	startTime: Date;
	endTime: Date;
	tag: CalendarTag;
}

export interface Calendar {
	day: string; // ymd
	streak: boolean;
	notes: CalendarNote[];
}
