import { ApiService } from "@core/api/apiService";
import { toServerDate } from "@core/utils";
import { Calendar, CalendarNote, CalendarTag } from "@domain/calendar/calendar";
import dayjs from "dayjs";

interface CalendarNoteDto {
	id: number;
	startTime: string;
	endTime: string;
	tags: CalendarTag[];
}

interface CalendarDto {
	date: string;
	streak: boolean;
	notes: CalendarNoteDto[];
}

export class CalendarApi {
	constructor(private readonly apiService: ApiService) {}

	async getAllTags(): Promise<CalendarTag[]> {
		const result = await this.apiService.get<CalendarTag[]>("/notes/me/tags");
		return result.data;
	}

	async createTag(name: string) {
		await this.apiService.post("/notes/me/tags", { name, category: "Debug Tags" });
	}

	async deleteTag(tagId: number) {
		await this.apiService.delete(`/notes/me/${tagId}`);
	}

	async getMonthCalendars(date: Date): Promise<Calendar[]> {
		const result = await this.apiService.get<CalendarDto[]>("/calendar", { params: { date } });
		return CalendarApi.calendarListFromDto(result.data);
	}

	private static calendarListFromDto(dto: CalendarDto[]): Calendar[] {
		return dto.map((calendarDto) => {
			const notes = calendarDto.notes.flatMap((note) =>
				note.tags.map((tag) => ({
					id: note.id,
					startTime: new Date(note.startTime),
					endTime: new Date(note.endTime),
					tag: tag,
				}))
			);

			return {
				day: dayjs(calendarDto.date).format("YYYY-MM-DD"),
				streak: calendarDto.streak,
				notes,
			};
		});
	}

	async createNote(tags: CalendarTag[], startTime: Date, endTime: Date) {
		await this.apiService.post<CalendarNote>("/notes/me", {
			startTime: toServerDate(startTime),
			endTime: toServerDate(endTime),
			tags: tags.map((t) => t.id),
		});
	}

	async deleteNote(noteId: number) {
		await this.apiService.delete(`/notes/me/${noteId}`);
	}

	async updateNote(noteId: number, tagIds: number[], startTime: string, endTime: string) {
		const requestParam = {
			startTime: startTime,
			endTime: endTime,
			tags: tagIds,
		};
		await this.apiService.put(`/notes/me/${noteId}`, requestParam);
	}

	async updateNoteDate(noteId: number, startTime: string, endTime: string) {
		const requestParam = {
			startTime: startTime,
			endTime: endTime,
			tags: [0],
		};
		await this.apiService.patch(`/notes/me/${noteId}`, requestParam);
	}
}
