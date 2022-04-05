import { useRepresentations } from "@core/representation";
import { getLocalISODayFromLocalDate, isToday } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { useUser } from "@domain/user/hooks/useUser";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import { action } from "mobx";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { CalendarDay } from "../components/calendar/calendarDay";

interface CalendarProps {
	style?: StyleProp<ViewStyle>;
	selectedLocalIsoDay: ISODay;
	onDaySelected: (day: ISODay) => void;
	autoSelectDayOnMonthChange?: boolean;
}
export const CalendarView: React.FC<CalendarProps> = function CalendarView({
	selectedLocalIsoDay,
	onDaySelected,
	autoSelectDayOnMonthChange = true,
	style,
}) {
	const { setMonthCalendars } = useRepresentations().calendar.actions;
	// Fetch data on day change
	useEffect(
		action(function () {
			setMonthCalendars({
				isoLocalDate: getLocalISODayFromLocalDate(selectedLocalIsoDay),
				// Don't use cache if it is today, as data is often updated.
				useForceRefresh: isToday(selectedLocalIsoDay, moment().toISOString()),
			});
		}),
		[selectedLocalIsoDay]
	);

	const autoSelectDay = useCallback(
		(dayOfMonth: string) => {
			const newDay = moment(dayOfMonth);
			const newSelectedIsoDay = newDay.isAfter(selectedLocalIsoDay) ? newDay.startOf("month") : newDay.endOf("month");
			onDaySelected(newSelectedIsoDay.format("YYYY-MM-DD") as ISODay);
		},
		[selectedLocalIsoDay, onDaySelected]
	);
	const user = useUser();
	const [minDate, maxDate] = useMemo(
		() => [
			(user && moment(user.createdAt.toISOString()).startOf("day")?.format("YYYY-MM-DD")) ||
				moment().startOf("day").format("YYYY-MM-DD"),
			moment().startOf("day").format("YYYY-MM-DD"),
		],
		[user?.createdAt]
	);

	const [visibleMonthDay, setVisibleMonthDay] = useState(selectedLocalIsoDay);

	const isFirstMonth = useMemo(
		() => moment(visibleMonthDay).startOf("month").isBefore(moment(minDate)),
		[minDate, visibleMonthDay]
	);

	const isLastMonth = useMemo(
		() => moment(visibleMonthDay).endOf("month").isAfter(moment()),
		[maxDate, visibleMonthDay]
	);

	return (
		<RNCalendar
			minDate={minDate}
			maxDate={maxDate}
			initialDate={selectedLocalIsoDay}
			disableArrowLeft={isFirstMonth}
			disableArrowRight={isLastMonth}
			onDayPress={(day) => onDaySelected(day.dateString as ISODay)}
			onMonthChange={(date: any) => {
				setVisibleMonthDay(date.dateString);
				autoSelectDayOnMonthChange && autoSelectDay(date.dateString);
			}}
			style={style}
			hideExtraDays
			markedDates={selectedLocalIsoDay ? { [selectedLocalIsoDay]: { selected: true } } : undefined}
			dayComponent={CalendarDay}
			theme={circularCalendarTheme}
		/>
	);
};
