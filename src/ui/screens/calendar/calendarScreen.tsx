import { FetchStrategy } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { useGlobalScore } from "@domain/measure/hooks";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { InfoListHeader } from "@ui/components/infoList";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export const CalendarScreen: React.FC = () => {
	const { measureService, calendarService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();

	const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));

	const firstDayOfMonth = useMemo(() => dayjs(selectedDay).startOf("month").format("YYYY-MM-DD"), [selectedDay]);

	useEffect(() => {
		const firstOfMonth = new Date(firstDayOfMonth);
		measureService.fetchMonthGlobalScores(firstOfMonth);
		// calendarService.fetchCalendar(firstOfMonth);
		calendarService.calendarStore.fetch(firstDayOfMonth);
	}, [firstDayOfMonth]);

	const { result: dailyScore } = useGlobalScore(selectedDay, FetchStrategy.Never);

	return (
		<Container>
			<CalendarWrapper>
				<CalendarView selectedDay={selectedDay} onDaySelected={(day) => setSelectedDay(day)} />
			</CalendarWrapper>
			<ResponsiveCenterView>
				<GlobalScoreCard score={dailyScore ? dailyScore.score : null} />
			</ResponsiveCenterView>
			<NoteHeader>
				<InfoListHeader>{format("calendar.notes")}</InfoListHeader>
				<Pressable onPress={() => navigate(Routes.CalendarEditNotes, { day: selectedDay })}>
					<EditButtonText>{format("calendar.edit_notes")}</EditButtonText>
				</Pressable>
			</NoteHeader>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding: 24px 0;
	align-items: center;
`;

const CalendarWrapper = styled.View`
	${whiteCardStyle};
	padding-left: 0;
	padding-right: 0;
	border-radius: 5px;
	margin-bottom: 50px;
	max-width: 335px;
	margin-left: 10px;
	margin-right: 10px;
`;

const NoteHeader = styled.View`
	width: 100%;
	flex-direction: row;
	padding-right: 20px;
	justify-content: space-between;
	align-items: center;
`;

const EditButtonText = styled.Text`
	padding: 10px 0 10px 10px;
	font-size: 14px;
	color: ${colors.primary};
`;
