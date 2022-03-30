// components/Task.stories.js
import { Lines, Scores7D } from "@domain/measure/representation/api";
import { boolean, object, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import { MultipleDataSets } from "@ui/type";
import moment from "moment";
import * as React from "react";
import { GraphContainer } from "../measure/graphContainer";
import { Averages, LineChart } from "./LineChart";
import { data } from "./mockedDataHR.json";

const lines: Lines = data.map((e) => {
	return {
		x: moment(e.timestamp).valueOf(),
		y: e.metrics["user.hr"],
	};
});

const items = [
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

const dataSets: MultipleDataSets = [
	{
		lines: items.map(({ awake }, index) => {
			return { x: index, y: awake };
		}),
		color: colors.business.sleepAwake,
	},
	{
		lines: items.map(({ deep }, index) => {
			return { x: index, y: deep };
		}),
		color: colors.business.sleepDeep,
	},
	{
		lines: items.map(({ rem }, index) => {
			return { x: index, y: rem };
		}),
		color: colors.business.sleepRem,
	},
	{
		lines: items.map(({ light }, index) => {
			return { x: index, y: light };
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
	scores: [
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
};
const scoresLines: Lines = scores.scores.map((el) => {
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
				shouldShowMarker={true}
				shouldShowLabel={true}
				highlightPerTapEnabled={true}
				onSelect={(date) => console.log(date)}
			/>
		);
	})
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
	.add("no data", () => (
		<LineChart
			xColor={colors.textPrimary}
			yColor={colors.darkGray}
			data={[]}
			shouldDrawCircles={false}
			graphColor={colors.red}
			valueFormatter="date"
			valueFormatterPattern="H'h'"
			hasNotEnoughData={boolean("hasNotEnoughData", false)}
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
	});
