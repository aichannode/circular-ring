import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
import { CalendarNote, CalendarTag, CalendarTagCategory } from "@domain/calendar/calendar";
import { CalendarApi } from "@domain/calendar/calendarApi";
import { UserService } from "@domain/user/userService";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export class CalendarService {
	private logger = getLogger("CalendarService");

	calendarStore = new Store((day) => this.fetchMonthCalendars(dayjs(day).toDate()), "day");

	private _tagMap = observable<Map<number, CalendarTag[]>>(new Map());
	private _categories = observable<CalendarTagCategory[]>([]);

	readonly tagMap = this._tagMap.readOnly();
	readonly categories = this._categories.readOnly();

	constructor(private readonly calendarApi: CalendarApi, private readonly userService: UserService) {}

	init() {
		this.userService.user.subscribe((user) => {
			if (user) {
				this.fetchAllTags();
			} else {
				this.calendarStore.clear();
			}
		});
	}

	async fetchMonthCalendars(date: Date) {
		try {
			const calendarList = await this.calendarApi.getMonthCalendars(date);
			return {
				day: dayjs(date).format("YYYY-MM-DD"),
				calendars: calendarList,
			};
		} catch (error) {
			this.logger.warn("Error retrieving calendars :", error);
			throw error;
		}
	}

	private async fetchAllTags() {
		try {
			const tags = await this.calendarApi.getAllTags();
			const categories = await this.calendarApi.getCategories(
				[...new Set(tags.map(({ categoryId: category }) => category))] // extract deduplicated category ids
			);
			this._tagMap.set(
				new Map(categories.map((category) => [category.id, tags.filter((tag) => tag.categoryId === category.id)]))
			);
			this._categories.set(categories.sort((a, b) => a.order - b.order)); // Order categories
		} catch (e) {
			this.logger.warn("Error retrieving tags :", e);
		}
	}

	async createNote(tags: CalendarTag[], startDate: Date, endDate: Date) {
		try {
			await this.calendarApi.createNote(tags, startDate, endDate);
		} catch (e) {
			this.logger.warn("Error registering note : " + JSON.stringify(e));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(startDate).startOf("month").format("YYYY-MM-DD"));
	}

	async createCustomTag(name: string, category: string) {
		try {
			await this.calendarApi.createCustomTag(name, category);
		} catch (e) {
			this.logger.warn("Error registering note : " + JSON.stringify(e));
			throw e;
		}
		// await this.calendarStore.fetch(dayjs(startDate).startOf("month").format("YYYY-MM-DD"));
		await this.fetchAllTags();
	}

	async deleteNote(note: CalendarNote) {
		try {
			await this.calendarApi.deleteNote(note.id);
		} catch (e) {
			this.logger.warn("Error deleting note : " + JSON.stringify(e));
			await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
	}

	async deleteTag(tagId: number) {
		try {
			await this.calendarApi.deleteTag(tagId);
		} catch (e) {
			this.logger.warn("Error deleting tag from note : " + JSON.stringify(e));
			throw e;
		}
		await this.fetchAllTags();
	}

	async updateNote(note: CalendarNote, tagIds: number[]) {
		try {
			await this.calendarApi.updateNote(note.id, tagIds, note.startTime.toISOString(), note.endTime.toISOString());
		} catch (e) {
			this.logger.warn("Error deleting tag from note : " + JSON.stringify(e));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
	}

	async updateNoteDate(note: CalendarNote, startDate: Date, endDate: Date) {
		try {
			await this.calendarApi.updateNoteDate(note.id, startDate.toISOString(), endDate.toISOString());
		} catch (e) {
			this.logger.warn("Error updating note date : " + JSON.stringify(e));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
	}
}
