import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { Melody, RingAlarm, Weekdays } from "@domain/ring/ringAlarm";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { textStyles } from "@ui/styles/textStyles";
import { alarmTagColors } from "@ui/utils/alarmTagColorsUtils";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface AlarmWeekOverviewProps {
	style?: StyleProp<ViewStyle>;
}
export const AlarmWeekOverview: React.FC<AlarmWeekOverviewProps> = ({ style }) => {
	const alarms = useAlarms();
	const alarmsByDay = FAKE_useAlarmsByDay(alarms);

	return (
		<ResponsiveCenterView maxWidth={300} align="stretch" style={style}>
			<Row justify="space-between">
				{Object.values(Weekdays).map((day) => (
					<DayView key={day} gap={6}>
						<DayLetter key="day">{day.charAt(0).toUpperCase()}</DayLetter>
						{alarmsByDay[day].map((alarm, index) => (
							<AlarmIndicator key={alarm.label + index} style={{ backgroundColor: alarmTagColors[alarm.id] }} />
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

const AlarmIndicator = styled.View`
	width: 16px;
	height: 5px;
	border-radius: 2px;
`;

const FAKE_alarms: RingAlarm[] = [
	{
		id: 0,
		isActivated: false,
		isExisting: true,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.TUESDAY, Weekdays.WEDNESDAY, Weekdays.THURSDAY, Weekdays.FRIDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "one",
	},
	{
		id: 1,
		isActivated: false,
		isExisting: true,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.SUNDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "two",
	},
	{
		id: 2,
		isActivated: false,
		isExisting: true,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.MONDAY, Weekdays.SUNDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "three",
	},
	{
		id: 3,
		isActivated: false,
		isExisting: true,
		snooze: 2,
		smart: 1,
		melody: Melody.NOTIF1,
		weekdays: [Weekdays.WEDNESDAY],
		vibrationPower: 1,
		vibrationRepetition: 1,
		time: new Date(),
		label: "four",
	},
];

function FAKE_useAlarmsByDay(alarms: RingAlarm[] | null) {
	const alarmsByDay: { [key in Weekdays]: RingAlarm[] } = Object.values(Weekdays).reduce(
		(acc, day) => ({
			...acc,
			[day]: [],
		}),
		{}
	) as { [key in Weekdays]: RingAlarm[] };

	if (alarms) {
		for (const alarm of FAKE_alarms.filter((alarm) => !alarm.isActivated)) {
			for (const day of alarm.weekdays) {
				alarmsByDay[day].push(alarm);
			}
		}
	}

	return alarmsByDay;
}
