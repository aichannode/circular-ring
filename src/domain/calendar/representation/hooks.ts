import { ApiService } from "@core/api/apiService";
import { Calendar } from "@domain/calendar/calendar";
import { toUTCISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { deduplicate } from "@ui/utils/filter";
import moment from "moment";
import { createActions } from "../actions";
import { CalendarApi } from "../actions/lib/calendarApi";
import { CalendarErrorContext } from "../common/type";
import { CalendarModel } from "../model/calendarModel";
import { createNAPs } from "./NAPs";

export function createRepresentation(apiService: ApiService, model: CalendarModel) {
	const calendarApi = new CalendarApi(apiService);
	const actions = createActions(calendarApi, model.present);

	// Start NAPs
	createNAPs(model, calendarApi, actions);

	function useCalendar(isoLocalDay: ISODay): Calendar | undefined {
		return model.UTCMonthNotes.find((cal) => {
			return cal.day.includes(toUTCISODay(isoLocalDay));
		});
	}

	return {
		actions,
		hooks: {
			useCalendar,

			useTags() {
				return model.categoryTags;
			},

			useTagCategories() {
				return model.tagCategories;
			},

			useErrors(context: CalendarErrorContext) {
				return model.errors.get(context);
			},

			useDailyTags(isoDay: ISODay) {
				return (
					useCalendar(isoDay)
						?.notes.filter(
							(note) =>
								moment(note.startTime).startOf("day") <= moment(isoDay) &&
								moment(isoDay) <= moment(note.endTime).endOf("day")
						)
						.flatMap((note) => note.tag)
						.filter(deduplicate("id")) ?? []
				);
			},
		},
	};
}
