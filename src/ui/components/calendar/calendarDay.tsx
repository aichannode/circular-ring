import { colors } from "@ui/styles/colors";
import React from "react";
import { DayComponentProps } from "react-native-calendars";
import styled from "styled-components/native";

export const CalendarDay: React.FC<DayComponentProps> = ({ date, marking, onPress, state }) => {
	return (
		<Container selected={marking?.selected} onPress={() => onPress(date)}>
			<DayText today={state === "today"}>{date.day}</DayText>
		</Container>
	);
};

const Container = styled.Pressable<{ selected: boolean }>`
	padding: 4px 12px;
	${({ selected }) => selected && `background-color: ${colors.lightgray}`};
	border-radius: 5px;
`;

const DayText = styled.Text<{ today: boolean }>`
	font-size: 10px;
	color: ${({ today }) => (today ? colors.primary : colors.textPrimary)};
`;
