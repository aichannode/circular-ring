import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
import { CalendarTag } from "@domain/calendar/calendar";
import { CalendarApi } from "@domain/calendar/calendarApi";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export class CalendarService {
	private logger = getLogger("CalendarService");

	calendarStore = new Store((day) => this.fetchCalendar(dayjs(day).toDate()), "day");

	private _allTagList = observable<CalendarTag[]>([]);

	readonly allTagList = this._allTagList.readOnly();

	constructor(private readonly calendarApi: CalendarApi) {}

	init() {
		this.fetchAllTags();
	}

	async fetchCalendar(date: Date) {
		try {
			const calendarList = await this.calendarApi.getCalendar(date);
			this.logger.debug("Got calendar : " + JSON.stringify(calendarList));
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
			this._allTagList.set(await this.calendarApi.getAllTags());
		} catch (e) {
			this.logger.warn("Error retrieving tags :", e);
		}
	}
}
