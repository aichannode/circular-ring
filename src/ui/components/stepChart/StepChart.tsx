import { createActiveMode, isInActiveMode, isInCalibrationMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { useUnmount } from "@ui/utils/lifecycleHooks";
import * as scale from "d3-scale";
import * as shape from "d3-shape";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";
import { getNearestDataIndexes, linspace, progress } from "./business";

interface Position {
	x: number;
	y: number;
}

interface Rect extends Position {
	width: number;
	height: number;
}

export interface Step {
	/** Time in milliseconds */
	x: number;
	/** Stage value */
	y: number;
}

export type Steps = Step[];
interface StepChartProps {
	data: Steps;
	labelColor?: string;
	xAxisNbTicks?: number;
	xLabelFormat?: { (x: number): string };
	xAxisPadding?: number;
	leftPadding?: number;
	rightPadding?: number;
	defaultXAxis?: number[];
	yColor?: { (y: number): string };
	yLabelFormat?: { (y: number): string };
	yAxisWidth?: number;
	yAxisRight?: boolean;
	defaultYAxis?: number[];
	chartHeight?: number;
	labelFontSize?: number;
	renderTooltip?: (step: Step) => React.ReactElement;
	tooltipYOffset?: number;
	tooltipSize?: { width: number; height: number };
	longPressDelay?: number;
	hideXAxis?: boolean;
	mode?: Mode;
	renderRightChild?: (graphContentInset: {
		top: number;
		left: number;
		right: number;
		bottom: number;
	}) => React.ReactElement;
}

const verticalContentInset = { top: 50, bottom: 20 };

export function StepChart({
	data,
	labelColor = colors.darkGray,
	yColor = () => colors.primary,
	yLabelFormat = (y) => `${y}`,
	yAxisRight = false,
	yAxisWidth = 10,
	xLabelFormat = (x) => `${x}`,
	xAxisNbTicks = 5,
	xAxisPadding = 10,
	leftPadding = xAxisPadding,
	rightPadding = xAxisPadding,
	hideXAxis = false,
	defaultYAxis = [],
	defaultXAxis = [],
	chartHeight = 150,
	labelFontSize = 10,
	tooltipYOffset = 0,
	tooltipSize = { width: 50, height: 30 },
	longPressDelay = 400,
	mode = createActiveMode(),
	renderRightChild,
	renderTooltip,
}: StepChartProps) {
	if (__DEV__) {
		if (xAxisNbTicks < 2) {
			throw new Error("xAxisNbTicks must be at least 2");
		}
	}

	const xValues = useMemo(() => (data.length ? data.map((step) => step.x) : defaultXAxis), [data, defaultXAxis]);
	const yValues = useMemo(() => (data.length ? data.map((step) => step.y) : defaultYAxis), [data, defaultYAxis]);

	const [xMin, xMax] = [Math.min(...xValues), Math.max(...xValues)];
	const [yMin, yMax] = [Math.min(...yValues, ...defaultYAxis), Math.max(...yValues, ...defaultYAxis)];

	const xAxisValues = linspace(xMin, xMax, xAxisNbTicks);
	const yAxisValues = [...new Set([...yValues, ...defaultYAxis])].sort((a, b) => a - b);

	const xContentInset = { left: leftPadding, right: rightPadding };
	const yAxisContentInset = verticalContentInset.top;
	const canShowAxes = isInActiveMode(mode) || isInCalibrationMode(mode);
	const shouldDisplay =
		(isInActiveMode(mode) || isInCalibrationMode(mode)) && data.filter((line) => line.y > 0).length > 0;
	const graphRect = useRef<Rect>();
	const dataRef = useRef({ xMin, xMax, yMin, yMax, xValues, yValues, data }); // Allow PanResponder to access to the latest available data
	const longPressTimeout = useRef<NodeJS.Timeout>();

	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [selected, setSelected] = useState<Step | null>(null);
	const [position, setPosition] = useState<Position | null>(null);
	const [rightChildLayout, setRightChildLayout] = useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });

	const { format } = useI18n();

	// TODO: This has been used to handle long press but for now we only use touch press.
	// const panResponder = useRef(
	// 	renderTooltip &&
	// 		PanResponder.create({
	// 			onStartShouldSetPanResponder: () => true,
	// 			onStartShouldSetPanResponderCapture: () => true,
	// 			onMoveShouldSetPanResponder: () => true,
	// 			onMoveShouldSetPanResponderCapture: () => true,
	// 			onPanResponderTerminationRequest: () => true,
	// 			// As we use PanResponder we cannot use onLongPress property of Touchable, so we use a timeout to detect long press.
	// 			onPanResponderGrant: (evt) => {
	// 				if (longPressTimeout.current) {
	// 					clearTimeout(longPressTimeout.current);
	// 				}
	// 				longPressTimeout.current = setTimeout(() => setTooltipVisible(true), longPressDelay);
	// 				updatePosition(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
	// 				return true;
	// 			},
	// 			onPanResponderMove: (evt) => {
	// 				updatePosition(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
	// 				return true;
	// 			},
	// 			onPanResponderRelease: () => {
	// 				if (longPressTimeout.current) {
	// 					clearTimeout(longPressTimeout.current);
	// 				}
	// 				setTooltipVisible(false);
	// 				return true;
	// 			},
	// 		})
	// );

	function updatePosition(cursorX: number, cursorY: number) {
		const { xMin, xMax, yMin, yMax, xValues, data } = dataRef.current;
		if (!graphRect.current || !data.length) {
			return;
		}

		// We need to convert the cursor position to the graph rect position
		const xScale = scale.scaleLinear().domain([0, graphRect.current.width]).range([xMin, xMax]);
		const yScale = scale.scaleLinear().domain([0, graphRect.current.height]).range([yMax, yMin]);
		const x = xScale(cursorX);
		const y = yScale(cursorY - verticalContentInset.top); // substract the content inset to get the correct position

		// We need to find the closest data points to the cursor position (can have several data points at the same x value)
		const nearestIdxs = getNearestDataIndexes(x, xValues);
		if (nearestIdxs.length === 0) {
			return;
		}

		// We need to select the closest nearest point to the cursor position using the y value
		const nearestPoints = nearestIdxs.map((idx) => data[idx]);
		const nearestPointsY = nearestPoints.map(({ y }) => y);
		const [nearestIdx] = getNearestDataIndexes(y, nearestPointsY);
		if (nearestIdx === undefined) {
			return;
		}
		const { x: nearestX, y: nearestY } = nearestPoints[nearestIdx];

		// We then convert the nearest data point to the graph rect position
		const nearestRelativeX = xScale.invert(nearestX);
		const nearestRelativeY = yScale.invert(nearestY);
		setSelected(nearestPoints[nearestIdx]);
		setPosition({ x: nearestRelativeX, y: nearestRelativeY });
	}

	function resetTooltip() {
		setTooltipVisible(false);
		setSelected(null);
		setPosition(null);
	}

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
			style={{ width: yAxisWidth, marginRight: 10, marginLeft: rightChildLayout.width }}
			contentInset={verticalContentInset}
			svg={{
				fill: labelColor,
				textAnchor: yAxisRight ? "start" : "end",
				x: yAxisRight ? "0px" : "100%",
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
				fill: labelColor,
				fontSize: labelFontSize,
			}}
			formatLabel={xLabelFormat}
		/>
	);

	const canDisplayTooltip = isInActiveMode(mode) || isInCalibrationMode(mode);
	const tooltipMinX = leftPadding;
	const tooltipMaxX = graphRect.current ? graphRect.current.width + leftPadding - tooltipSize.width : Number.MAX_VALUE;
	const tooltipMinY = 0;
	const tooltip = renderTooltip && tooltipVisible && position && selected && canDisplayTooltip && (
		<View
			style={{
				position: "absolute",
				justifyContent: "center",
				alignItems: "center",
				width: tooltipSize.width,
				height: tooltipSize.height,
				top: Math.max(
					tooltipMinY,
					position.y + // position relative to the graph
						yAxisContentInset - // offset to the top of the graph
						tooltipSize.height + // align bottom tooltip to the point
						tooltipYOffset // add spacing between tooltip and point
				),
				left: Math.max(
					tooltipMinX,
					Math.min(
						tooltipMaxX,
						position.x + // position relative to graph
							leftPadding - // offset to the left of the graph
							tooltipSize.width / 2 // horizontally center tooltip
					)
				),
			}}
			pointerEvents="none"
		>
			{renderTooltip(selected)}
		</View>
	);

	useEffect(() => {
		dataRef.current = {
			xMin,
			xMax,
			yMin,
			yMax,
			xValues,
			yValues,
			data,
		};
	}, [data, xMin, xMax, yMin, yMax, xValues, yValues]);

	useEffect(() => {
		resetTooltip();
	}, [data]);

	useUnmount(() => {
		if (longPressTimeout.current) {
			clearTimeout(longPressTimeout.current);
		}
	}, []);

	return (
		<View
			style={{
				height: chartHeight,
				flexDirection: yAxisRight ? "row-reverse" : "row",
			}}
		>
			<View style={{ marginBottom: 0, flexDirection: "row" }}>{yValues.length > 0 && yAxis}</View>
			<View
				onTouchStart={(evt) => {
					if (canDisplayTooltip) {
						updatePosition(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
						if (!tooltipVisible) {
							setTooltipVisible(true);
						}
					}
				}}
				style={{ flex: 1, position: "relative" }}
				onLayout={(event) => {
					const { x, y, width, height } = event.nativeEvent.layout;
					graphRect.current = {
						x: x + leftPadding, // offset to the left of the graph
						y: y + verticalContentInset.top, // offset to the top of the graph
						width: width - (leftPadding + rightPadding), // subtract the left and right content insets
						height: height - verticalContentInset.top - verticalContentInset.bottom, // subtract the top and bottom content insets
					};
				}}
				// {...panResponder.current?.panHandlers}
			>
				{!shouldDisplay && (
					<View
						style={[
							{
								flex: 1,
							},
							canShowAxes && {
								marginLeft: leftPadding,
								marginRight: rightPadding,
								transform: [{ translateY: verticalContentInset.top }],
							},
						]}
					>
						<TextPlaceholder content={format("global.no_data_yet")} />
					</View>
				)}
				{canShowAxes && (
					<LineChart
						style={{
							flex: 1,
							height: chartHeight,
							maxHeight: chartHeight,
							marginLeft: leftPadding,
							marginRight: rightPadding,
						}}
						data={shouldDisplay ? data : []}
						curve={shape.curveStep}
						contentInset={verticalContentInset}
						xAccessor={({ item }) => item.x}
						yAccessor={({ item }) => item.y}
						numberOfTicks={yAxisValues.length}
						yMin={yMin}
						yMax={yMax}
						svg={{
							strokeWidth: 4,
							strokeLinejoin: "round",
							stroke: "url(#gradient)",
						}}
					>
						<Grid
							svg={{
								stroke: labelColor,
								strokeWidth: 0.5,
							}}
						/>
						{gradient}
					</LineChart>
				)}
				{tooltip}
				<View
					onLayout={(e) => setRightChildLayout(e.nativeEvent.layout)}
					style={[
						{
							position: "absolute",
							right: xContentInset.right - rightChildLayout.width,
							height: "100%",
						},
						!hideXAxis && {
							bottom: verticalContentInset.bottom,
						},
					]}
				>
					{renderRightChild && renderRightChild({ ...verticalContentInset, ...xContentInset })}
				</View>
				<View
					style={{
						position: "absolute",
						bottom: 0,
						width: "100%",
					}}
				>
					{!hideXAxis && xValues.length > 0 && xAxis}
				</View>
			</View>
		</View>
	);
}
