import { isDefined } from "@domain/common/business";
import { Lines } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import * as scale from "d3-scale";
import moment from "moment";
import React, { useRef, useState } from "react";
import { processColor, View } from "react-native";
import { LineChart as LineComponent } from "react-native-charts-wrapper";
import styled from "styled-components/native";
import { Averages, Mode, MultipleDataSets, SelectEventPayload } from "../../type";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";
import { getNearestDataIndexes } from "../stepChart/business";

export interface DayItem {
	awake: number;
	deep: number;
	rem: number;
	light: number;
}

interface Position {
	x: number;
	y: number;
}

interface Rect extends Position {
	width: number;
	height: number;
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
	mode?: Mode;
	shouldShowMarker?: boolean;
	highlightPerTapEnabled?: boolean;
	scaleXEnabled?: boolean;
	onSelect?: (x: number) => void;
	tooltipSize?: { width: number; height: number };
	xAxisContentInset?: number;
	tooltipYMin?: number;
	tooltipYMax?: number;
	renderTooltip?: (value: number) => React.ReactElement;
	shouldUpdateYmin?: boolean;
}

const verticalContentInset = { top: 40, bottom: 20 };

export function LineChart({
	data = [],
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
	mode = createActiveMode(),
	onSelect,
	tooltipSize = { width: 40, height: 20 },
	xAxisContentInset = 0,
	tooltipYMin = 0,
	tooltipYMax = 0,
	renderTooltip,
	shouldUpdateYmin = true,
}: LineChartProps) {
	const [scaleX, setScaleX] = useState(1);
	const graphRect = useRef<Rect>();
	const [maxPosition, setMaxPosition] = useState<Position | null>(null);
	const [minPosition, setMinPosition] = useState<Position | null>(null);

	const [xMin, xMax] = !isMultipleLines
		? [Math.min(...data.map((line) => line.x)), Math.max(...data.map((line) => line.x))]
		: [0, 0];

	const shouldDisplay = isInActiveMode(mode) || isInCalibrationMode(mode);
	const { format } = useI18n();
	const [selectedX, setSelectedX] = useState<number | undefined>(data[0] ? (onSelect ? data[0].x : -1) : undefined);
	const axisMinimum = yMin ? (shouldUpdateYmin ? yMin - ((yMin % 10) + 10) : yMin) : 0;

	const yAxisContentInset = verticalContentInset.top;

	const tooltipMinX = xAxisContentInset;
	const tooltipMaxX = graphRect.current
		? graphRect.current.width + xAxisContentInset - tooltipSize.width
		: Number.MAX_VALUE;
	const tooltipMinY = 0;

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
			axisMinimum: axisMinimum > 0 ? axisMinimum : 0,
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
				values: data.map(({ x, y }, index) => {
					let marker = "";
					if (!!shouldShowMarker) {
						marker = labelFormatter(x, y, index);
					}
					return { x, y, marker };
				}),
				label: "",
				config: {
					drawValues: false,
					lineWidth: shouldShowMarker ? 2 : 1,
					drawCircles: shouldDrawCircles,
					circleColors: !!shouldShowMarker
						? data.map(({ x }) => {
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
					mode: "HORIZONTAL_BEZIER" as const,
				},
			},
		],
	};

	const multipleDataSets = {
		dataSets:
			isMultipleLines && daysItem
				? daysItem.map(({ lines, color }) => {
						return {
							values: lines.map(({ x, y }, index) => {
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
									? lines.map((_, i) => {
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

	const highlights = data.length
		? [
				{ x: yMinIndex ? data[yMinIndex].x : 0, y: yMinIndex ? data[yMinIndex].y : 0 },
				{ x: yMaxIndex ? data[yMaxIndex].x : 0, y: yMaxIndex ? data[yMaxIndex].y : 0 },
		  ]
		: [];
	const tooltip = (value: number, x: number, y: number, yOffset: number) =>
		renderTooltip && (
			<View
				style={{
					position: "absolute",
					justifyContent: "center",
					alignItems: "center",
					width: tooltipSize.width,
					height: tooltipSize.height,
					top: Math.max(
						tooltipMinY,
						y + // position relative to the graph
							yAxisContentInset - // offset to the top of the graph
							tooltipSize.height + // align bottom tooltip to the point
							yOffset // add spacing between tooltip and point
					),
					left: Math.max(
						tooltipMinX,
						Math.min(
							tooltipMaxX,
							x + // position relative to graph
								xAxisContentInset - // offset to the left of the graph
								tooltipSize.width / 2 // horizontally center tooltip
						)
					),
				}}
				pointerEvents="none"
			>
				{renderTooltip(value)}
			</View>
		);
	return (
		<Container>
			{shouldDisplay ? (
				<>
					<View
						style={{ flex: 1, position: "relative" }}
						onLayout={(event) => {
							const { x, y, width, height } = event.nativeEvent.layout;
							graphRect.current = {
								x: x + xAxisContentInset, // offset to the left of the graph
								y: y + verticalContentInset.top, // offset to the top of the graph
								width: width - xAxisContentInset * 2, // subtract the left and right content insets
								height: height - verticalContentInset.top - verticalContentInset.bottom, // subtract the top and bottom content insets
							};
							const yScale = scale
								.scaleLinear()
								.domain([
									isDefined(yMax) ? yMax - (yMax % 10) + 10 : 0,
									isDefined(yMin) ? yMin - ((yMin % 10) + 10) : 0,
								])
								.range([graphRect.current.height, 0]);
							const xScale = scale.scaleLinear().domain([xMax, xMin]).range([graphRect.current.width, 0]);

							//find the x relative to yMax
							const yValues = data.length ? data.map((line) => line.y) : [];
							const nearestMaxIdxs = getNearestDataIndexes(isDefined(yMax) ? yMax : 0, yValues);
							const xLineMax = data.length ? data[nearestMaxIdxs[0]] : null;

							if (xLineMax) {
								setMaxPosition({
									x: xScale(xLineMax.x),
									y: graphRect.current.height - yScale(xLineMax.y),
								});
							}

							//find the x relative to yMin
							const nearestMinIdxs = getNearestDataIndexes(isDefined(yMin) ? yMin : 0, yValues);
							const xLineMin = data.length ? data[nearestMinIdxs[0]] : null;
							if (xLineMin) {
								setMinPosition({
									x: xScale(xLineMin.x),
									y: graphRect.current.height - yScale(xLineMin.y),
								});
							}
						}}
					>
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
					</View>
					{shouldShowLabel && scaleX < 1.06 && (
						<>
							{maxPosition && yMax && tooltip(yMax, maxPosition.x, maxPosition.y, tooltipYMax)}
							{minPosition && yMin && tooltip(yMin, minPosition.x, minPosition.y, tooltipYMin)}
						</>
					)}
				</>
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
