import { useServices } from "@core/services";
import { DeviceAutoConnectState } from "@domain/device/bleDeviceService";
import { useAutoConnectState, useLiveData } from "@domain/device/hooks";
import { getSignalQuality } from "@domain/measure/score";
import { usePreferences } from "@domain/preferences/hooks";
import { getIntensity, Intensity, getMaxHr } from "@domain/ring/ringLiveData";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { PrimaryText, TertiaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, intensityColors, SignalQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { HeartBeatCard } from "./heartBeatCard";
import { LiveTutorialBottomSheet } from "./liveTutorialBottomSheet";
import { NoRingConnectedBottomSheet } from "./noRingConnectedBottomSheet";
import { View } from "react-native";
import { useUser } from "@domain/user/hooks/useUser";
import moment from "moment";

export const CircleLiveScreen: React.FC = () => {
	const { format, formatIntensity, formatScoreQuality } = useI18n();
	const { data, listening, start, stop, flush } = useLiveData();
	const user = useUser();

	const maxHrPercent = getMaxHr(user?.sex, moment().diff(user?.bornDate, "years"), data?.heartRate);

	// const maxHeartRateRatio = data ? (data.heartRate! / data.maxHeartRate!) * 100 : null;
	const activityIntensity = getIntensity(maxHrPercent);
	const dataQuality = getSignalQuality(data?.correlation ?? 0);

	const autoConnectState = useAutoConnectState();

	const preferences = usePreferences();
	const { userPreferencesService } = useServices();

	const disconnectedBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const tutorialBottomSheet = useRef<CircularBottomSheetHandle>(null);

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			disconnectedBottomSheet.current?.close();
		}
	}, [autoConnectState]);

	useEffect(() => {
		return () => {
			flush();
			stop();
		};
	}, []);

	return (
		<Container contentContainerStyle={{ paddingVertical: 30 }}>
			<ResponsiveCenterView maxWidth={380} align="stretch">
				<Stack gap={16}>
					<Row gap={100}>
						<TitleText>{format("live.heart_rate.label")}</TitleText>
						<Row gap={5} align="center">
							<TertiaryText>
								{format("live.accuracy.label")}
								{dataQuality ? <QualityValue> {formatScoreQuality(dataQuality)}</QualityValue> : null}
							</TertiaryText>
							{dataQuality ? <ColoredDot color={SignalQualityColors[dataQuality]} /> : null}
						</Row>
					</Row>
					<Row gap={20} style={{ height: 155 }} align="center">
						<Stack gap={10} style={{ flex: 1 }}>
							<InfoCard>
								<TertiaryText>{format("live.intensity.label")}</TertiaryText>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										alignContent: "center",
									}}
								>
									{!!data?.maxHeartRate && <DataValue>{formatIntensity(activityIntensity)}</DataValue>}
								</View>
								{listening && !data?.maxHeartRate && <Spinner size={19} />}
							</InfoCard>
							<InfoCard>
								<TertiaryText>{format("live.hr_max.label")}</TertiaryText>
								{data?.maxHeartRate ? (
									<DataValue>{data.maxHeartRate} bpm</DataValue>
								) : listening ? (
									<Spinner size={19} />
								) : null}
							</InfoCard>
						</Stack>
						<InfoCard style={{ flex: 1, paddingBottom: 30, height: "100%" }}>
							<TertiaryText>{format("live.hr_max.ratio.label")}</TertiaryText>
							{maxHrPercent ? (
								<>
									<DataValue style={{ alignSelf: "center" }}>{Math.floor(maxHrPercent)} %</DataValue>
									<Gauge>
										<GaugeValue intensity={activityIntensity} rate={maxHrPercent / 100} />
									</Gauge>
								</>
							) : listening ? (
								<View style={{ flex: 1, display: "flex", justifyContent: "center" }}>
									<Spinner size={27} />
								</View>
							) : null}
						</InfoCard>
					</Row>
				</Stack>
				<HeartBeatCard
					listening={listening}
					heartRate={data?.heartRate}
					onToggle={
						listening
							? stop
							: () => {
									if (autoConnectState !== DeviceAutoConnectState.CONNECTED) {
										disconnectedBottomSheet.current?.present();
										return;
									}
									if (preferences?.skipLiveTutorial) {
										start();
									} else {
										tutorialBottomSheet.current?.present();
									}
							  }
					}
					style={{ marginVertical: 40 }}
				/>
				<Stack gap={20}>
					<TitleText>{format("live.hrv_blood_ox.label")}</TitleText>
					<Row gap={20} style={{ height: 70 }}>
						<InfoCard style={{ flex: 1 }}>
							<TertiaryText>{format("live.hrv.label")}</TertiaryText>
							{data?.hrv ? <DataValue>{data.hrv} ms</DataValue> : listening ? <Spinner size={19} /> : null}
						</InfoCard>
						<InfoCard style={{ flex: 1 }}>
							<TertiaryText>{format("live.blood_ox.label")}</TertiaryText>
							{data?.spo2 ? <DataValue>{data.spo2} %</DataValue> : listening ? <Spinner size={19} /> : null}
						</InfoCard>
					</Row>
				</Stack>
			</ResponsiveCenterView>
			<CircularBottomSheet snapPoints={[580]} ref={disconnectedBottomSheet}>
				<NoRingConnectedBottomSheet onClose={() => disconnectedBottomSheet.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[610]} ref={tutorialBottomSheet}>
				<LiveTutorialBottomSheet
					onFinish={async (hideTutorial) => {
						await tutorialBottomSheet.current?.asyncClose();
						hideTutorial && userPreferencesService.skipLiveTutorial();
						start();
					}}
				/>
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	background-color: ${colors.white};
	justify-content: flex-start;
`;

const InfoCard = styled.View`
	${roundedWhiteCardStyle};
	justify-content: space-between;
	padding: 5px 12px 10px;
	flex: 1;
`;

const DataValue = styled(PrimaryText)`
	font-size: 20px;
	font-weight: bold;
`;

const Gauge = styled.View`
	background-color: ${colors.lightgray};
	border-radius: 5px;
	height: 4px;
	overflow: hidden;
`;

const GaugeValue = styled.View<{ intensity: Intensity; rate: number }>`
	background-color: ${({ intensity }) => intensityColors[intensity]};
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: ${({ rate }) => rate * 100}%;
	border-radius: 5px;
`;

const ColoredDot = styled.View<{ color: string }>`
	flex-grow: 0;
	flex-shrink: 0;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: ${({ color }) => color};
`;

const QualityValue = styled(DataValue)`
	font-size: 12px;
`;
