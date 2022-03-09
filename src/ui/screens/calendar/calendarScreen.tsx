import { useRepresentations } from "@core/representation";
import { isToday } from "@domain/common/business";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { InfoListHeader } from "@ui/components/infoList";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { DailyNotes } from "./DailyNotes";

export const CalendarScreen: React.FC = observer(() => {
	const {
		calendar: {
			actions: { setMonthCalendars },
		},
		measure: {
			hooks: { useDailyGlobalScore },
			actions: { setEachDayOfMonthScore },
		},
	} = useRepresentations();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();

	const [selectedIsoDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));

	useEffect(() => {
		const isoMonth = moment(selectedIsoDay).startOf("month").format("YYYY-MM");
		setEachDayOfMonthScore(isoMonth);
		setMonthCalendars({
			isoMonth,
			// Don't use cache if it is today, as data is often updated.
			useForceRefresh: isToday(selectedIsoDay, moment().toISOString()),
		});
	}, [selectedIsoDay]);

	const dailyScore = useDailyGlobalScore(selectedIsoDay);

	return (
		<Container>
			<CalendarWrapper>
				<CalendarView selectedIsoDay={selectedIsoDay} onDaySelected={(day) => setSelectedDay(day)} />
			</CalendarWrapper>
			<ResponsiveCenterView>{<GlobalScoreCard score={dailyScore} />}</ResponsiveCenterView>
			<NoteHeader>
				<InfoListHeader>{format("calendar.notes")}</InfoListHeader>
				<Pressable onPress={() => navigate(Routes.CalendarEditNotes, { day: selectedIsoDay })}>
					<EditButtonText>{format("calendar.edit_notes")}</EditButtonText>
				</Pressable>
			</NoteHeader>
			<DailyNotes isoDay={selectedIsoDay} />
		</Container>
	);
});

const Container = styled(ScrollScreen)`
	padding: 24px 0;
	align-items: center;
`;

const CalendarWrapper = styled.View`
	${whiteCardStyle};
	width: 100%;
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
