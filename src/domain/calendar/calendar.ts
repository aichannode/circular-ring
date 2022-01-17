import { WordingKey } from "src/wordings";

export type CalendarTag = Readonly<{
	id: number;
	name: string;
	system: boolean;
	categoryId: number;
}>;

export type CalendarTagCategory = {
	id: number;
	label: WordingKey;
	order: number;
};

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
