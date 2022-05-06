import { ApiService } from "@core/api/apiService";
import { toServerDate } from "@core/utils";
import { CalendarNote, CalendarTag, CalendarTagCategory } from "@domain/calendar/calendar";
import { getUTCISODayFromLocalDate, getUTCISODayFromUTCDate, isUTCDate } from "@domain/common/business";
import { ISODay } from "@domain/common/type";

interface CalendarNoteDto {
	id: number;
	startTime: string;
	endTime: string;
	tag: CalendarTag;
}

interface CalendarDto {
	date: ISODay;
	streak: boolean;
	notes: CalendarNoteDto[];
}

export class CalendarApi {
	constructor(private readonly apiService: ApiService) {}

	async getAllTags({
		useForceRefresh,
	}: {
		/**
		 * Bypass front end cache
		 */
		useForceRefresh?: boolean;
	}): Promise<CalendarTag[]> {
		const result = await this.apiService.get<CalendarTag[]>("/notes/me/tags", { useForceRefresh });
		console.log("GETALLTAGS RESULT", result);
		return result.data;
	}

	async getCategories({
		useForceRefresh,
		ids,
	}: {
		/**
		 * Bypass front end cache
		 */
		useForceRefresh?: boolean;
		ids: number[];
	}) {
		const result = await this.apiService.get<CalendarTagCategory[]>(
			// adding categoryId=0 is a workaround until Nest will fix an issue where we need more than 1 item to consider an array
			`/notes/tags/categories?categoryId=0&${ids.map((id) => `categoryId=${id}`).join("&")}`,
			{ useForceRefresh }
		);
		return result.data;
	}

	async createTag(name: string, category: string) {
		await this.apiService.post("/notes/me/tags", { name, category });
	}

	async deleteTag(tagId: number) {
		await this.apiService.delete(`/notes/me/tags/${tagId}`);
	}

	async getMonthCalendars({
		isoLocalDate,
		useForceRefresh,
	}: {
		/**
		 * A day of the month in iso local time with time zone offset.
		 * eg: 2012-01-01T17:52:27.875-7:00
		 */
		isoLocalDate: string;
		useForceRefresh?: boolean;
	}): Promise<CalendarDto[]> {
		const result = await this.apiService.get<
			Array<{
				date: string;
				streak: boolean;
				notes: CalendarNoteDto[];
			}>
		>("/calendar", {
			params: { date: isoLocalDate },
			useForceRefresh,
		});
		return (
			result.data
				// TODO remove condition when backend will be set to UTC
				.map((day) => ({
					...day,
					date: isUTCDate(day.date) ? getUTCISODayFromUTCDate(day.date) : getUTCISODayFromLocalDate(day.date),
				}))
		);
	}

	async createNote(tags: CalendarTag[], startTime: Date, endTime: Date) {
		await this.apiService.post<CalendarNoteDto>("/notes/me", {
			startTime: toServerDate(startTime),
			endTime: toServerDate(endTime),
			tags: tags.map((t) => t.id),
		});
	}

	async createCustomTag(name: string) {
		await this.apiService.post<CalendarNote>("/notes/me/tags", {
			name,
		});
	}

	async deleteNote(noteId: number) {
		await this.apiService.delete(`/notes/me/${noteId}`);
	}

	async updateNote(note: CalendarNote) {
		const requestParam = {
			startTime: note.startTime,
			endTime: note.endTime,
			tags: [note.tag],
		};
		await this.apiService.put(`/notes/me/${note.id}`, requestParam);
	}

	async updateNoteDate(noteId: number, startTime: string, endTime: string) {
		const requestParam = {
			startTime: startTime,
			endTime: endTime,
		};
		await this.apiService.put(`/notes/me/${noteId}`, requestParam);
	}
}
