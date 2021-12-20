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
