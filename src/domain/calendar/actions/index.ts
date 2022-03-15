import { getLogger } from "@core/logger/logger";
import { Present } from "@core/model";
import { action } from "mobx";
import moment from "moment";
import { CalendarNote, CalendarTag } from "../calendar";
import { CalendarErrorContext, CUSTOM_TAG_CATEGORY_ID, Proposal } from "../common/type";
import { CalendarApi } from "./lib/calendarApi";

export function createActions(calendarApi: CalendarApi, present: Present<Proposal>) {
	async function setMonthCalendars({ isoMonth, useForceRefresh }: { isoMonth: string; useForceRefresh?: boolean }) {
		try {
			const calendarList = await calendarApi.getMonthCalendars({ isoMonth, useForceRefresh });
			present([
				{
					type: "setMonthCalendars",
					payload: calendarList,
				},
			]);
		} catch (error) {
			getLogger("Calendar Actions").warn("Error retrieving calendars :", error);
			throw error;
		}
	}

	async function fetchAllTags({
		useForceRefresh,
	}: {
		/**
		 * By pass the front end cache level
		 */
		useForceRefresh: boolean;
	}) {
		try {
			const tags = await calendarApi.getAllTags({ useForceRefresh });
			const categories = await calendarApi.getCategories({
				ids: [...new Set(tags.map(({ categoryId: category }) => category))], // extract deduplicated category ids
				useForceRefresh,
			});
			const filteredTags = new Map(
				categories.map((category) => [category.id, tags.filter((tag) => tag.categoryId === category.id)])
			);
			filteredTags.set(
				CUSTOM_TAG_CATEGORY_ID,
				tags.filter((tag) => !tag.system)
			);

			present([
				{
					type: "setTags",
					payload: filteredTags,
				},
				{
					type: "setTagCategories",
					payload: categories.sort((a, b) => a.order - b.order),
				},
			]);
		} catch (e) {
			getLogger("Calendar Actions").warn("Error retrieving tags :", e);
		}
	}

	return {
		setMonthCalendars,
		/**
		 * Fetch all the available tags.
		 */
		fetchAllTags,
		/**
		 * Create a new tag.
		 * Note: tag creation is not offline or wide-scope-optimistic-UI compatible.
		 * So we simply call the create API and wait for the OK response to re fetch all data.
		 */
		async createTag(name: string) {
			try {
				await calendarApi.createCustomTag(name);
				fetchAllTags({ useForceRefresh: true });
				present([
					// Remove eventual error
					{
						type: "setError",
						payload: {
							context: CalendarErrorContext.TAG_CREATE,
						},
					},
				]);
			} catch (e) {
				const error = e as { message: string; statusCode: 409 };
				getLogger("Calendar Actions").warn("Error while creating tag :", error);
				present([
					{
						type: "setError",
						payload: {
							context: CalendarErrorContext.TAG_CREATE,
							code: error.statusCode,
						},
					},
				]);
			}
		},
		async deleteTag(id: number) {
			present([
				{
					type: "deleteTag",
					payload: {
						id,
					},
				},
			]);
		},

		/**
		 * Create a new tag.
		 * Note: note creation is not offline or wide-scope-optimistic-UI compatible.
		 * So we simply call the create API and wait for the OK response to re fetch all data.
		 */
		async createNote(tags: CalendarTag[], startTime: Date, endTime: Date) {
			try {
				await calendarApi.createNote(tags, startTime, endTime);
				// Use UTC to prevent offset when creating a note from negative timezone
				// (eg: otherwize create a note in the USA at 20:00 will be set at 05:00 the day after)
				setMonthCalendars({ isoMonth: moment.utc(startTime).format("YYYY-MM"), useForceRefresh: true });
			} catch (e) {
				getLogger("Calendar Actions").warn("Error while creating note :", e);
			}
		},

		updateNote(note: CalendarNote) {
			present([
				{
					type: "updateNote",
					payload: note,
				},
			]);
		},

		deleteNote: action(async function (note: CalendarNote) {
			present([
				{
					type: "deleteNote",
					payload: {
						id: note.id,
					},
				},
			]);
		}),
	};
}

export type CalendarActions = ReturnType<typeof createActions>;
