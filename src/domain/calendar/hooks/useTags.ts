import { useServices } from "@core/services";
import { deduplicate } from "@ui/utils/filter";
import { useObservable } from "micro-observables";
import moment from "moment";
import { useCalendar } from "./useCalendar";

export function useTags() {
	const { calendarService } = useServices();
	return useObservable(calendarService.tagMap);
}

export function useTagCategories() {
	const { calendarService } = useServices();
	return useObservable(calendarService.categories);
}

export function useDailyTags(isoDay: string) {
	return (
		useCalendar(isoDay)
			?.notes.filter(
				(note) =>
					moment(note.startTime).startOf("day") <= moment(isoDay) && moment(isoDay) <= moment(note.endTime).endOf("day")
			)
			.flatMap((note) => note.tag)
			.filter(deduplicate("id")) ?? []
	);
}
