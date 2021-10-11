import { FetchStrategy } from "@betomorrow/micro-stores";
import { useGlobalScore } from "@domain/measure/hooks";
import { optimalGlobalScoreThreshold } from "@domain/measure/score";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image } from "react-native";
import { DayComponentProps } from "react-native-calendars";
import styled from "styled-components/native";

export const CalendarDay: React.FC<DayComponentProps> = React.memo(({ date, marking, onPress, state }) => {
	const fixedMarking = marking as unknown as { selected?: boolean } | undefined;
	const { result: globalScore } = useGlobalScore(date.dateString, FetchStrategy.Never);

	return (
		<Container selected={fixedMarking?.selected} onPress={() => onPress(date)}>
			<StarContainer>
				{globalScore && globalScore.score > optimalGlobalScoreThreshold && (
					<Image source={require("@assets/images/goldStar.png")} />
				)}
			</StarContainer>
			<DayText today={state === "today"} disabled={state === "disabled"}>
				{date.day}
			</DayText>
		</Container>
	);
});

const Container = styled.Pressable<{ selected?: boolean }>`
	padding: 4px 12px;
	${({ selected }) => selected && `background-color: ${colors.lightgray}`};
	border-radius: 5px;
	align-items: center;
`;

const DayText = styled.Text<{ today: boolean; disabled: boolean }>`
	font-size: 10px;
	color: ${({ today }) => (today ? colors.primary : colors.textPrimary)};
	${({ disabled }) => disabled && "opacity: 0.3"};
`;

const StarContainer = styled.View`
	height: 11px;
	width: 12px;
	margin-bottom: 4px;
`;
