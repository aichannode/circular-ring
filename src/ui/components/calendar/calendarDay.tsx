import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay, getLocalISODayFromLocalDate } from "@domain/common/business";
import { Row } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React from "react";
import { Image } from "react-native";
import { DateData } from "react-native-calendars";
import { DayProps } from "react-native-calendars/src/calendar/day";
import styled from "styled-components/native";

type Props = DayProps & {
	date?: DateData;
};

export const CalendarDay = observer(function CalendarDay({ date, marking, onPress, state }: Props) {
	const fixedMarking = marking;
	const {
		calendar: {
			hooks: { useCalendar },
		},
	} = useRepresentations();
	const dayCalendar = useCalendar(
		date?.dateString ? getLocalISODayFromLocalDate(date.dateString) : getCurrentLocalISODay()
	);

	return (
		<Container onPress={() => onPress?.(date)} selected={fixedMarking?.selected}>
			<StarContainer>
				{dayCalendar && dayCalendar.streak && <Image source={require("@assets/images/goldStar.png")} />}
			</StarContainer>
			<DayInfo>
				<DayText today={state === "today"} disabled={state === "disabled"}>
					{date?.day}
				</DayText>
				<TagsContainer>
					<Row gap={2}>{dayCalendar && dayCalendar.notes.length > 0 ? <NoteDot /> : null}</Row>
				</TagsContainer>
			</DayInfo>
		</Container>
	);
});

const Container = styled.Pressable<{ selected?: boolean }>`
	align-items: center;
	${({ selected }) => selected && `background-color: ${colors.lightgray}`};
	border-radius: 5px;
`;

const DayInfo = styled.View<{ selected?: boolean }>`
	padding: 0px 12px;
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
	margin-bottom: 2px;
`;

const TagsContainer = styled.View`
	height: 14px;
	align-items: center;
	justify-content: center;
`;

const NoteDot = styled.View`
	width: 6px;
	height: 6px;
	border-radius: 3px;
	background-color: ${colors.primary};
`;
