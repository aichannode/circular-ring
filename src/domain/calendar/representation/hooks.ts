import { ApiService } from "@core/api/apiService";
import { Calendar, CalendarTag } from "@domain/calendar/calendar";
import { getLocalISODayFromUTCISODay, isBetween, toLocale } from "@domain/common/business";
import { deduplicate } from "@ui/utils/filter";
import moment from "moment";
import { useEffect, useState } from "react";
import { createActions } from "../actions";
import { CalendarApi } from "../actions/lib/calendarApi";
import { CalendarErrorContext } from "../common/type";
import { CalendarModel } from "../model/calendarModel";
import { createNAPs } from "./NAPs";

export function createRepresentation(apiService: ApiService, model: CalendarModel) {
	const calendarApi = new CalendarApi(apiService);
	const actions = createActions(calendarApi, model.present);

	// Start NAPs
	createNAPs(model, calendarApi, actions);

	function useCalendar(isoLocalDay: string): Calendar | undefined {
		return model.UTCMonthNotes.find((cal) => {
			return getLocalISODayFromUTCISODay(cal.day) === isoLocalDay;
		});
	}

	return {
		actions,
		hooks: {
			useCalendar,

			useTags() {
				return model.categoryTags;
			},

			useTagCategories() {
				return model.tagCategories;
			},

			useErrors(context: CalendarErrorContext) {
				return model.errors.get(context);
			},

			useRangeTags(localISOTimeStart: string, localISOTimeEnd: string): Array<{ nb: number; tag: CalendarTag }> {
				const [tags, setTags] = useState<Array<{ nb: number; tag: CalendarTag }>>([]);
				const monthsBetween =
					Math.round(moment.duration(moment(localISOTimeEnd).diff(localISOTimeStart)).asMonths()) + 1;

				useEffect(
					function () {
						async function fetchMonths() {
							return await Promise.all(
								Array(monthsBetween)
									.fill(0)
									.map(function (_, index) {
										const monthToFetch = moment(localISOTimeStart).add(index, "months").toISOString();

										return calendarApi.getMonthCalendars({
											isoLocalDate: toLocale(monthToFetch),
											useForceRefresh: true,
										});
									})
							);
						}
						fetchMonths().then(function (months) {
							setTags(
								months
									// Keep only days in the time range
									.flatMap((month) => month.filter((day) => isBetween(day.date, localISOTimeStart, localISOTimeEnd)))
									// Keep only notes in the time range. A note is considered in the range
									// if either its start or end date is in the range.
									.flatMap((day) =>
										day.notes.filter(
											(note) =>
												isBetween(note.endTime, localISOTimeStart, localISOTimeEnd) ||
												isBetween(note.startTime, localISOTimeStart, localISOTimeEnd)
										)
									)
									.map((note) => note.tag)
									.reduce(function (summary, tag) {
										const existingEntry = summary.find((entry) => entry.tag.id === tag.id);
										if (existingEntry) {
											existingEntry.nb++;
										} else {
											summary.push({ tag, nb: 0 });
										}
										return summary;
									}, [] as Array<{ nb: number; tag: CalendarTag }>)
							);
						});
					},
					[localISOTimeStart, localISOTimeEnd]
				);

				return tags;
			},

			useDailyTags(isoDay: string) {
				return (
					useCalendar(isoDay)
						?.notes.filter(
							(note) =>
								moment(note.startTime).startOf("day") <= moment(isoDay) &&
								moment(isoDay) <= moment(note.endTime).endOf("day")
						)
						.flatMap((note) => note.tag)
						.filter(deduplicate("id")) ?? []
				);
			},
		},
	};
}
