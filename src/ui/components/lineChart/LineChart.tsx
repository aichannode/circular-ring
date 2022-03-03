import React from "react";
import { processColor } from "react-native";
import { LineChart as LineComponent } from "react-native-charts-wrapper";
import { colors } from "@ui/styles/colors";
import styled from "styled-components/native";

export interface Line {
	/** timestamp */
	x: number;
	/** bpm */
	y: number;
}
export type Lines = Line[];

interface LineChartProps {
	data: Lines;
	graphColor: string;
	xColor: string;
	yColor: string;
	shouldDrawCircles?: boolean;
}

export function LineChart({
	data,
	graphColor = colors.red,
	shouldDrawCircles = false,
	xColor = colors.textPrimary,
	yColor = colors.darkGray,
}: LineChartProps) {
	const yValues = data.map((line) => line.y);
	const yMin = Math.min(...yValues);

	const xAxis = {
		valueFormatter: "date",
		valueFormatterPattern: "H'h'",
		position: "BOTTOM" as const,
		centerAxisLabels: true,
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
			axisMinimum: yMin - ((yMin % 10) + 10),
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

	return (
		<Container>
			<LineComponent
				legend={{
					enabled: false,
				}}
				chartDescription={{ text: "" }}
				xAxis={xAxis}
				style={{ flex: 1 }}
				data={dataSets}
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
