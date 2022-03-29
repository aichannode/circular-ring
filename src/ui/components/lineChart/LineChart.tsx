import { Lines } from "@domain/measure/representation/api";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { processColor, View } from "react-native";
import { LineChart as LineComponent } from "react-native-charts-wrapper";
import styled from "styled-components/native";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";

export interface DayItem {
	awake: number;
	deep: number;
	rem: number;
	light: number;
}
export interface Average {
	/** value */
	value: number;
	/** color */
	color: string;
}
export type Averages = Average[];
export type DaysItem = DayItem[];

interface LineChartProps {
	data?: Lines;
	isMultipleLines?: boolean;
	averages?: Averages;
	daysItem?: DaysItem;
	graphColor?: string;
	xColor: string;
	yColor: string;
	shouldDrawCircles?: boolean;
	valueFormatterPattern?: string | string[];
	valueFormatter: string | string[];
	shouldShowLabel?: boolean;
	yMin?: number;
	yMax?: number;
	yMinIndex?: number;
	yMaxIndex?: number;
	labelCount?: number;
	hasNotEnoughData?: boolean;
}

export function LineChart({
	data,
	averages,
	daysItem,
	valueFormatterPattern,
	valueFormatter,
	isMultipleLines = false,
	graphColor = colors.red,
	shouldDrawCircles = false,
	xColor = colors.textPrimary,
	yColor = colors.darkGray,
	shouldShowLabel = false,
	yMin,
	yMax,
	yMinIndex,
	yMaxIndex,
	labelCount,
	hasNotEnoughData,
}: LineChartProps) {
	const [scaleX, setScaleX] = useState(1);
	const _hasNotEnoughData = hasNotEnoughData || (daysItem?.length === 0 && data?.length === 0);

	const { format } = useI18n();

	const xAxis = {
		valueFormatter: valueFormatter,
		valueFormatterPattern:
			typeof valueFormatterPattern == "string"
				? valueFormatterPattern
				: scaleX < 6
				? valueFormatterPattern?.[0]
				: valueFormatterPattern?.[1],
		position: "BOTTOM" as const,
		centerAxisLabels: isMultipleLines ? false : true,
		drawAxisLine: false,
		enabled: true,
		granularity: 1,
		drawLabels: true,
		drawGridLines: false,
		textSize: 10,
		yOffset: 30,
		labelCount: labelCount,
		labelCountForce: true,
		textColor: processColor(xColor),
		granularityEnabled: true,
		axisLineColor: processColor("white"),
	};

	const yAxis = {
		left: {
			labelCount: 4,
			axisMinimum: yMin ? yMin - ((yMin % 10) + 10) : 0,
			enabled: true,
			textColor: processColor(yColor),
			drawGridLines: true,
			gridLineWidth: 0.5,
			drawAxisLine: false,
			drawLabels: true,
			textSize: 10,
			gridColor: processColor(colors.extraLightGray),
			granularityEnabled: true,
			granularity: 1,
			axisLineColor: processColor("white"),
			limitLines: averages?.map(({ value, color }) => {
				return {
					limit: value,
					lineColor: processColor(color),
					lineDashPhase: 2,
					lineWidth: 2,
					lineDashLengths: [30, 15],
				};
			}),
		},
		right: {
			enabled: false,
		},
	};

	const dataSets = {
		dataSets: [
			{
				values: data?.map(({ x, y }) => {
					const marker = y == yMin || y == yMax ? `${y}` : "";
					return { x, y, marker };
				}),
				label: "",
				config: {
					drawValues: false,
					lineWidth: 1,
					drawCircles: shouldDrawCircles,
					circleColor: processColor(graphColor),
					highlightColor: processColor("transparent"),
					color: processColor(graphColor),
					axisLineColor: processColor("white"),
					highlightEnabled: true,
					drawFilled: false,
					valueTextSize: 0,
					legend: false,
				},
			},
		],
	};

	const dataLineWeeks = {
		dataSets: isMultipleLines
			? [
					{
						values: daysItem!.map(({ awake }, index) => {
							return { x: index, y: awake };
						}),
						label: "",
						config: {
							drawValues: false,
							lineWidth: 3,
							drawCircles: true,
							circleRadius: 4,
							circleColor: processColor(colors.business.sleepAwake),
							circleHoleColor: processColor(colors.business.sleepAwake),
							highlightColor: processColor("transparent"),
							color: processColor(colors.business.sleepAwake),
							axisLineColor: processColor("white"),
							drawFilled: false,
							valueTextSize: 0,
							legend: false,
						},
					},
					{
						values: daysItem!.map(({ deep }, index) => {
							return { x: index, y: deep };
						}),
						label: "",
						config: {
							drawValues: false,
							lineWidth: 3,
							drawCircles: true,
							circleRadius: 4,
							circleColor: processColor(colors.business.sleepDeep),
							circleHoleColor: processColor(colors.business.sleepDeep),
							highlightColor: processColor("transparent"),
							color: processColor(colors.business.sleepDeep),
							axisLineColor: processColor("white"),
							drawFilled: false,
							valueTextSize: 0,
							legend: false,
						},
					},

					{
						values: daysItem!.map(({ rem }, index) => {
							return { x: index, y: rem };
						}),
						label: "",
						config: {
							drawValues: false,
							lineWidth: 3,
							drawCircles: true,
							circleRadius: 4,
							circleColor: processColor(colors.business.sleepRem),
							circleHoleColor: processColor(colors.business.sleepRem),
							highlightColor: processColor("transparent"),
							color: processColor(colors.business.sleepRem),
							axisLineColor: processColor("white"),
							drawFilled: false,
							valueTextSize: 0,
							legend: false,
						},
					},
					{
						values: daysItem!.map(({ light }, index) => {
							return { x: index, y: light };
						}),
						label: "",
						config: {
							drawValues: false,
							lineWidth: 3,
							drawCircles: true,
							circleRadius: 4,
							circleColor: processColor(colors.business.sleepLight),
							circleHoleColor: processColor(colors.business.sleepLight),
							highlightColor: processColor("transparent"),
							color: processColor(colors.business.sleepLight),
							axisLineColor: processColor("white"),
							drawFilled: false,
							valueTextSize: 0,
							legend: false,
						},
					},
			  ]
			: [],
	};
	const highlights = data?.length
		? [
				{ x: yMinIndex ? data?.[yMinIndex].x : 0, y: yMinIndex ? data?.[yMinIndex].y : 0 },
				{ x: yMaxIndex ? data?.[yMaxIndex].x : 0, y: yMaxIndex ? data?.[yMaxIndex].y : 0 },
		  ]
		: [];
	return (
		<Container>
			{_hasNotEnoughData ? (
				<View style={{ flex: 1 }}>
					<TextPlaceholder content={format("global.no_data_yet")} />
				</View>
			) : (
				<LineComponent
					highlights={highlights}
					legend={{
						enabled: false,
					}}
					chartDescription={{ text: "" }}
					xAxis={xAxis}
					style={{ flex: 1 }}
					data={isMultipleLines ? dataLineWeeks : dataSets}
					yAxis={yAxis}
					autoScaleMinMaxEnabled={false}
					marker={{
						enabled: shouldShowLabel,
						textColor: processColor(colors.white),
						markerColor: processColor(colors.red),
					}}
					dragDecelerationEnabled={true}
					highlightPerDragEnabled={false}
					highlightPerTapEnabled={false}
					doubleTapToZoomEnabled={true}
					scaleYEnabled={false}
					scaleXEnabled={!isMultipleLines}
					onChange={(e) => setScaleX(typeof e.nativeEvent.scaleX == "undefined" ? 1 : e.nativeEvent.scaleX)}
				></LineComponent>
			)}
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	padding: 20px;
`;
