import { useLiveData } from "@domain/ring/hooks";
import { getIntensity, Intensity } from "@domain/ring/ringLiveData";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { PrimaryText, TertiaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, intensityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle, shadow } from "@ui/styles/containerStyles";
import React from "react";
import { Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

export const CircleLiveScreen: React.FC = () => {
	const { format, formatIntensity } = useI18n();
	const { data, listening, start, stop } = useLiveData();

	const maxHeartRateRatio = data ? data.heartRate / data.maxHeartRate : null;
	const activityIntensity = getIntensity(maxHeartRateRatio);

	return (
		<Container>
			<ResponsiveCenterView maxWidth={380} align="stretch">
				<Stack gap={16}>
					<Row gap={100}>
						<TitleText>{format("live.heart_rate.label")}</TitleText>
						<TertiaryText>{format("live.accuracy.label")}</TertiaryText>
					</Row>
					<Row gap={20}>
						<Stack gap={10} style={{ flex: 1 }}>
							<InfoCard>
								<TertiaryText>{format("live.intensity.label")}</TertiaryText>
								{activityIntensity ? <DataValue>{formatIntensity(activityIntensity)}</DataValue> : null}
							</InfoCard>
							<InfoCard>
								<TertiaryText>{format("live.hr_max.label")}</TertiaryText>
								{maxHeartRateRatio ? <DataValue>{maxHeartRateRatio} bpm</DataValue> : null}
							</InfoCard>
						</Stack>
						<InfoCard style={{ flex: 1 }}>
							<TertiaryText>{format("live.hr_max.ratio.label")}</TertiaryText>
							{data && maxHeartRateRatio ? (
								<>
									<DataValue>{(data.heartRate / maxHeartRateRatio) * 100} %</DataValue>
									<Gauge>
										<GaugeValue intensity={activityIntensity} rate={maxHeartRateRatio} />
									</Gauge>
								</>
							) : null}
						</InfoCard>
					</Row>
				</Stack>
				<HeartCardWrapper>
					<HeartRateCard start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={["#f44a59", "#f97444"]}>
						<Image source={require("@assets/images/heartBeat.png")} />
						{data && (
							<HeartRateValue>
								{data.heartRate}
								<HeartRateUnit>bpm</HeartRateUnit>
							</HeartRateValue>
						)}
					</HeartRateCard>
					<PlayPauseButton onPress={listening ? stop : start}>
						<PlayPauseButtonContent start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={["#f44a59", "#f97444"]}>
							{listening ? (
								<Row gap={8}>
									<PauseBar />
									<PauseBar />
								</Row>
							) : (
								<StartLabel>{format("live.start")}</StartLabel>
							)}
						</PlayPauseButtonContent>
					</PlayPauseButton>
				</HeartCardWrapper>
				<Stack gap={20}>
					<TitleText>{format("live.hrv_blood_ox.label")}</TitleText>
					<Row gap={20}>
						<InfoCard style={{ flex: 1 }}>
							<TertiaryText>{format("live.hrv.label")}</TertiaryText>
							{data ? <DataValue>{data.hrv} ms</DataValue> : null}
						</InfoCard>
						<InfoCard style={{ flex: 1 }}>
							<TertiaryText>{format("live.blood_ox.label")}</TertiaryText>
							{data ? <DataValue>{data.spo2} %</DataValue> : null}
						</InfoCard>
					</Row>
				</Stack>
			</ResponsiveCenterView>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	background-color: ${colors.white};
	justify-content: flex-start;
`;

const InfoCard = styled.View`
	${roundedWhiteCardStyle}
	border-radius: 6px;
	justify-content: space-between;
	padding: 5px 12px 10px;
	min-height: 70px;
`;

const HeartCardWrapper = styled.View`
	${shadow("2px 4px")}
	margin: 50px 0 80px;
`;
const HeartRateCard = styled(LinearGradient)`
	border-radius: 22px;
	height: 200px;
	padding: 11px;
	align-items: center;
`;

const PlayPauseButton = styled.Pressable`
	position: absolute;
	bottom: 0;
	transform: translateY(42px);
	align-self: center;

	${shadow("4px 5px", 18)}
`;

const PlayPauseButtonContent = styled(LinearGradient)`
	width: 84px;
	height: 84px;
	border-radius: 42px;
	align-items: center;
	justify-content: center;
`;

const PauseBar = styled.View`
	background-color: ${colors.white};
	border-radius: 10px;
	width: 7px;
	height: 30px;
`;

const StartLabel = styled.Text`
	font-size: 19px;
	color: ${colors.white};
	font-weight: bold;
`;

const HeartRateValue = styled.Text`
	margin-top: 14px;
	font-size: 40px;
	text-align: center;
	font-weight: 500;
	color: ${colors.white};
`;

const HeartRateUnit = styled.Text`
	font-size: 19px;
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
