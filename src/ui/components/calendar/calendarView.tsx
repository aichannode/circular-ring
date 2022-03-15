// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useUser } from "@domain/user/hooks/useUser";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { CalendarDay } from "./calendarDay";

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
