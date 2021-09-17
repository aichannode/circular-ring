import { getScoreQuality } from "@domain/circleActivity/circleActivityData";
import { DeviceAutoConnectState } from "@domain/device/deviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { useLiveData } from "@domain/ring/hooks";
import { getIntensity, Intensity } from "@domain/ring/ringLiveData";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { PrimaryText, TertiaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors, intensityColors, qualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { HeartBeatCard } from "./heartBeatCard";
import { NoRingConnectedBottomSheet, OpenBottomSheetHandle } from "./noRingConnectedBottomSheet";

export const CircleLiveScreen: React.FC = () => {
	const { format, formatIntensity, formatScoreQuality } = useI18n();
	const { data, listening, start, stop } = useLiveData();

	const maxHeartRateRatio = data ? (data.heartRate / data.maxHeartRate) * 100 : null;
	const activityIntensity = getIntensity(maxHeartRateRatio);
	const dataQuality = data ? getScoreQuality(data?.correlation, 60, 80) : null;
	const autoConnectState = useAutoConnectState();

	const bottomSheet = useRef<OpenBottomSheetHandle>(null);

	useEffect(() => {
		return () => {
			stop();
		};
	}, []);

	return (
		<Container contentContainerStyle={{ paddingTop: 30 }}>
			<ResponsiveCenterView maxWidth={380} align="stretch">
				<Stack gap={16}>
					<Row gap={100}>
						<TitleText>{format("live.heart_rate.label")}</TitleText>
						<Row gap={5} align="center">
							<TertiaryText>
								{format("live.accuracy.label")}
								{dataQuality ? <QualityValue> {formatScoreQuality(dataQuality)}</QualityValue> : null}
							</TertiaryText>
							{dataQuality ? <ColoredDot color={qualityColors[dataQuality]} /> : null}
						</Row>
					</Row>
					<Row gap={20} style={{ height: 155 }}>
						<Stack gap={10} style={{ flex: 1 }}>
							<InfoCard>
								<TertiaryText>{format("live.intensity.label")}</TertiaryText>
								<Row gap={10} align="center">
									{data ? (
										<DataValue>{formatIntensity(activityIntensity)}</DataValue>
									) : listening ? (
										<Spinner size={19} />
									) : null}
									{activityIntensity !== Intensity.NONE ? (
										<ColoredDot color={intensityColors[activityIntensity]} />
									) : null}
								</Row>
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
						<InfoCard style={{ flex: 1, paddingBottom: 30 }}>
							<TertiaryText>{format("live.hr_max.ratio.label")}</TertiaryText>
							{maxHeartRateRatio ? (
								<>
									<DataValue style={{ alignSelf: "center" }}>{Math.floor(maxHeartRateRatio)} %</DataValue>
									<Gauge>
										<GaugeValue intensity={activityIntensity} rate={maxHeartRateRatio} />
									</Gauge>
								</>
							) : listening ? (
								<Spinner size={27} />
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
									if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
										start();
									} else {
										bottomSheet.current?.open();
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
			<NoRingConnectedBottomSheet ref={bottomSheet} />
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
