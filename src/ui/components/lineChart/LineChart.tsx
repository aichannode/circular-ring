import { isDefined } from "@domain/common/business";
import { Point, Points } from "@domain/measure/representation/api";
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
	data?: Points;
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
	yLabelCount?: number;
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
	movingAverage?: Points;
	xAxisMin?: number;
	xAxisMax?: number;
	zoom?: {
		scaleX: number;
		scaleY: number;
		xValue: number;
		yValue: number;
	};
	isDaily?: boolean;
	minimumYValueAllowed?: number;
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
	yLabelCount,
	shouldShowMarker = false,
	labelFormatter = (x, y) =>
		isDaily ? `${moment(x).format("hh:mm")}\n${Math.round(y)}` : `${moment(x).format("Y-MM-DD")}\n${Math.round(y)}`,
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
	movingAverage,
	xAxisMin,
	xAxisMax,
	zoom,
	isDaily = false,
	minimumYValueAllowed,
}: LineChartProps) {
	const { format } = useI18n();
	const [scaleX, setScaleX] = useState(1);
	const graphRect = useRef<Rect>();
	const [maxPosition, setMaxPosition] = useState<Position | null>(null);
	const [minPosition, setMinPosition] = useState<Position | null>(null);

	const maxDataLength = !isMultipleLines ? data.length : Math.max(...(daysItem ?? []).map(({ lines }) => lines.length));
	const [xMin, xMax] = !isMultipleLines
		? [Math.min(...data.map((point) => point.x)), Math.max(...data.map((point) => point.x))]
		: [0, maxDataLength - 1];
	const shouldDisplay =
		((isInActiveMode(mode) || isInCalibrationMode(mode)) &&
			(data.filter((line) => line.y > 0).length || daysItem?.[0].lines.length)) ||
		(data.length === 0 && movingAverage?.length);
	let linspace = isDefined(yMin) && isDefined(yMax) ? ((yMax - yMin) * 10) / 100 : 0;
	if (yMin === yMax && isDefined(yMin) && isDefined(yMax)) {
		linspace = Math.abs((yMax * 10) / 100);
	}
	const [selectedX, setSelectedX] = useState<number | undefined>(data[0] ? (onSelect ? data[0].x : -1) : -1);
	const axisMinimum = isDefined(yMin) ? (shouldUpdateYmin ? yMin - linspace : yMin - linspace) : 0;
	const axisMaximum = isDefined(yMax) ? (shouldUpdateYmin ? yMax + linspace : yMax + linspace) : 0;
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
		centerAxisLabels: false,
		drawAxisLine: true,
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
		axisMinimum: Number.isFinite(xAxisMin) ? xAxisMin : undefined ?? (Number.isFinite(xMin) ? xMin : undefined),
		axisMaximum: Number.isFinite(xAxisMax) ? xAxisMax : undefined ?? (Number.isFinite(xMax) ? xMax : undefined),
	};

	const yAxis = {
		left: {
			axisMinimum: isDefined(minimumYValueAllowed) ? minimumYValueAllowed : axisMinimum,
			axisMaximum: Math.ceil(axisMaximum),
			enabled: true,
			labelCount: yLabelCount,
			labelCountForce: yLabelCount ? true : false,
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
			limitLines: averages
				? averages?.map(({ value, color }) => {
						return {
							limit: value ?? 0,
							lineColor: processColor(color),
							lineDashPhase: 2,
							lineWidth: 2,
							lineDashLengths: [30, 15],
						};
				  })
				: undefined,
		},
		right: {
			enabled: false,
		},
	};

	const dataSets = {
		dataSets: [
			{
				values:
					movingAverage?.map(({ x, y }) => {
						return { x, y, marker: "" };
					}) ?? [],
				label: "",
				config: {
					drawValues: false,
					lineWidth: 4,
					drawCircles: false,
					highlightColor: processColor("transparent"),
					color: processColor(colors.blueExtraLight),
					axisLineColor: processColor("white"),
					highlightEnabled: true,
					drawFilled: false,
					valueTextSize: 0,
					legend: false,
					mode: "HORIZONTAL_BEZIER" as const,
				},
			},
			...data
				// remove `zero` points and create a new line each time a `zero` point is found.
				.reduce(
					(acc, point) => {
						if (point.y === -1) {
							return [...acc, []];
						}
						return [...acc.slice(0, -1), [...acc[acc.length - 1], point]];
					},
					[[]] as Points[]
				)
				// remove empty lines.
				.filter((points) => points.length > 0)
				.map((lines) => ({
					values: lines.map(({ x, y }, index) => {
						let marker = "";
						if (!!shouldShowMarker) {
							marker = labelFormatter(x, y, index);
						}
						return { x, y, marker };
					}),
					label: "",
					config: {
						lineWidth: shouldDrawCircles ? 3 : 1,
						drawCircles: shouldDrawCircles,
						circleColor: processColor(graphColor),
						circleHoleColor: processColor(graphColor),

						highlightColor: processColor("transparent"),

						color: processColor(graphColor),
						axisLineColor: processColor("white"),
						highlightEnabled: true,
						drawFilled: false,
						valueTextSize: 0,
						legend: false,
						circleRadius: 4,
						mode: !shouldDrawCircles ? ("HORIZONTAL_BEZIER" as const) : undefined,

						drawValues: false,
						drawCircleHole: false,
						circleColors: !!shouldShowMarker
							? lines.map(({ x }) => {
									if (x == selectedX) {
										return processColor("#333333");
									}
									return processColor(graphColor);
							  })
							: [processColor(graphColor)],
					},
				})),
		],
	};

	const multipleDataSets = {
		dataSets:
			isMultipleLines && daysItem
				? daysItem
						// remove `zero` points and create a new line each time a `zero` point is found.
						.flatMap(({ lines, color }) => {
							const segmentedLines = [] as Array<Point & { index: number }>[];
							let hasPrevValue = false;
							for (let index = 0; index < lines.length; ++index) {
								const indexedLine = { ...lines[index], index };
								if (indexedLine.y >= 0) {
									if (hasPrevValue) {
										segmentedLines[segmentedLines.length - 1].push(indexedLine);
									} else {
										segmentedLines.push([indexedLine]);
									}
									hasPrevValue = true;
								} else {
									hasPrevValue = false;
								}
							}
							return segmentedLines.map((lines) => ({ lines, color }));
						})
						.map(({ lines, color }) => {
							return {
								values: lines.map(({ x, y, index }) => {
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
										? lines.map(({ index }) => {
												if (index == selectedX) {
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
	const tooltip = (value: number, x: number, y: number, yOffset: number) => {
		const left = Math.max(
			tooltipMinX,
			Math.min(
				tooltipMaxX,
				x + // position relative to graph
					xAxisContentInset - // offset to the left of the graph
					tooltipSize.width / 2 // horizontally center tooltip
			)
		);
		if (isNaN(left)) return null;
		return (
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
						left: left,
					}}
					pointerEvents="none"
				>
					{renderTooltip(value)}
				</View>
			)
		);
	};
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
								.domain([axisMaximum, axisMinimum])
								.range([graphRect.current.height, 0]);
							const xScale = scale
								.scaleLinear()
								.domain([
									xAxisMax ?? (Number.isFinite(xMax) ? xMax : 0),
									xAxisMin ?? (Number.isFinite(xMin) ? xMin : 0),
								])
								.range([graphRect.current.width, 0]);

							//find the x relative to yMax
							const yValues = data.length ? data.map((point) => point.y) : [];
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
								enabled: shouldShowLabel || shouldShowMarker,
								textColor: processColor(colors.white),
								markerColor: processColor(graphColor),
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
							zoom={zoom}
						></LineComponent>
					</View>
					{shouldShowLabel && scaleX < 1.06 && (
						<>
							{maxPosition && isDefined(yMax) && tooltip(yMax, maxPosition.x, maxPosition.y, tooltipYMax)}
							{minPosition && isDefined(yMin) && tooltip(yMin, minPosition.x, minPosition.y, tooltipYMin)}
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
