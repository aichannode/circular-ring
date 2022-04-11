import { Lines } from "@domain/measure/representation/api";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, SelectEventPayload } from "@ui/type";
import moment from "moment";
import React, { useState } from "react";
import { Platform, processColor } from "react-native";
import { BarChart as BarChartWrapper } from "react-native-charts-wrapper";
import styled from "styled-components/native";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";

interface BarChartProps {
	hasNotEnoughData?: boolean;
	graphColor?: string;
	xColor: string;
	yColor: string;
	data: Lines;
	shouldShowMarker?: boolean;
	valueFormatter?: string | string[];
	onSelect?: (x: number) => void;
	averages?: Averages;
}

export function BarChart({
	hasNotEnoughData,
	graphColor = colors.red,
	xColor = colors.textPrimary,
	yColor = colors.darkGray,
	shouldShowMarker = false,
	valueFormatter,
	data,
	onSelect,
	averages,
}: BarChartProps) {
	const [selectedX, setSelectedX] = useState<number | undefined>(-1);

	const dataSets = {
		dataSets: [
			{
				values: data?.map(({ x, y }, index) => {
					let marker = "";
					if (!!shouldShowMarker && y != 0) {
						marker = `${moment(x).format("Y-MM-DD")}\n${y}`;
					}
					return { x: index, y, marker };
				}),
				label: "",
				config: {
					colors: data.map((el) => {
						return el.x == selectedX ? processColor("#333333") : processColor(graphColor);
					}),
					axisLineColor: processColor("white"),
					highlightEnabled: true,
					valueTextSize: 0,
					legend: false,
					highlightAlpha: Platform.OS === "ios" ? 100 : 255,
					highlightColor: processColor(colors.selected),
				},
			},
		],

		config: {
			barWidth: 0.07,
		},
	};

	const xAxis = {
		valueFormatter: valueFormatter,
		position: "BOTTOM" as const,
		drawAxisLine: false,
		enabled: true,
		granularity: 1,
		drawLabels: true,
		drawGridLines: false,
		textSize: 10,
		yOffset: 10,
		labelCountForce: true,
		textColor: processColor(xColor),
		granularityEnabled: true,
		axisLineColor: processColor("white"),
	};

	const yAxis = {
		left: {
			enabled: true,
			textColor: processColor(yColor),
			gridLineWidth: 0.5,
			drawLabels: true,
			textSize: 10,
			gridColor: processColor(colors.extraLightGray),
			axisLineColor: processColor("white"),
			granularityEnabled: true,
			granularity: 1,
			drawGridLines: true,
			drawAxisLine: false,
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

	const { format } = useI18n();

	return (
		<Container>
			{hasNotEnoughData ? (
				<TextPlaceholder content={format("global.no_data_yet")} />
			) : (
				<BarChartWrapper
					chartDescription={{ text: "" }}
					data={dataSets}
					xAxis={xAxis}
					yAxis={yAxis}
					style={{ flex: 1 }}
					animation={{ durationX: 0 }}
					legend={{
						enabled: false,
					}}
					gridBackgroundColor={processColor("white")}
					zoom={{ scaleX: 1, scaleY: 1, xValue: Math.floor(dataSets.dataSets.values.length / 2), yValue: 1 }}
					pinchZoom={true}
					scaleYEnabled={false}
					doubleTapToZoomEnabled={false}
					drawValueAboveBar={false}
					highlightFullBarEnabled={true}
					onSelect={(e) => {
						const payload = e.nativeEvent as SelectEventPayload | null;
						if (payload?.data) {
							setSelectedX(payload.data.x);
							e.nativeEvent && onSelect && onSelect(payload.data.x);
						}
					}}
					marker={{
						enabled: shouldShowMarker,
						textColor: processColor(colors.white),
						markerColor: processColor(colors.red),
					}}
				/>
			)}
		</Container>
	);
}
const Container = styled.View`
	flex: 1;
`;
