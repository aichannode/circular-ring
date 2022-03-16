import { useRepresentations } from "@core/representation";
import { getIsoMonth, isToday } from "@domain/common/business";
import { useUser } from "@domain/user/hooks/useUser";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { CalendarDay } from "../components/calendar/calendarDay";

interface CalendarProps {
	style?: StyleProp<ViewStyle>;
	selectedIsoDay: string;
	onDaySelected: (day: string) => void;
	autoSelectDayOnMonthChange?: boolean;
}
export const CalendarView: React.FC<CalendarProps> = function CalendarView({
	selectedIsoDay,
	onDaySelected,
	autoSelectDayOnMonthChange = true,
	style,
}) {
	const { setMonthCalendars } = useRepresentations().calendar.actions;
	// Fetch data on day change
	useEffect(
		function () {
			setMonthCalendars({
				isoMonth: getIsoMonth(selectedIsoDay),
				// Don't use cache if it is today, as data is often updated.
				useForceRefresh: isToday(selectedIsoDay, moment().toISOString()),
			});
		},
		[selectedIsoDay]
	);

	const autoSelectDay = useCallback(
		(dayOfMonth: string) => {
			const newDay = moment(dayOfMonth);
			const newSelectedIsoDay = newDay.isAfter(selectedIsoDay) ? newDay.startOf("month") : newDay.endOf("month");
			onDaySelected(newSelectedIsoDay.format("YYYY-MM-DD"));
		},
		[selectedIsoDay, onDaySelected]
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

	const [visibleMonthDay, setVisibleMonthDay] = useState(moment().format("YYYY-MM-DD"));

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
			initialDate={selectedIsoDay}
			disableArrowLeft={isFirstMonth}
			disableArrowRight={isLastMonth}
			onDayPress={(day) => onDaySelected(day.dateString)}
			onMonthChange={(date: any) => {
				setVisibleMonthDay(date.dateString);
				autoSelectDayOnMonthChange && autoSelectDay(date.dateString);
			}}
			style={style}
			hideExtraDays
			markedDates={selectedIsoDay ? { [selectedIsoDay]: { selected: true } } : undefined}
			dayComponent={CalendarDay}
			theme={circularCalendarTheme}
		/>
	);
};
