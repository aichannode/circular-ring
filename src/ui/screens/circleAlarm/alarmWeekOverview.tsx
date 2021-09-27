import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { RingAlarm, Weekdays } from "@domain/ring/ringAlarm";
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
	const alarmsByDay = useAlarmsByDay(alarms);

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

function useAlarmsByDay(alarms: RingAlarm[] | null) {
	const alarmsByDay: { [key in Weekdays]: RingAlarm[] } = Object.values(Weekdays).reduce(
		(acc, day) => ({
			...acc,
			[day]: [],
		}),
		{}
	) as { [key in Weekdays]: RingAlarm[] };

	if (alarms) {
		for (const alarm of alarms.filter((alarm) => alarm.isActivated)) {
			for (const day of alarm.weekdays) {
				alarmsByDay[day].push(alarm);
			}
		}
	}

	return alarmsByDay;
}
