import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Calendar as RNCalendar, CalendarTheme } from "react-native-calendars";
import { CalendarDay } from "./calendarDay";

interface CalendarProps {
	style?: StyleProp<ViewStyle>;
	selectedDay: string;
	onDaySelected: (day: string) => void;
}
export const Calendar: React.FC<CalendarProps> = ({ selectedDay, onDaySelected, style }) => {
	const autoSelectDay = useCallback(
		(dayOfMonth: string) => {
			const newDay = dayjs(dayOfMonth);
			const newSelectedDay = newDay.isAfter(selectedDay) ? newDay.startOf("month") : newDay.endOf("month");
			onDaySelected(newSelectedDay.format("YYYY-MM-DD"));
		},
		[selectedDay, onDaySelected]
	);

	return (
		<RNCalendar
			onDayPress={(day) => onDaySelected(day.dateString)}
			onMonthChange={(date) => {
				autoSelectDay(date.dateString);
			}}
			style={style}
			hideExtraDays
			markedDates={selectedDay ? { [selectedDay]: { selected: true } } : undefined}
			dayComponent={(dayProps) => <CalendarDay {...dayProps} />}
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
