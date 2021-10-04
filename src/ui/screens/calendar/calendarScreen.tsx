import { useGlobalScore } from "@domain/measure/hooks";
import { Calendar } from "@ui/components/calendar/calendar";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import styled from "styled-components/native";

export const CalendarScreen: React.FC = () => {
	const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));

	const date = useMemo(() => new Date(selectedDay), [selectedDay]);

	const { score, loading } = useGlobalScore(date);

	return (
		<Container>
			<CalendarWrapper>
				<Calendar selectedDay={selectedDay} onDaySelected={(day) => setSelectedDay(day)} />
			</CalendarWrapper>
			<ResponsiveCenterView>
				<GlobalScoreCard score={loading ? null : score} />
			</ResponsiveCenterView>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding-vertical: 24px;
	align-items: center;
`;

const CalendarWrapper = styled.View`
	${whiteCardStyle};
	/* margin-horizontal: 20px; */
	margin-bottom: 50px;
	max-width: 335px;
`;
