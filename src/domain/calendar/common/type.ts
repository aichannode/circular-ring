import { Calendar, CalendarNote, CalendarTag, CalendarTagCategory } from "../calendar";

export const CUSTOM_TAG_CATEGORY_ID = -1;

export type Mutations =
	| {
			type: "setMonthCalendars";
			payload: Calendar[];
	  }
	| {
			type: "setTags";
			payload: Map<number, Readonly<CalendarTag>[]>;
	  }
	| {
			type: "setTagCategories";
			payload: CalendarTagCategory[];
	  }
	| {
			type: "deleteNote";
			payload: {
				id: number;
			};
	  }
	| {
			type: "deleteTag";
			payload: {
				id: number;
			};
	  }
	| {
			type: "updateNote";
			payload: CalendarNote;
	  }
	| {
			type: "setError";
			payload: {
				context: CalendarErrorContext;
				// Omit field to delete error
				code?: 409;
			};
	  };

export enum CalendarErrorContext {
	TAG_CREATE = "TAG_CREATE",
}

export type Proposal = Mutations[];
