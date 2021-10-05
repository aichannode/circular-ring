import { FetchStrategy } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { useGlobalScore } from "@domain/measure/hooks";
import { Calendar } from "@ui/components/calendar/calendar";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/native";

export const CalendarScreen: React.FC = () => {
	const { measureService } = useServices();
	const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));

	const firstDayOfMonth = useMemo(() => dayjs(selectedDay).startOf("month").format("YYYY-MM-DD"), [selectedDay]);

	useEffect(() => {
		measureService.fetchMonthGlobalScores(new Date(firstDayOfMonth));
	}, [firstDayOfMonth]);

	const { result: dailyScore } = useGlobalScore(selectedDay, FetchStrategy.Never);

	return (
		<Container>
			<CalendarWrapper>
				<Calendar selectedDay={selectedDay} onDaySelected={(day) => setSelectedDay(day)} />
			</CalendarWrapper>
			<ResponsiveCenterView>
				<GlobalScoreCard score={dailyScore ? dailyScore.score : null} />
			</ResponsiveCenterView>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding-vertical: 24px;
	align-items: center;
	padding-horizontal: 10px;
`;

const CalendarWrapper = styled.View`
	${whiteCardStyle};
	padding-left: 0px;
	padding-right: 0px;
	border-radius: 5px;
	margin-bottom: 50px;
	max-width: 335px;
`;
