// components/Task.stories.js
import { Lines } from "@domain/measure/representation/api";
import { object } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import * as React from "react";
import { Averages, DaysItem, LineChart } from "./LineChart";
import { data } from "./mockedDataHR.json";

const lines: Lines = data.map((e) => {
	return {
		x: moment(e.timestamp).valueOf(),
		y: e.metrics["user.hr"],
	};
});

const items: DaysItem = [
	{
		awake: 1,
		deep: 1.8,
		rem: 3.6,
		light: 5.2,
	},
	{
		awake: 1.1,
		deep: 1.9,
		rem: 3.8,
		light: 5.4,
	},
	{
		awake: 1.7,
		deep: 2.1,
		rem: 3.9,
		light: 5.4,
	},
	{
		awake: 1.5,
		deep: 1.7,
		rem: 2,
		light: 5.0,
	},
	{
		awake: 1.4,
		deep: 1.6,
		rem: 3.8,
		light: 4.8,
	},
	{
		awake: 1.8,
		deep: 2,
		rem: 3,
		light: 6.2,
	},
	{
		awake: 2,
		deep: 2.1,
		rem: 3,
		light: 5.4,
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

storiesOf("LineChart", module)
	.add("default", () => (
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
	))
	.add("no data", () => (
		<LineChart
			xColor={colors.textPrimary}
			yColor={colors.darkGray}
			data={[]}
			shouldDrawCircles={false}
			graphColor={colors.red}
			valueFormatter="date"
			valueFormatterPattern="H'h'"
		/>
	))
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
	.add("Multiple Line", () => {
		return (
			<LineChart
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				daysItem={items}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
			/>
		);
	})

	.add("Show min/max label", () => {
		return (
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
			/>
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
	});
