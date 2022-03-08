import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export function useTags() {
	const { calendarService } = useServices();
	return useObservable(calendarService.tagMap);
}

export function useTagCategories() {
	const { calendarService } = useServices();
	return useObservable(calendarService.categories);
}

export function useDailyTags(isoDay: string) {
	return [
		{
			categoryId: 0,
			id: 0,
			name: "sleep",
			system: true,
		},
		{
			categoryId: 1,
			id: 1,
			name: "alcohol",
			system: true,
		},
	];
	// @TODO: Fix this hook.
	// return (
	// 	useCalendar(isoDay)
	// 		?.notes.filter(
	// 			(note) =>
	// 				moment(note.startTime).startOf("day") <= moment(isoDay) && moment(isoDay) <= moment(note.endTime).endOf("day")
	// 		)
	// 		.flatMap((note) => note.tag)
	// 		.filter(deduplicate("id")) ?? []
	// );
}
