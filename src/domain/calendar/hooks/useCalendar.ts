import { FetchStrategy, useStore } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { Calendar } from "@domain/calendar/calendar";
import dayjs from "dayjs";

export function useCalendar(ymdDay: string, strategy?: FetchStrategy): Calendar | undefined {
	const { calendarService } = useServices();

	const firstOfMonth = dayjs(ymdDay).startOf("month").format("YYYY-MM-DD");

	const { result: monthCalendars } = useStore(firstOfMonth, calendarService.calendarStore, strategy);

	return monthCalendars?.calendars.filter((cal) => {
		return cal.day === ymdDay;
	})[0];
}
