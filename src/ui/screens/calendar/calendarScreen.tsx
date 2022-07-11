import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay, isDefined, toISOMonth } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { getScoreControlStates } from "@domain/measure/representation/business";
import { useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { getInitMode, updateMode } from "@ui/business";
import { InfoListHeader } from "@ui/components/infoList";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { CalendarView } from "@ui/containers/calendarView";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";
import { DailyNotes } from "./DailyNotes";

export const CalendarScreen = observer(function CalendarScreen() {
	const {
		measure: {
			hooks: { useDailyGlobalScore, useHasCompleteCoreSleep },
			actions: { setEachDayOfMonthScore },
		},
	} = useRepresentations();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();

	const [selectedLocalIsoDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());

	const hasCompleteCoreSleep = useHasCompleteCoreSleep(selectedLocalIsoDay);
	const nbRemainingDays = useUserCalibrationRemainingDays();
	const dailyScore = useDailyGlobalScore(selectedLocalIsoDay);

	// XXX: https://circularing.atlassian.net/browse/CIR-93
	const screenMode = getInitMode(nbRemainingDays, hasCompleteCoreSleep);

	const scoreQuality = getScoreControlStates({
		score: dailyScore || 0,
		thresholdHigh: 0.9,
		thresholdLow: 0.8,
	});

	useEffect(() => {
		setEachDayOfMonthScore(toISOMonth(selectedLocalIsoDay));
	}, [selectedLocalIsoDay]);

	return (
		<Container>
			<CalendarWrapper>
				<CalendarView selectedLocalIsoDay={selectedLocalIsoDay} onDaySelected={(day) => setSelectedDay(day)} />
			</CalendarWrapper>
			<ResponsiveCenterView>
				<GlobalScoreCard
					score={dailyScore}
					scoreQuality={scoreQuality}
					mode={updateMode(screenMode, !isDefined(dailyScore) || isNaN(dailyScore))}
				/>
			</ResponsiveCenterView>
			<NoteHeader>
				<InfoListHeader>{format("calendar.notes")}</InfoListHeader>
				<Pressable onPress={() => navigate(Routes.CalendarEditNotes, { day: selectedLocalIsoDay })}>
					<EditButtonText>{format("calendar.edit_notes")}</EditButtonText>
				</Pressable>
			</NoteHeader>
			<DailyNotes isoDay={selectedLocalIsoDay} />
		</Container>
	);
});

const Container = styled(ScrollScreen)`
	padding: 24px 0;
	align-items: center;
`;

const CalendarWrapper = styled.View`
	${whiteCardStyle};
	padding: 12px 0px 16px;
	width: 100%;
	border-radius: 5px;
	margin-bottom: 30px;
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
	padding: 10px 10px 10px 10px;
	font-size: 14px;
	color: ${colors.primary};
`;
