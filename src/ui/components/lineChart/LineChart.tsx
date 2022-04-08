import { Lines } from "@domain/measure/representation/api";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React, { useState } from "react";
import { processColor, View } from "react-native";
import { LineChart as LineComponent } from "react-native-charts-wrapper";
import styled from "styled-components/native";
import { Averages, MultipleDataSets, SelectEventPayload } from "../../type";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";
export interface DayItem {
	awake: number;
	deep: number;
	rem: number;
	light: number;
}

export type DaysItem = DayItem[];

interface LineChartProps {
	data?: Lines;
	isMultipleLines?: boolean;
	averages?: Averages;
	daysItem?: MultipleDataSets;
	graphColor?: string;
	xColor: string;
	yColor: string;
	shouldDrawCircles?: boolean;
	valueFormatterPattern?: string | string[];
	valueFormatter?: string | string[] | undefined;
	yValueFormatter?: string | string[] | undefined;
	shouldShowLabel?: boolean;
	labelFormatter?: (x: number, y: number, index: number) => string;
	yMin?: number;
	yMax?: number;
	yMinIndex?: number;
	yMaxIndex?: number;
	labelCount?: number;
	hasNotEnoughData?: boolean;
	shouldShowMarker?: boolean;
	highlightPerTapEnabled?: boolean;
	scaleXEnabled?: boolean;
	onSelect?: (x: number) => void;
}

export function LineChart({
	data,
	averages,
	daysItem,
	valueFormatterPattern,
	valueFormatter,
	yValueFormatter,
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
	shouldShowMarker = false,
	labelFormatter = (x, y) => `${moment(x).format("Y-MM-DD")}\n${y}`,
	highlightPerTapEnabled = false,
	scaleXEnabled = true,
	hasNotEnoughData,
	onSelect,
}: LineChartProps) {
	const [scaleX, setScaleX] = useState(1);
	const linesLength = daysItem ? daysItem[0].lines.length : 0;
	const dataLength = data ? data.length : 0;
	const hasValidData = linesLength !== 0 || dataLength !== 0;
	const shouldDisplay = !hasNotEnoughData && hasValidData;
	const { format } = useI18n();
	const [selectedX, setSelectedX] = useState<number | undefined>(onSelect ? data?.[0].x : -1);

	const xAxis = {
		valueFormatter: valueFormatter,
		valueFormatterPattern: Array.isArray(valueFormatterPattern)
			? scaleX < 6
				? valueFormatterPattern?.[0]
				: valueFormatterPattern?.[1]
			: valueFormatterPattern,

		position: "BOTTOM" as const,
		centerAxisLabels: !isMultipleLines,
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
			valueFormatter: yValueFormatter,
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
				values: data?.map(({ x, y }, index) => {
					let marker = "";
					if (!!shouldShowMarker) {
						marker = labelFormatter(x, y, index);
					} else if (y == yMin || y == yMax) {
						marker = `${y}`;
					}
					return { x, y, marker };
				}),
				label: "",
				config: {
					drawValues: false,
					lineWidth: shouldShowMarker ? 2 : 1,
					drawCircles: shouldDrawCircles,
					circleColors: !!shouldShowMarker
						? data?.map(({ x, y }) => {
								if (x == selectedX) {
									return processColor("#333333");
								}
								return processColor(graphColor);
						  })
						: [processColor(graphColor)],
					drawCircleHole: false,
					highlightColor: processColor("transparent"),
					color: processColor(graphColor),
					axisLineColor: processColor("white"),
					highlightEnabled: true,
					drawFilled: false,
					valueTextSize: 0,
					legend: false,
					circleRadius: 4,
				},
			},
		],
	};

	const multipleDataSets = {
		dataSets: isMultipleLines
			? daysItem!.map(({ lines, color }) => {
					return {
						values: lines!.map(({ x, y }, index) => {
							let marker = "";
							if (!!shouldShowMarker) {
								marker = labelFormatter(x, y, index);
							}
							return { x: index, y, marker, value: x };
						}),
						label: "",
						config: {
							drawValues: false,
							lineWidth: 3,
							drawCircleHole: false,

							drawCircles: true,
							circleRadius: 4,
							circleColor: processColor(color),
							circleHoleColor: processColor(color),
							highlightColor: processColor("transparent"),
							color: processColor(color),
							axisLineColor: processColor("white"),
							drawFilled: false,
							valueTextSize: 0,
							legend: false,
							circleColors: !!shouldShowMarker
								? lines?.map((_, i) => {
										if (i == selectedX) {
											return processColor("#333333");
										}
										return processColor(color);
								  })
								: [processColor(color)],
						},
					};
			  })
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
			{shouldDisplay ? (
				<LineComponent
					highlights={highlights}
					legend={{
						enabled: false,
					}}
					chartDescription={{ text: "" }}
					xAxis={xAxis}
					style={{ flex: 1 }}
					data={isMultipleLines ? multipleDataSets : dataSets}
					yAxis={yAxis}
					autoScaleMinMaxEnabled={false}
					marker={{
						enabled: shouldShowLabel,
						textColor: processColor(colors.white),
						markerColor: processColor(colors.red),
					}}
					dragDecelerationEnabled={true}
					highlightPerDragEnabled={false}
					highlightPerTapEnabled={highlightPerTapEnabled}
					scaleYEnabled={false}
					scaleXEnabled={scaleXEnabled}
					onChange={(e) => setScaleX(typeof e.nativeEvent.scaleX == "undefined" ? 1 : e.nativeEvent.scaleX)}
					onSelect={(e) => {
						const payload = e.nativeEvent as SelectEventPayload | null;
						if (payload?.data) {
							setSelectedX(payload.data.x);
							e.nativeEvent && onSelect && onSelect(payload.data.x);
						}
					}}
				></LineComponent>
			) : (
				<View style={{ flex: 1 }}>
					<TextPlaceholder content={format("global.no_data_yet")} />
				</View>
			)}
		</Container>
	);
}

const Container = styled.View`
	flex: 1;
`;
