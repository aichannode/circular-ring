import { isDefined } from "@domain/common/business";
import { Point, Points } from "@domain/measure/representation/api";
import { createActiveMode, isInDisabledMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode, SelectEventPayload } from "@ui/type";
import React, { useState } from "react";
import { Platform, processColor } from "react-native";
import { BarChart as BarChartWrapper } from "react-native-charts-wrapper";
import styled from "styled-components/native";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";
interface BarChartProps {
	graphColor?: string;
	xColor: string;
	yColor: string;
	data: Points;
	shouldShowMarker?: boolean;
	valueFormatter?: string | string[];
	onSelect?: (x: number) => void;
	averages?: Averages;
	mode?: Mode;
	yMin?: number;
	yMax?: number;
	shouldAddOperator?: boolean;
	mapXAxis?: (element: Point, index: number) => number;
	mapBarColor?: (element: Point, index: number) => string;
	mapMarker?: (element: Point, index: number) => string;
	horizontalPadding?: number;
	labelCount?: number;
	isTemperature?: boolean;
}

export function BarChart({
	mode = createActiveMode(),
	graphColor = colors.red,
	xColor = colors.textPrimary,
	yColor = colors.darkGray,
	shouldShowMarker = false,
	mapXAxis = (_, index) => index,
	mapMarker = (el) => `${el.y}`,
	mapBarColor = () => graphColor,
	valueFormatter,
	data,
	onSelect,
	averages,
	yMin,
	yMax,
	horizontalPadding = 0.1,
	labelCount,
	isTemperature = false,
}: BarChartProps) {
	const [selectedX, setSelectedX] = useState<number | undefined>(-1);
	const linspace = isDefined(yMin) && isDefined(yMax) ? ((yMax - yMin) * 10) / 100 : 0;
	const axisMinimum = isDefined(yMin) ? yMin - linspace : 0;
	const axisMaximum = isDefined(yMax) ? yMax + linspace : 0;

	const dataSets = {
		dataSets: [
			{
				values: data
					?.map((el, index) => ({ ...el, _index: index }))
					.filter((el) => (isTemperature ? el.y != -1000 : el.y != -1))
					.map(({ x, y, _index, ...args }) => {
						let marker = "";
						marker = `${mapMarker({ x, y: y, ...args }, _index)}`;
						return { x: mapXAxis({ x, y: y, ...args }, _index), y: isTemperature && y == 0 ? 0.005 : y, marker };
					}),
				label: "",
				config: {
					colors: data.map((el, index) => {
						return el.x == selectedX ? processColor("#333333") : processColor(mapBarColor(el, index));
					}),
					axisLineColor: processColor("white"),
					highlightEnabled: true,
					valueTextSize: 0,
					legend: false,
					valueTextColor: processColor("rgba(0,0,0,0)"),
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
		labelCount: labelCount,
		drawGridLines: false,
		textSize: 10,
		yOffset: 10,
		labelCountForce: true,
		textColor: processColor(xColor),
		granularityEnabled: true,
		axisLineColor: processColor("white"),
		axisMinimum: -horizontalPadding,
		axisMaximum: Math.max(...data.map((el, index) => mapXAxis(el, index))) + horizontalPadding,
	};

	const yAxis = {
		left: {
			enabled: true,
			axisMinimum: axisMinimum,
			axisMaximum: axisMaximum,
			labelCount: isTemperature ? 3 : undefined,
			labelCountForce: isTemperature,
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
			{isInDisabledMode(mode) ? (
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
						markerColor: processColor(graphColor),
					}}
				/>
			)}
		</Container>
	);
}
const Container = styled.View`
	flex: 1;
`;
