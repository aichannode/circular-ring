import { useServices } from "@core/services";
import { PopularTagCategory } from "@domain/calendar/calendarService";
import { useObservable } from "micro-observables";

export function useAllTags() {
	const { calendarService } = useServices();
	return useObservable(calendarService.tagMap);
}

export function usePopularTags() {
	const { calendarService } = useServices();
	return useObservable(calendarService.tagMap).get(PopularTagCategory) ?? [];
}
