import { useRepresentations } from "@core/representation";
import { Storage } from "@core/storage";
import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { MAX_ALARMS } from "@domain/circleAlarm/circleAlarmService";
import { getCurrentLocalISODay } from "@domain/common/business";
import { DeviceAutoConnectState } from "@domain/device/bleDeviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { DailySleepData } from "@domain/measure/representation/api";
import { useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { getInitMode } from "@ui/business";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader } from "@ui/components/infoList";
import { Spinner } from "@ui/components/spinner";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { WarningBottomSheet } from "@ui/screens/circleAlarm/warningBottomSheet";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AlarmCard } from "./alarmCard";
import { AlarmHypnogram } from "./AlarmHypnogram";
import { AlarmWeekOverview } from "./alarmWeekOverview";
import { AlarmWelcomeBottomSheet } from "./alarmWelcomeBottomSheet";

export const CircleAlarmScreen: React.FC = observer(function CircleAlarmScreen() {
	const [isLoading, setLoading] = useState(false);
	const navigation = useRoutesNavigation();
	const { loading, alarms, loadAlarms } = useAlarms();
	const { format } = useI18n();
	const warningBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const currentISODay = getCurrentLocalISODay();
	const { useDailyWakeUpScore, useDailyPhaseBeforeWakeUp } = useRepresentations().measure.hooks;
	const wakeUpScore = useDailyWakeUpScore(currentISODay);
	const phaseBeforeWakeUp = useDailyPhaseBeforeWakeUp(currentISODay);
	const autoConnectState = useAutoConnectState();
	const { useHasCompleteCoreSleep } = useRepresentations().measure.hooks;
	const [displayGraph, setDisplayGraph] = useState(false);
	const [dailySleep, setData] = useState<DailySleepData | undefined>();
	const { useDailySleepStages } = useRepresentations().measure.hooks;

	const welcomeBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const hasCompleteCoreSleep = useHasCompleteCoreSleep(getCurrentLocalISODay());
	const nbRemainingDays = useUserCalibrationRemainingDays();
	// XXX: https://circularing.atlassian.net/browse/CIR-93
	const screenMode = getInitMode(nbRemainingDays, hasCompleteCoreSleep, {
		allowCalibration: false,
	});

	useDailySleepStages({ localISODay: currentISODay, setData, setLoading });

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			loadAlarms();
		}
	}, [loadAlarms, autoConnectState]);

	useEffect(() => {
		const fetchWelcomeBottomSheet = async () => {
			const welcomeAlarmDontShowAgain: boolean | null = await Storage.load("welcomeAlarmDontShowAgain");
			!welcomeAlarmDontShowAgain && welcomeBottomSheet.current?.present();
		};

		fetchWelcomeBottomSheet();
	}, []);

	const hasConnectedRing = autoConnectState === DeviceAutoConnectState.CONNECTED;
	return (
		<Container>
			<ScrollView>
				<ScoreSection
					mode={screenMode}
					label={format("alarm.wake_up_score")}
					color={colors.blue}
					score={wakeUpScore?.score}
					quality={wakeUpScore?.controlState}
					style={{ paddingTop: 20, paddingBottom: hasConnectedRing ? 0 : 20, alignSelf: "center" }}
					setState={setDisplayGraph}
					state={displayGraph}
				/>
				{displayGraph && dailySleep && (
					<GraphWrapper>
						{isLoading ? (
							<Spinner size={24} />
						) : (
							<AlarmHypnogram
								data={dailySleep.stages}
								endSleep={dailySleep.coreSleepTiming?.[1]}
								phaseBeforeWakeUp={phaseBeforeWakeUp}
							/>
						)}
					</GraphWrapper>
				)}
				<InfoListHeader>{format("alarm.score.programmed")}</InfoListHeader>
				<AlarmContainer>
					{alarms?.map((value) => (
						<Pressable
							disabled={!hasConnectedRing}
							key={value.id}
							onPress={() => navigation.navigate(Routes.EditAlarm, { initialAlarm: value })}
						>
							<AlarmCard data={value} disabled={!hasConnectedRing} />
						</Pressable>
					))}
					{loading ? <Spinner size={35} /> : null}
					<AddAlarmButton
						disabled={!hasConnectedRing}
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
				<InfoListHeader>{format("alarm.week_overview")}</InfoListHeader>
				<AlarmOverviewContainer>
					<AlarmWeekOverview style={{ marginVertical: 25 }} />
				</AlarmOverviewContainer>
			</ScrollView>
			<CircularBottomSheet snapPoints={[500]} ref={warningBottomSheet}>
				<WarningBottomSheet
					message={format("alarm.new.warning.description")}
					onClose={() => {
						warningBottomSheet.current?.close();
					}}
				/>
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[580]} ref={welcomeBottomSheet}>
				<AlarmWelcomeBottomSheet onClose={() => welcomeBottomSheet.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
});

const GraphWrapper = styled.View``;

const Container = styled.View`
	flex: 1;
	background-color: ${colors.white};
`;

const AlarmContainer = styled.View`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;

const AddImage = styled(Image)`
	tint-color: ${colors.darkGray};
	margin-right: 25px;
`;

const AddAlarmText = styled.Text`
	font-size: 16px;
	color: ${colors.darkGray};
`;

const AddAlarmButton = styled(Pressable)<{ disabled?: boolean }>`
	background-color: ${colors.gray + "80"};
	flex-direction: row;
	margin-top: 5px;
	height: 67px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	${({ disabled }) => disabled && "opacity: 0.2"};
`;

const AlarmOverviewContainer = styled.View`
	background-color: ${colors.lightgray};
`;
