import { useRepresentations } from "@core/representation";
import { Row } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

type CustomDate = {
	dateString: string;
	day: number;
	month: number;
	year: number;
	timestamp: number;
};

type Props = {
	date: CustomDate;
	marking?: { selected?: boolean };
	onPress: (date: CustomDate) => void;
	onLongPress: (date: CustomDate) => void;
	state: "today" | "disabled" | "selected";
	theme: any; // TO REFACTOR
};

export const CalendarDay: React.FC<Props> = observer(function CalendarDay({ date, marking, onPress, state }: Props) {
	const fixedMarking = marking;
	const {
		calendar: {
			hooks: { useCalendar },
		},
	} = useRepresentations();
	const dayCalendar = useCalendar(date.dateString);

	return (
		<Container onPress={() => onPress(date)}>
			<StarContainer>
				{dayCalendar && dayCalendar.streak && <Image source={require("@assets/images/goldStar.png")} />}
			</StarContainer>
			<DayInfo selected={fixedMarking?.selected}>
				<DayText today={state === "today"} disabled={state === "disabled"}>
					{date.day}
				</DayText>
				<TagsContainer>
					<Row gap={2}>{dayCalendar && dayCalendar.notes.length > 0 ? <NoteDot /> : null}</Row>
				</TagsContainer>
			</DayInfo>
		</Container>
	);
});

const Container = styled.Pressable`
	align-items: center;
`;

const DayInfo = styled.View<{ selected?: boolean }>`
	padding: 4px 12px;
	border-radius: 5px;
	${({ selected }) => selected && `background-color: ${colors.lightgray}`};
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
