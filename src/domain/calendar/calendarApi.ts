import { ApiService } from "@core/api/apiService";
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
		// const result = await this.apiService.get<CalendarTag[]>("/notes/me/tags");
		// return result.data;
		return [
			{
				id: 0,
				name: "Alcohol",
				system: true,
			},
			{
				id: 1,
				name: "Sick",
				system: true,
			},
			{
				id: 2,
				name: "Friends",
				system: true,
			},
			{
				id: 3,
				name: "Baby care",
				system: false,
			},
		];
	}

	async getCalendar(date: Date): Promise<Calendar[]> {
		const result = await this.apiService.get<CalendarDto[]>("/calendar", { params: { date } });
		return CalendarApi.calendarListFromDto(result.data);
	}

	private static calendarListFromDto(dto: CalendarDto[]): Calendar[] {
		return dto.map((calendarDto) => {
			const notes: CalendarNote[] = [];
			calendarDto.notes.forEach((note) => {
				notes.push(
					...note.tags.map((tag) => {
						return {
							id: note.id,
							startTime: new Date(note.startTime),
							endTime: new Date(note.endTime),
							tag: tag,
						};
					})
				);
			});

			return {
				day: dayjs(new Date(calendarDto.date)).format("YYYY-MM-DD"),
				streak: calendarDto.streak,
				notes,
			};
		});
	}
}
