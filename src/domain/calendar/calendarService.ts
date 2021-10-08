import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
import { CalendarNote, CalendarTag } from "@domain/calendar/calendar";
import { CalendarApi } from "@domain/calendar/calendarApi";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export const PopularTagCategory = "Popular";

export class CalendarService {
	private logger = getLogger("CalendarService");

	calendarStore = new Store((day) => this.fetchCalendar(dayjs(day).toDate()), "day");

	private _tagMap = observable<Map<string, CalendarTag[]>>(new Map());

	readonly tagMap = this._tagMap.readOnly();

	constructor(private readonly calendarApi: CalendarApi) {}

	init() {
		this.fetchAllTags();
	}

	async fetchCalendar(date: Date) {
		try {
			const calendarList = await this.calendarApi.getCalendar(date);
			this.logger.debug("Got calendar : " + JSON.stringify(calendarList));

			// TODO update popular category from calendar data

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
			let tags = await this.calendarApi.getAllTags();
			if (tags.length === 0) {
				await this.calendarApi.createTag("Romain");
				await this.calendarApi.createTag("Tom");
				await this.calendarApi.createTag("Albrecht");
				await this.calendarApi.createTag("Pierre");
				await this.calendarApi.createTag("Laurent L");
				await this.calendarApi.createTag("Laurent B");
				await this.calendarApi.createTag("Amaury");
				await this.calendarApi.createTag("Alexandre");
				tags = await this.calendarApi.getAllTags();
			}
			const categories = tags.map((tag) => tag.category);
			const categoryMap = new Map(
				categories.map((category) => [category, tags.filter((tag) => tag.category === category)])
			);
			this._tagMap.set(categoryMap);
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

	async deleteNote(note: CalendarNote) {
		try {
			await this.calendarApi.deleteNote(note.id);
		} catch (e) {
			this.logger.warn("Error deleting note : " + JSON.stringify(e));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
	}
}
