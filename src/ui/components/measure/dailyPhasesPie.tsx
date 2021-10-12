import { DailyPhase, SleepDurationInfos } from "@domain/measure/sleep";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React from "react";
import { Image, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { WordingKey } from "src/wordings";
import styled, { css } from "styled-components/native";
import { VictoryPie } from "victory-native";
import { Row, Stack } from "../layout";

interface DailyPhasesPieProps {
	sleepDurationData: SleepDurationInfos | null;
}

const chartSize = 200;
const polarOrigin = {
	x: chartSize / 2,
	y: chartSize / 2,
};
const rightAngle = 90;
export const DailyPhasesPie: React.FC<DailyPhasesPieProps> = ({ sleepDurationData }) => {
	if (!sleepDurationData) {
		return null;
	}

	const phaseColors = sleepDurationData.dailyPhaseInfos.map((p) =>
		p.phase === DailyPhase.NAP || p.phase === DailyPhase.SLEEP ? colors.darkBlue : colors.lightBlue
	);
	const data = sleepDurationData.dailyPhaseInfos.map(({ start, end }) => ({
		y: dayjs(end).diff(start),
	}));
	const { format, formatDuration } = useI18n();

	return (
		<Container>
			<View>
				<VictoryPie
					colorScale={phaseColors}
					data={data}
					startAngle={angle(sleepDurationData.dailyPhaseInfos[0].start)}
					// endAngle={360 + angle(new Date())}
					endAngle={360 + angle(dayjs().hour(19).toDate())} // Fake the end data while we don't have the real ones
					width={chartSize}
					height={chartSize}
					padding={0}
					labels={[]}
					innerRadius={90}
				/>
				{sleepDurationData.dailyPhaseInfos.map((phaseInfo, i, allPhases) => {
					const labels = renderedLabels(phaseInfo.phase, i, allPhases[i - 1]?.phase);
					return labels.map((label, index) =>
						label !== null ? (
							<React.Fragment key={`${i}-${index}`}>
								<LabelPolarView
									polarOrigin={polarOrigin}
									width={100}
									height={20}
									r={135}
									angleDeg={angle(index > 0 ? phaseInfo.end : phaseInfo.start) - rightAngle}
								>
									<View>
										<Label style={{ fontWeight: "500" }}>{label && format(label)}</Label>
										<Label>{dayjs(index > 0 ? phaseInfo.end : phaseInfo.start).format("HH:mm")}</Label>
									</View>
								</LabelPolarView>
								<PolarSvg
									width={20}
									height={3}
									polarOrigin={polarOrigin}
									r={100}
									angleDeg={angle(index > 0 ? phaseInfo.end : phaseInfo.start) - rightAngle}
									rotate
								>
									<Rect width={20} height={3} fill={colors.textPrimary} rx={2} ry={2} />
								</PolarSvg>
							</React.Fragment>
						) : null
					);
				})}
				<InsideInfos align="center" justify="space-between">
					<Image source={require("@assets/images/night.png")} />
					<Row style={{ alignSelf: "stretch" }} align="center" justify="space-between">
						<Image source={require("@assets/images/evening.png")} />
						<TotalSleepWrapper>
							<SleepDurationLabel>{format("sleep.duration.total")}</SleepDurationLabel>
							<SleepDurationValue>{formatDuration(sleepDurationData.totalSleepDuration * 60)}</SleepDurationValue>
						</TotalSleepWrapper>
						<Image source={require("@assets/images/morning.png")} />
					</Row>
					<Image source={require("@assets/images/day.png")} />
				</InsideInfos>
			</View>
		</Container>
	);
};

function renderedLabels(
	phase: DailyPhase,
	index: number,
	previousPhase?: DailyPhase
): [WordingKey | null | "", WordingKey | null] {
	// Check with server
	if (phase === DailyPhase.LYING && index === 0) {
		return ["", null];
	}
	if (phase === DailyPhase.SLEEP && previousPhase === DailyPhase.LYING) {
		return ["sleep.duration.label.start_sleep", null];
	}
	if (phase === DailyPhase.AWAKE && previousPhase === DailyPhase.SLEEP) {
		return ["sleep.duration.label.wake_up", null];
	}
	if (phase === DailyPhase.NAP) {
		return ["sleep.duration.label.nap_start", "sleep.duration.label.nap_end"];
	}
	return [null, null];
}

function angle(t: Date) {
	return ((t.getHours() + t.getMinutes() / 60) / 24) * 360;
}

function toRad(angle: number) {
	return (angle / 360) * 2 * Math.PI;
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;

interface PolarProps {
	width: number;
	height: number;
	r: number;
	angleDeg: number;
	polarOrigin: { x: number; y: number };
	rotate?: boolean;
}
const polarStylePosition = css<PolarProps>`
	position: absolute;
	${({ width, height, r, angleDeg, polarOrigin, rotate }) => css`
		width: ${width}px;
		height: ${height}px;
		left: ${polarOrigin.x - width / 2 + r * Math.cos(toRad(angleDeg))}px;
		top: ${polarOrigin.y - height / 2 + r * Math.sin(toRad(angleDeg))}px;
		${rotate && `transform: rotate(${angleDeg}deg)`};
	`}
`;

const LabelPolarView = styled.View<PolarProps>`
	${polarStylePosition}
	align-items: center;
	justify-content: center;
`;

const Label = styled.Text`
	font-size: 10px;
	color: ${colors.textPrimary};
`;

const PolarSvg = styled(Svg)<PolarProps>`
	${polarStylePosition};
`;

const InsideInfos = styled(Stack)`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	padding: 25px;
`;

const TotalSleepWrapper = styled.View`
	background-color: ${colors.white};
	width: 90px;
	height: 90px;
	border-radius: 45px;
	padding-vertical: 20px;
	align-items: center;
`;

const SleepDurationLabel = styled.Text`
	font-size: 10px;
	color: ${colors.textPlaceholder};
`;
const SleepDurationValue = styled.Text`
	font-size: 14px;
	color: ${colors.textPlaceholder};
	margin-top: 6px;
`;
