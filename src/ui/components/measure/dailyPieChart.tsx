import { isYesterday } from "@domain/common/utils";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment, { Moment } from "moment";
import React from "react";
import { Image, View } from "react-native";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";
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
};

export const DailyPieChart: React.FC<Props> = ({
	stages,
	totalDuration,
	currentIsoDate,
	chartSize,
	phaseColors,
	phaseWidths,
	title,
	children,
	getPhaseLevel,
}) => {
	const startTime: string | undefined = stages[0]?.start;
	const endTime: string | undefined = stages[stages.length - 1]?.end;

	// The first slice starts yesterday. We need to use a different start angle
	const didStartYesterday = startTime !== undefined && isYesterday(startTime, currentIsoDate);

	// Minus the chart radius with the bigger stroke to prevent cropped artefact
	const chartRadius = chartSize / 2 - [...phaseWidths].sort().reverse()[0];

	// const currentDate = moment(currentIsoDate);
	const sliceColors = stages
		.map((p) => phaseColors[getPhaseLevel(p.stage)])
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
		const phaseLevel = getPhaseLevel(stages[index as number]?.stage);
		return chartRadius - phaseWidths[phaseLevel] / 2;
	}

	function getSliceOutterRadius({ index }: CallbackArgs) {
		// The last segment is a dummy
		// TODO remove when back will be ready
		if (stages[index as number] === undefined) {
			return chartRadius + phaseWidths[0] / 2;
		}
		const phaseLevel = getPhaseLevel(stages[index as number]?.stage);
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
			{children}
		</View>
	);
};

function angle(t: Moment) {
	return ((t.hours() + t.minutes() / 60) / 24) * 360;
}

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
