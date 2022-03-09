import { colors } from "@ui/styles/colors";
import React from "react";
import { processColor } from "react-native";
import { LineChart as LineComponent } from "react-native-charts-wrapper";
import styled from "styled-components/native";

export interface Line {
	/** timestamp */
	x: number;
	/** bpm */
	y: number;
}
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
export type Lines = Line[];
export type Averages = Average[];
export type DaysItem = DayItem[];

interface LineChartProps {
	data?: Lines;
	isWeek?: boolean;
	averages?: Averages;
	daysItem?: DaysItem;
	graphColor?: string;
	xColor: string;
	yColor: string;
	shouldDrawCircles?: boolean;
	valueFormatterPattern?: string;
	valueFormatter: string | string[];
}

export function LineChart({
	data,
	averages,
	daysItem,
	valueFormatterPattern,
	valueFormatter,
	isWeek = false,
	graphColor = colors.red,
	shouldDrawCircles = false,
	xColor = colors.textPrimary,
	yColor = colors.darkGray,
}: LineChartProps) {
	const yMin = !isWeek ? Math.min(...data!.map((line) => line.y)) : 0;

	const xAxis = {
		valueFormatter: valueFormatter,
		valueFormatterPattern: valueFormatterPattern,

		position: "BOTTOM" as const,
		centerAxisLabels: isWeek ? false : true,
		drawAxisLine: false,
		enabled: true,
		granularity: 1,
		drawLabels: true,
		drawGridLines: false,
		textSize: 10,
		yOffset: 30,
		textColor: processColor(xColor),
		granularityEnabled: true,
		axisLineColor: processColor("white"),
	};

	const yAxis = {
		left: {
			labelCount: 4,
			axisMinimum: isWeek ? 0 : yMin - ((yMin % 10) + 10),
			enabled: true,
			textColor: processColor(yColor),
			drawGridLines: true,
			gridLineWidth: 0.5,
			drawAxisLine: false,
			drawLabels: true,
			textSize: 10,
			gridColor: processColor(yColor),
			granularityEnabled: true,
			granularity: 1,
			axisLineColor: processColor("white"),

			limitLines: averages?.map(({ value, color }) => {
				return {
					limit: value,
					lineColor: processColor(color),
					lineDashPhase: 2,
					lineWidth: 2.5,
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
				values: data,
				label: "",
				config: {
					drawValues: false,
					lineWidth: 1,
					drawCircles: shouldDrawCircles,
					circleColor: processColor(graphColor),
					highlightColor: processColor("transparent"),
					color: processColor(graphColor),
					axisLineColor: processColor("white"),

					drawFilled: false,
					valueTextSize: 0,
					legend: false,
				},
			},
		],
	};

	const dataLineWeeks = {
		dataSets: isWeek
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
							circleRadius: 6,
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
							circleRadius: 6,
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
							circleRadius: 6,
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
							circleRadius: 6,
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

	return (
		<Container>
			<LineComponent
				legend={{
					enabled: false,
				}}
				chartDescription={{ text: "" }}
				xAxis={xAxis}
				style={{ flex: 1 }}
				data={isWeek ? dataLineWeeks : dataSets}
				yAxis={yAxis}
				autoScaleMinMaxEnabled={false}
				touchEnabled={false}
				dragEnabled={false}
				scaleEnabled={false}
				scaleXEnabled={false}
				scaleYEnabled={false}
				pinchZoom={false}
				doubleTapToZoomEnabled={false}
				highlightPerTapEnabled={false}
				highlightPerDragEnabled={false}
				dragDecelerationEnabled={false}
				keepPositionOnRotation={false}
			></LineComponent>
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
	padding: 20px;
`;
