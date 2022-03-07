import { isYesterday } from "@domain/common/utils";
import { isToday } from "@domain/feed/business";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";
import { Row, Stack } from "../layout";
import { angle, toRad } from "./business";

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
	const isTodayPie = isToday(endTime, currentIsoDate);

	// The first slice starts yesterday. We need to use a different start angle
	const didStartTheDayBefore = startTime !== undefined && isYesterday(startTime, endTime);

	// Minus the chart radius with the bigger stroke to prevent cropped artefact
	const chartRadius = chartSize / 2 - [...phaseWidths].sort().reverse()[0];

	function getSliceInnerRadius(index: number) {
		const phaseLevel = getPhaseLevel(stages[index]?.level);
		return chartRadius - phaseWidths[phaseLevel] / 2;
	}

	function getSliceOutterRadius(index: number) {
		const phaseLevel = getPhaseLevel(stages[index]?.level);
		return chartRadius + phaseWidths[phaseLevel] / 2;
	}

	// Start drawing the pie at this angle
	const startPieAngle = angle(new Date(startTime));
	// The maximum drawable angle of the pie (the current hour)
	const endPieAngle = (didStartTheDayBefore ? 360 : 0) + angle(new Date(isTodayPie ? currentIsoDate : endTime));

	const data = stages.map((stage, index) => ({
		key: index,
		value: Date.parse(stage.end) - Date.parse(stage.start),
		svg: { fill: phaseColors[getPhaseLevel(stage.level)] },
		arc: { innerRadius: getSliceInnerRadius(index), outerRadius: getSliceOutterRadius(index) },
	}));

	const { format, formatDuration } = useI18n();

	return (
		<View style={{ width: chartSize, height: chartSize, justifyContent: "center" }}>
			<PieChart
				style={{ flex: 1 }}
				data={data}
				padAngle={0}
				startAngle={toRad(startPieAngle)}
				endAngle={toRad(endPieAngle)}
				sort={(a, b) => a.key - b.key}
			/>
			<InsideInfos align="center" justify="space-between">
				<Image source={require("@assets/images/night.png")} />
				<Row style={{ alignSelf: "stretch" }} align="center" justify="space-between">
					<Image source={require("@assets/images/evening.png")} />
					<TotalDurationWrapper>
						<SliceDurationLabel>{format(title)}</SliceDurationLabel>
						{/* @TODO  format is24h below*/}
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
