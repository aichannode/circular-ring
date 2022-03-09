import { ApiService } from "@core/api/apiService";
import { Calendar } from "@domain/calendar/calendar";
import { deduplicate } from "@ui/utils/filter";
import moment from "moment";
import { createActions } from "../actions";
import { CalendarApi } from "../actions/lib/calendarApi";
import { CalendarModel } from "../model/calendarModel";
import { createNAPs } from "./NAPs";

export function createRepresentation(apiService: ApiService, model: CalendarModel) {
	const calendarApi = new CalendarApi(apiService);
	const actions = createActions(calendarApi, model.present);

	// Start NAPs
	createNAPs(model, calendarApi, actions);

	function useCalendar(isoDay: string): Calendar | undefined {
		return model.month.find((cal) => {
			return cal.day.includes(isoDay);
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

			useDailyTags(isoDay: string) {
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
