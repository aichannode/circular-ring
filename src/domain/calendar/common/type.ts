import { Calendar, CalendarNote, CalendarTag, CalendarTagCategory } from "../calendar";

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
	  };

export type Proposal = Mutations[];
