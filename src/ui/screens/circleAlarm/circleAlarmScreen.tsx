import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { MAX_ALARMS } from "@domain/circleAlarm/circleAlarmService";
import { useWakeUpScore } from "@domain/measure/hooks";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { ScreenSection } from "@ui/components/screenSection";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { WarningBottomSheet } from "@ui/screens/circleAlarm/warningBottomSheet";
import { colors } from "@ui/styles/colors";
import React, { useEffect, useRef } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AlarmCard } from "./alarmCard";
import { AlarmWeekOverview } from "./alarmWeekOverview";

export const CircleAlarmScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const { loading, alarms, loadAlarms } = useAlarms();
	const { format } = useI18n();
	const warningBottomSheet = useRef<BottomSheetModal>(null);
	const wakeUpScore = useWakeUpScore();

	useEffect(() => {
		loadAlarms();
	}, [loadAlarms]);

	return (
		<Container>
			<ScrollView>
				<ScreenSection title={format("alarm.score.programmed")}>
					<ScoreSection
						label={format("alarm.wake_up_score")}
						color={colors.blue}
						score={wakeUpScore}
						style={{ marginBottom: 25, alignSelf: "center" }}
					/>
				</ScreenSection>
				<AlarmContainer>
					{alarms?.map((value) => (
						<Pressable
							key={value.id}
							onPress={() =>
								navigation.navigate(Routes.EditAlarm, { initialAlarm: { ...value, time: value.time.toString() } })
							}
						>
							<AlarmCard data={value} />
						</Pressable>
					))}
					{loading ? <Spinner size={35} /> : null}
					<AddAlarmButton
						onPress={() => {
							alarms.length >= MAX_ALARMS
								? warningBottomSheet.current?.present()
								: navigation.navigate(Routes.EditAlarm);
						}}
					>
						<AddImage source={require("@assets/images/addButton.png")} />
						<AddAlarmText>{format("alarm.score.add_button")}</AddAlarmText>
					</AddAlarmButton>
				</AlarmContainer>
				<ScreenSection title={format("alarm.week_overview")} />
				<AlarmWeekOverview style={{ marginVertical: 25 }} />
			</ScrollView>
			<CircularBottomSheet snapPoints={[500]} ref={warningBottomSheet}>
				<WarningBottomSheet
					message={format("alarm.new.warning.description")}
					onClose={() => {
						warningBottomSheet.current?.close();
					}}
				/>
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
`;

const AlarmContainer = styled.View`
	padding: 25px 20px;
`;

const AddImage = styled(Image)`
	tint-color: ${colors.darkGray};
	margin-right: 25px;
`;

const AddAlarmText = styled.Text`
	font-size: 16px;
	color: ${colors.darkGray};
`;

const AddAlarmButton = styled(Pressable)`
	background-color: ${colors.gray + "80"};
	flex-direction: row;
	margin-top: 5px;
	height: 67px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`;
