import { isYesterday } from "@domain/common/utils";
import { StageInfos } from "@domain/measure/representation/type";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment, { Moment } from "moment";
import React from "react";
import { Image, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { WordingKey } from "src/wordings";
import styled, { css } from "styled-components/native";
import { CallbackArgs } from "victory-core";
import { VictoryPie } from "victory-native";
import { Row, Stack } from "../layout";

type Props = {
	stages: Array<StageInfos<any>>;
	totalDuration: number;
	/** Chart diameter */
	chartSize: number;
	/** The title in the center of the pie */
	title: WordingKey;
	/** Current date as ISO string */
	currentIsoDate: string;
	/** Logic to know the color of the given phase */
	getPhaseLevel(phase?: number | string): number;
	/** Phase colors, indexed by phase level */
	phaseColors: string[];
	/** Phase stroke width, indexed by phase level */
	phaseWidths: number[];
	/** Logic to get the labels according the current phase */
	getLabels(phase: number, index: number, previousPhase?: number): [WordingKey | null | "", WordingKey | null];
};

const RIGHT_ANGLE = 90;

export const DailyPieChart: React.FC<Props> = ({
	stages,
	totalDuration,
	currentIsoDate,
	chartSize,
	phaseColors,
	phaseWidths,
	getLabels,
	title,
	getPhaseLevel,
}) => {
	const startTime: string | undefined = stages[0]?.start;
	const endTime: string | undefined = stages[stages.length - 1]?.end;

	// The first slice starts yesterday. We need to use a different start angle
	const didStartYesterday = startTime !== undefined && isYesterday(startTime, currentIsoDate);

	console.log("FIX did start yesterday", didStartYesterday);
	// Minus the chart radius with the bigger stroke to prevent cropped artefact
	const chartRadius = chartSize / 2 - [...phaseWidths].sort().reverse()[0];
	// Used for the transform origin of the labels
	const polarOrigin = {
		x: chartSize / 2,
		y: chartSize / 2,
	};
	// const currentDate = moment(currentIsoDate);
	const sliceColors = stages
		.map((p) => phaseColors[getPhaseLevel(p.type)])
		// Add a last transparent dummy section which fills
		// the gap between the last slice end time and the current time.
		// TODO remove when back will be ready
		.concat("#00000000");

	function getSliceInnerRadius({ index }: CallbackArgs) {
		// The last segment is a dummy
		// TODO remove when back will be ready
		if (stages[index as number] === undefined) {
			return chartRadius - phaseWidths[0] / 2;
		}
		const phaseLevel = getPhaseLevel(stages[index as number]?.type);
		return chartRadius - phaseWidths[phaseLevel] / 2;
	}

	function getSliceOutterRadius({ index }: CallbackArgs) {
		// The last segment is a dummy
		// TODO remove when back will be ready
		if (stages[index as number] === undefined) {
			return chartRadius + phaseWidths[0] / 2;
		}
		const phaseLevel = getPhaseLevel(stages[index as number]?.type);
		return chartRadius + phaseWidths[phaseLevel] / 2;
	}

	// Start drawing the pie at this angle
	const startPieAngle = angle(moment(startTime));
	// The maximum drawable angle of the pie (the current hour)
	// const endPieAngle = angle(currentDate);
	const endPieAngle = angle(moment(endTime));

	// const lastSlideEndTime: string | undefined = stages[stages.length - 1]?.end;

	const data = stages.map(({ start, end }) => ({
		y: moment(end).diff(start),
	}));
	// Add a dummy section to leave a gap between the last known data time and the current date
	// TODO remove when back will be ready
	// .concat({ y: moment(currentDate).diff(lastSlideEndTime) });
	const { format, formatDuration } = useI18n();

	return (
		<View>
			<VictoryPie
				colorScale={sliceColors}
				data={data}
				startAngle={startPieAngle}
				endAngle={(didStartYesterday ? 360 : 0) + endPieAngle}
				width={chartSize}
				height={chartSize}
				padding={0}
				labels={[]}
				radius={getSliceOutterRadius}
				innerRadius={getSliceInnerRadius}
			/>
			{stages.map((phaseInfo, i, allPhases) => {
				const currentPhaseType = phaseInfo.type;
				const previousPhaseType = allPhases[i - 1]?.type;
				return getLabels(currentPhaseType, i, previousPhaseType).map((label, index) =>
					label !== null ? (
						<React.Fragment key={`${i}-${index}`}>
							<LabelPolarView
								polarOrigin={polarOrigin}
								width={100}
								height={20}
								r={135}
								angleDeg={angle(moment(index > 0 ? phaseInfo.end : phaseInfo.start)) - RIGHT_ANGLE}
							>
								<View>
									<Label style={{ fontWeight: "500" }}>{label && format(label)}</Label>
									<Label>{moment(index > 0 ? phaseInfo.end : phaseInfo.start).format("HH:mm")}</Label>
								</View>
							</LabelPolarView>
							<PolarSvg
								width={20}
								height={3}
								polarOrigin={polarOrigin}
								r={100}
								angleDeg={angle(moment(index > 0 ? phaseInfo.end : phaseInfo.start)) - RIGHT_ANGLE}
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
					<TotalDurationWrapper>
						<SliceDurationLabel>{format(title)}</SliceDurationLabel>
						<SliceDurationValue>{formatDuration(totalDuration * 60)}</SliceDurationValue>
					</TotalDurationWrapper>
					<Image source={require("@assets/images/morning.png")} />
				</Row>
				<Image source={require("@assets/images/day.png")} />
			</InsideInfos>
		</View>
	);
};

function angle(t: Moment) {
	return ((t.hours() + t.minutes() / 60) / 24) * 360;
}

function toRad(angle: number) {
	return (angle / 360) * 2 * Math.PI;
}

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

const TotalDurationWrapper = styled.View`
	background-color: ${colors.white};
	width: 90px;
	height: 90px;
	border-radius: 45px;
	padding-vertical: 20px;
	align-items: center;
`;

const SliceDurationLabel = styled.Text`
	font-size: 10px;
	color: ${colors.textPlaceholder};
`;
const SliceDurationValue = styled.Text`
	font-size: 14px;
	color: ${colors.textPlaceholder};
	margin-top: 6px;
`;
