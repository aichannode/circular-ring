import { Melody, RingAlarm, Weekdays } from "@domain/ring/ringAlarm";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface AlarmWeekOverviewProps {
	style?: StyleProp<ViewStyle>;
}
export const AlarmWeekOverview: React.FC<AlarmWeekOverviewProps> = ({ style }) => {
	const alarmsByDay = FAKE_useAlarmsByDay();

	return (
		<ResponsiveCenterView maxWidth={300} align="stretch" style={style}>
			<Row justify="space-between">
				{Object.values(Weekdays).map((day) => (
					<DayView key={day} gap={6}>
						<DayLetter key="day">{day.charAt(0).toUpperCase()}</DayLetter>
						{alarmsByDay[day].map((alarm, index) => (
							<AlarmIndicator key={alarm.label + index} color={alarm.color} />
						))}
					</DayView>
				))}
			</Row>
		</ResponsiveCenterView>
	);
};

const DayLetter = styled.Text`
	${textStyles.mediumTitle};
	font-size: 14px;
	text-align: center;
`;

const DayView = styled(Stack)`
	width: 16px;
`;

const AlarmIndicator = styled.View<{ color: string }>`
	width: 16px;
	height: 5px;
	border-radius: 2px;
	background-color: ${({ color }) => color};
`;

const FAKE_alarms: RingAlarm[] = [
	{
		isDisabled: false,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.TUESDAY, Weekdays.WEDNESDAY, Weekdays.THURSTDAY, Weekdays.FRIDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "one",
		color: colors.green,
	},
	{
		isDisabled: false,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.SUNDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "two",
		color: colors.orange,
	},
	{
		isDisabled: true,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.SUNDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "three",
		color: colors.red,
	},
	{
		isDisabled: false,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.WEDNESDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "four",
		color: colors.blue,
	},
];

function FAKE_useAlarmsByDay() {
	const alarmsByDay: { [key in Weekdays]: RingAlarm[] } = Object.values(Weekdays).reduce(
		(acc, day) => ({
			...acc,
			[day]: [],
		}),
		{}
	) as { [key in Weekdays]: RingAlarm[] };

	for (const alarm of FAKE_alarms.filter((alarm) => !alarm.isDisabled)) {
		for (const day of alarm.weekdays) {
			alarmsByDay[day].push(alarm);
		}
	}

	return alarmsByDay;
}
