import { reaction } from "mobx";
import moment from "moment";
import { CalendarActions } from "../actions";
import { CalendarApi } from "../actions/lib/calendarApi";
import { CalendarModel } from "../model/calendarModel";

export function createNAPs(model: CalendarModel, calendarApi: CalendarApi, actions: CalendarActions) {
	/**
	 * This nap does the server verification for the optimistic UI update note action.
	 * The tag is already updated locally, we now:
	 * 1- call the DELETE end point
	 * 2- refetch data
	 */
	reaction(
		() => model.lastAcceptedMutations.map((m) => m),
		async function (mutations) {
			mutations.forEach(async (mutation) => {
				if (mutation?.type === "updateNote") {
					await calendarApi.updateNote(mutation.payload);
					actions.setMonthCalendars({
						isoMonth: moment(mutation.payload.startTime).format("YYYY-MM"),
						useForceRefresh: true,
					});
				}
			});
		}
	);

	/**
	 * This nap does the server verification for the optimistic UI delete note action.
	 * The note is already deleted locally, we now:
	 * 1- call the DELETE end point
	 * 2- refetch data
	 */
	reaction(
		() => model.lastAcceptedMutations.map((m) => m),
		async function (mutations) {
			mutations.forEach(async (mutation) => {
				if (mutation?.type === "deleteNote") {
					await calendarApi.deleteNote(mutation.payload.id);
					actions.setMonthCalendars({
						// CIR-733 Take a day in the middle of the month to prevent getting the
						// last day of the month before when you are in a negative zone
						isoMonth: model.month[10]?.day,
						useForceRefresh: true,
					});
				}
			});
		}
	);

	/**
	 * This nap does the server verification for the optimistic UI delete tag action.
	 * The tag is already deleted locally, we now:
	 * 1- call the DELETE end point
	 * 2- refetch data
	 */
	reaction(
		() => model.lastAcceptedMutations.map((m) => m),
		async function (mutations) {
			mutations.forEach(async (mutation) => {
				if (mutation?.type === "deleteTag") {
					await calendarApi.deleteTag(mutation.payload.id);
					actions.fetchAllTags({ useForceRefresh: true });
				}
			});
		}
	);
}
