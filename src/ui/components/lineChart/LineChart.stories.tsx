// components/Task.stories.js
import { DataControlState, Lines, Scores7D } from "@domain/measure/representation/api";
import { object, select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import { colors } from "@ui/styles/colors";
import { Averages, MultipleDataSets } from "@ui/type";
import moment from "moment";
import * as React from "react";
import { Text } from "react-native";
import { GraphContainer } from "../measure/graphContainer";
import { LineChart } from "./LineChart";
import { data } from "./mockedDataHR.json";

const lines: Lines = data.map((e) => {
	return {
		x: moment(e.timestamp).valueOf(),
		y: e.metrics["user.hr"],
	};
});

const tooltipSize = { width: 40, height: 20 };

const items = [
	{
		awake: 1,
		deep: 1.8,
		rem: 3.6,
		light: 5.2,
		isoTime: "2022-02-13T00:54:00Z",
	},
	{
		awake: 1.1,
		deep: 1.9,
		rem: 3.8,
		light: 5.4,
		isoTime: "2022-02-14T02:18:00Z",
	},
	{
		awake: 1.7,
		deep: 2.1,
		rem: 3.9,
		light: 5.4,
		isoTime: "2022-02-15T04:14:00Z",
	},
	{
		awake: 1.5,
		deep: 1.7,
		rem: 2,
		light: 5.0,
		isoTime: "2022-02-16T04:20:00Z",
	},
	{
		awake: 1.4,
		deep: 1.6,
		rem: 3.8,
		light: 4.8,
		isoTime: "2022-02-17T04:22:00Z",
	},
	{
		awake: 1.8,
		deep: 2,
		rem: 3,
		light: 6.2,
		isoTime: "2022-02-18T04:26:00Z",
	},
	{
		awake: 2,
		deep: 2.1,
		rem: 3,
		light: 5.4,
		isoTime: "2022-02-19T04:30:00Z",
	},
];

const dataSets: MultipleDataSets = [
	{
		lines: items.map(({ isoTime, awake }) => {
			return { x: moment(isoTime).valueOf(), y: awake };
		}),
		color: colors.business.sleepAwake,
	},
	{
		lines: items.map(({ isoTime, deep }) => {
			return { x: moment(isoTime).valueOf(), y: deep };
		}),
		color: colors.business.sleepDeep,
	},
	{
		lines: items.map(({ isoTime, rem }) => {
			return { x: moment(isoTime).valueOf(), y: rem };
		}),
		color: colors.business.sleepRem,
	},
	{
		lines: items.map(({ isoTime, light }) => {
			return { x: moment(isoTime).valueOf(), y: light };
		}),
		color: colors.business.sleepLight,
	},
];

const averages: Averages = [
	{
		value: 98,
		color: colors.red,
	},
	{
		value: 60,
		color: "green",
	},
];

const [yMin, yMax] = [Math.min(...lines!.map((line) => line.y)), Math.max(...lines!.map((line) => line.y))];
const [yMinIndex, yMaxIndex] = [lines!.findIndex((line) => line.y == yMin), lines!.findIndex((line) => line.y == yMax)];

const scores: Scores7D = {
	series: [
		{
			date: "2022-03-03",
			value: 80,
		},
		{
			date: "2022-03-04",
			value: 70,
		},
		{
			date: "2022-03-05",
			value: 75,
		},
		{
			date: "2022-03-06",
			value: 65,
		},
		{
			date: "2022-03-07",
			value: 60,
		},
		{
			date: "2022-03-08",
			value: 83,
		},
		{
			date: "2022-03-09",
			value: 85,
		},
	],
	constant: {
		average: 73,
	},
	controlState: DataControlState.READY,
};
const scoresLines: Lines = scores.series.map((el) => {
	return {
		x: el ? moment(el.date).valueOf() : 0,
		y: el?.value ? el.value * 100 : 0,
	};
});

storiesOf("LineChart", module)
	.addDecorator(withKnobs)
	.add("default", () => (
		<LineChart
			averages={object("averages", averages)}
			xColor={colors.textPrimary}
			yColor={colors.darkGray}
			data={lines}
			shouldDrawCircles={false}
			graphColor={colors.red}
			valueFormatter="date"
			valueFormatterPattern={["H'h'", "HH'h':mm"]}
		/>
	))
	.add("AM/PM", () => (
		<LineChart
			averages={object("averages", averages)}
			xColor={colors.textPrimary}
			yColor={colors.darkGray}
			data={lines}
			shouldDrawCircles={false}
			graphColor={colors.red}
			valueFormatter="date"
			valueFormatterPattern={["h a", "h:mm a"]}
		/>
	))
	.add("Multiple Line", () => {
		return (
			<LineChart
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				daysItem={dataSets}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
				scaleXEnabled={false}
				shouldShowMarker={false}
				shouldShowLabel={true}
				highlightPerTapEnabled={true}
				onSelect={(date) => console.log(date)}
			/>
		);
	})
	.add("Multiple Line with custom y values", () => {
		return (
			<LineChart
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				daysItem={dataSets}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
				yValueFormatter={dataSets[0].lines.map(({ x }) => {
					return `${moment(x).format("h")}h:${moment(x).format("m")}`;
				})}
				scaleXEnabled={false}
				shouldShowMarker={false}
				shouldShowLabel={true}
				highlightPerTapEnabled={true}
				onSelect={(date) => console.log(date)}
			/>
		);
	})

	.add("no data", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "disabled", "mode");
		return (
			<LineChart
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				data={[]}
				shouldDrawCircles={false}
				graphColor={colors.red}
				valueFormatter="date"
				valueFormatterPattern="H'h'"
				mode={
					modeType === "disabled"
						? createDisabledMode()
						: modeType === "calibration"
						? createCalibrationMode(3)
						: createActiveMode()
				}
			/>
		);
	})
	.add("Custom average value & color", () => {
		return (
			<LineChart
				averages={object("averages", averages)}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				data={lines}
				shouldDrawCircles={false}
				graphColor={colors.red}
				valueFormatter="date"
				valueFormatterPattern="H'h'"
			/>
		);
	})

	.add("One Line with select", () => {
		return (
			<LineChart
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				daysItem={[{ lines: scoresLines, color: colors.red }]}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
				scaleXEnabled={false}
				shouldShowMarker={true}
				shouldShowLabel={true}
				highlightPerTapEnabled={true}
				onSelect={(date) => console.log(date)}
			/>
		);
	})
	.add("Show min/max label", () => {
		return (
			<GraphContainer style={{ height: 500 }}>
				<LineChart
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					shouldDrawCircles={false}
					graphColor={colors.red}
					valueFormatter="date"
					valueFormatterPattern="H'h'"
					shouldShowLabel={true}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					xAxisContentInset={15}
					tooltipYMin={15}
					tooltipYMax={-30}
					tooltipSize={tooltipSize}
					renderTooltip={(value) => (
						<>
							<Text
								style={{
									backgroundColor: colors.red,
									borderRadius: 7.5,
									width: tooltipSize.width,
									height: tooltipSize.height,
									color: colors.white,
									fontSize: 12,
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								{value}
							</Text>
						</>
					)}
				/>
			</GraphContainer>
		);
	})
	.add("custom color", () => {
		return (
			<LineChart
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				data={lines}
				shouldDrawCircles={false}
				graphColor={"green"}
				valueFormatter="date"
				valueFormatterPattern="H'h'"
			/>
		);
	})
	.add("Draw Circle", () => {
		return (
			<LineChart
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				shouldDrawCircles={true}
				data={lines}
				graphColor={colors.red}
				valueFormatter="date"
				valueFormatterPattern="H'h'"
			/>
		);
	})

	.add("Custom axe's color", () => {
		return (
			<LineChart
				xColor={colors.darkBlue}
				yColor={colors.darkBlue}
				shouldDrawCircles={true}
				data={lines}
				graphColor={colors.red}
				valueFormatter="date"
				valueFormatterPattern="H'h'"
			/>
		);
	})
	.add("Activity intensity (7 days)", () => {
		return (
			<LineChart
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
			/>
		);
	});
