import { colors } from "@ui/styles/colors";
import * as shape from "d3-shape";
import React from "react";
import { View } from "react-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { linspace, progress } from "./business";

export interface Step {
	/** Time in milliseconds */
	x: number;
	/** Stage value */
	y: number;
}

export type Steps = Step[];
interface StepChartProps {
	data: Steps;
	xAxisNbTicks?: number;
	xLabelFormat?: { (x: number): string };
	xAxisContentInset?: number;
	defaultXAxis?: number[];
	yColor?: { (y: number): string };
	yLabelFormat?: { (y: number): string };
	yAxisWidth?: number;
	defaultYAxis?: number[];
	chartHeight?: number;
	labelFontSize?: number;
}

const verticalContentInset = { top: 20, bottom: 20 };

export function StepChart({
	data,
	yColor = () => colors.primary,
	yLabelFormat = (y) => `${y}`,
	yAxisWidth = 10,
	xLabelFormat = (x) => `${x}`,
	xAxisNbTicks = 5,
	xAxisContentInset = 0,
	defaultYAxis = [],
	defaultXAxis = [],
	chartHeight = 120,
	labelFontSize = 10,
}: StepChartProps) {
	if (__DEV__) {
		if (xAxisNbTicks < 2) {
			throw new Error("xAxisNbTicks must be at least 2");
		}
	}

	const xValues = data.length ? data.map((step) => step.x) : defaultXAxis;
	const yValues = data.length ? data.map((step) => step.y) : defaultYAxis;
	const xContentInset = { left: xAxisContentInset, right: xAxisContentInset };

	const [xMin, xMax] = [Math.min(...xValues), Math.max(...xValues)];
	const [yMin, yMax] = [Math.min(...yValues), Math.max(...yValues)];
	const yAxisValues = [...new Set(yValues)].sort((a, b) => a - b);
	const xAxisValues = linspace(xMin, xMax, xAxisNbTicks);

	const gradient = (
		<Defs key="gradient">
			<LinearGradient id="gradient" x1="0" y1="1" x2="0" y2="0">
				{yAxisValues.map((y) => (
					<Stop key={`stop-${y}`} offset={`${progress(y, yMin, yMax)}`} stopColor={yColor(y)} />
				))}
			</LinearGradient>
		</Defs>
	);

	const yAxis = (
		<YAxis
			data={yAxisValues}
			style={{ width: yAxisWidth, marginRight: 10 }}
			contentInset={verticalContentInset}
			svg={{
				fill: colors.darkGray,
				textAnchor: "end",
				x: "100%",
				fontSize: labelFontSize,
			}}
			numberOfTicks={yAxisValues.length}
			formatLabel={yLabelFormat}
		/>
	);

	const xAxis = (
		<XAxis
			data={xAxisValues}
			contentInset={xContentInset}
			xAccessor={({ item }) => item}
			svg={{
				fill: colors.darkGray,
				fontSize: labelFontSize,
			}}
			formatLabel={xLabelFormat}
		/>
	);

	return (
		<View
			style={{
				height: chartHeight,
				flexDirection: "row",
			}}
		>
			<View style={{ marginBottom: 10, flexDirection: "row" }}>{yValues.length > 0 && yAxis}</View>
			<View style={{ flex: 1 }}>
				<LineChart
					style={{
						flex: 1,
						height: chartHeight,
						maxHeight: chartHeight,
						marginLeft: xAxisContentInset,
						marginRight: xAxisContentInset,
					}}
					data={data}
					curve={shape.curveStep}
					contentInset={verticalContentInset}
					xAccessor={({ item }) => item.x}
					yAccessor={({ item }) => item.y}
					numberOfTicks={yAxisValues.length}
					svg={{
						strokeWidth: 4,
						strokeLinejoin: "round",
						stroke: "url(#gradient)",
					}}
				>
					<Grid
						svg={{
							stroke: colors.darkGray,
							strokeWidth: 0.5,
						}}
					/>
					{gradient}
				</LineChart>
				<View
					style={{
						position: "absolute",
						bottom: 0,
						width: "100%",
					}}
				>
					{xValues.length > 0 && xAxis}
				</View>
			</View>
		</View>
	);
}
