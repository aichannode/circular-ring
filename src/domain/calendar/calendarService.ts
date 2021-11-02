import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
import { CalendarNote, CalendarTag } from "@domain/calendar/calendar";
import { CalendarApi } from "@domain/calendar/calendarApi";
import { UserService } from "@domain/user/userService";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export const PopularTagCategory = "Popular";

export class CalendarService {
	private logger = getLogger("CalendarService");

	calendarStore = new Store((day) => this.fetchMonthCalendars(dayjs(day).toDate()), "day");

	private _tagMap = observable<Map<string, CalendarTag[]>>(new Map());

	readonly tagMap = this._tagMap.readOnly();

	constructor(private readonly calendarApi: CalendarApi, private readonly userService: UserService) {}

	init() {
		this.userService.user.subscribe((user) => {
			if (user) {
				this.fetchAllTags();
			} else {
				this._tagMap.set(new Map());
				this.calendarStore.clear();
			}
		});
	}

	async fetchMonthCalendars(date: Date) {
		try {
			const calendarList = await this.calendarApi.getMonthCalendars(date);
			this.logger.debug("Got calendar : " + JSON.stringify(calendarList));

			const popularTags = this._tagMap.get().get(PopularTagCategory) ?? [];

			calendarList
				.flatMap((calendar) => calendar.notes)
				.map((note) => note.tag)
				.forEach((tag) => {
					if (popularTags.findIndex((t) => t.id === tag.id) < 0) {
						popularTags.push(tag);
					}
				});
			this._tagMap.update((tagMap) => tagMap.set(PopularTagCategory, popularTags));

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
				await this.calendarApi.createTag("Romain","debug");
				await this.calendarApi.createTag("Tom","debug");
				await this.calendarApi.createTag("Albrecht","debug");
				await this.calendarApi.createTag("Pierre","debug");
				await this.calendarApi.createTag("Laurent L","debug");
				await this.calendarApi.createTag("Laurent B","debug");
				await this.calendarApi.createTag("Amaury","debug");
				await this.calendarApi.createTag("Alexandre","debug");
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

	async deleteTag(tagId: number) {
		try {
			await this.calendarApi.deleteTag(tagId);
		} catch (e) {
			this.logger.warn("Error deleting tag from note : " + JSON.stringify(e));
			throw e;
		}
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

	async updateNoteDate(note: CalendarNote, tagIds: number[], startDate: Date, endDate: Date) {
		try {
			console.log("Update note Date", note.id, startDate, endDate);
			await this.calendarApi.updateNoteDate(note.id, startDate.toISOString(), endDate.toISOString());
		} catch (e) {
			this.logger.warn("Error deleting tag from note : " + JSON.stringify(e));
			throw e;
		}
		await this.calendarStore.fetch(dayjs(note.startTime).startOf("month").format("YYYY-MM-DD"));
	}
}
