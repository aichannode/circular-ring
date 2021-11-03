import { colors } from "@ui/styles/colors";
// import { CalendarTheme } from "react-native-calendars";

export const circularCalendarTheme = {
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
} as CalendarTheme; // Wrong typings in react-native-calendars...
