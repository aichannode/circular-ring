import { useUser } from "@domain/user/hooks/useUser";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar, CalendarTheme } from "react-native-calendars";
import { CalendarDay } from "./calendarDay";

interface CalendarProps {
	style?: StyleProp<ViewStyle>;
	selectedDay: string;
	onDaySelected: (day: string) => void;
	autoSelectDayOnMonthChange?: boolean;
}
export const Calendar: React.FC<CalendarProps> = ({
	selectedDay,
	onDaySelected,
	autoSelectDayOnMonthChange = true,
	style,
}) => {
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
			onMonthChange={
				autoSelectDayOnMonthChange
					? (date) => {
							autoSelectDay(date.dateString);
					  }
					: undefined
			}
			style={style}
			hideExtraDays
			markedDates={selectedDay ? { [selectedDay]: { selected: true } } : undefined}
			dayComponent={CalendarDay}
			theme={
				{
					textDayHeaderFontSize: 14,
					textDayHeaderFontWeight: "500",
					stylesheet: {
						calendar: {
							header: {
								header: {
									flexDirection: "row",
									justifyContent: "space-between",
									paddingHorizontal: 20,
									marginTop: 6,
									alignItems: "center",
								},
							},
						},
					},
					textMonthFontSize: 14,
					textMonthFontWeight: "500",
					textSectionTitleColor: colors.textPrimary,
					arrowColor: colors.darkGray,
				} as CalendarTheme // Wrong typings in react-native-calendars...
			}
		/>
	);
};
