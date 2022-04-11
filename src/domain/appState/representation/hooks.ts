import { useServices } from "@core/services";
import { CalendarTag } from "@domain/calendar/calendar";
import { useObservable } from "micro-observables";

export function useLastUsedTags() {
	const service = useServices().appStateService;
	return {
		lastUsedTags: useObservable(service.lastUsedTags),
		// Actions
		actions: {
			setLastUsedTags(tags: CalendarTag[]) {
				tags
					.reverse() // CIR-402: tags are display in order of usage
					.forEach(service.mutator_addLastUsedTag);
			},
		},
	};
}
