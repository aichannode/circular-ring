import { getLogger } from "@core/logger/logger";
import { Present } from "@core/model";
import { toLocale } from "@domain/common/business";
import { CalendarNote, CalendarTag } from "../calendar";
import { CalendarErrorContext, CUSTOM_TAG_CATEGORY_ID, Proposal } from "../common/type";
import { CalendarApi } from "./lib/calendarApi";

export function createActions(calendarApi: CalendarApi, present: Present<Proposal>) {
	async function setMonthCalendars({
		isoLocalDate,
		useForceRefresh,
	}: {
		isoLocalDate: string;
		useForceRefresh?: boolean;
	}) {
		try {
			const data = await calendarApi.getMonthCalendars({ isoLocalDate, useForceRefresh });
			present([
				{
					type: "setMonthCalendars",
					payload: data.map((calendarDto) => ({
						day: calendarDto.date,
						streak: calendarDto.streak,
						notes: calendarDto.notes.map((note) => ({
							id: note.id,
							startTime: new Date(note.startTime),
							endTime: new Date(note.endTime),
							tag: note.tag,
						})),
					})),
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
				setMonthCalendars({
					isoLocalDate: toLocale(startTime.toISOString()),
					useForceRefresh: true,
				});
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

		deleteNote: function (note: CalendarNote) {
			present([
				{
					type: "deleteNote",
					payload: {
						id: note.id,
					},
				},
			]);
		},
	};
}

export type CalendarActions = ReturnType<typeof createActions>;
