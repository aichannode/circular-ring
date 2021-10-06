import { useUser } from "@domain/user/hooks/useUser";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { CalendarDay } from "./calendarDay";

interface CalendarProps {
	style?: StyleProp<ViewStyle>;
	selectedDay: string;
	onDaySelected: (day: string) => void;
}

export const CalendarView: React.FC<CalendarProps> = ({ selectedDay, onDaySelected, style }) => {
	const autoSelectDay = useCallback(
		(dayOfMonth: string) => {
			const newDay = dayjs(dayOfMonth);
			const newSelectedDay = newDay.isAfter(selectedDay) ? newDay.startOf("month") : newDay.endOf("month");
			onDaySelected(newSelectedDay.format("YYYY-MM-DD"));
		},
		[selectedDay, onDaySelected]
	);
	const user = useUser();
	const [minDate, maxDate] = useMemo(() => [user?.createdAt || new Date(), new Date()], [user?.createdAt]);

	const isFirstMonth = useMemo(
		() => dayjs(selectedDay).startOf("month").isBefore(dayjs(minDate)),
		[minDate, selectedDay]
	);

	const isLastMonth = useMemo(() => dayjs(selectedDay).endOf("month").isAfter(dayjs()), [maxDate, selectedDay]);

	return (
		<RNCalendar
			minDate={minDate}
			maxDate={maxDate}
			disableArrowLeft={isFirstMonth}
			disableArrowRight={isLastMonth}
			onDayPress={(day) => onDaySelected(day.dateString)}
			onMonthChange={(date) => {
				autoSelectDay(date.dateString);
			}}
			style={style}
			hideExtraDays
			markedDates={selectedDay ? { [selectedDay]: { selected: true } } : undefined}
			dayComponent={CalendarDay}
			theme={circularCalendarTheme}
		/>
	);
};
