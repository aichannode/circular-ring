import { ApiService } from "@core/api/apiService";
import { toServerDate } from "@core/utils";
import { Calendar, CalendarNote, CalendarTag, CalendarTagCategory } from "@domain/calendar/calendar";
import dayjs from "dayjs";

interface CalendarNoteDto {
	id: number;
	startTime: string;
	endTime: string;
	tag: CalendarTag;
}

interface CalendarDto {
	date: string;
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
			`/notes/tags/categories?${ids.map((id) => `categoryId=${id}`).join("&")}`,
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
		isoMonth,
		useForceRefresh,
	}: {
		isoMonth: string;
		useForceRefresh?: boolean;
	}): Promise<Calendar[]> {
		const result = await this.apiService.get<CalendarDto[]>("/calendar", {
			params: { date: isoMonth },
			useForceRefresh,
		});
		return CalendarApi.calendarListFromDto(result.data);
	}

	private static calendarListFromDto(dto: CalendarDto[]): Calendar[] {
		return dto.map((calendarDto) => {
			const notes = calendarDto.notes.map((note) => {
				return {
					id: note.id,
					startTime: new Date(note.startTime),
					endTime: new Date(note.endTime),
					tag: note.tag,
				};
			});

			return {
				day: dayjs(calendarDto.date).format("YYYY-MM-DD"),
				streak: calendarDto.streak,
				notes,
			};
		});
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
