// components/Task.stories.js
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import * as React from "react";
import { LineChart, Lines, Averages } from "./LineChart";
import { data } from "./mockedDataHR.json";
import { object } from "@storybook/addon-knobs";

const lines: Lines = data.map((e) => {
	return {
		x: moment(e.timestamp).valueOf(),
		y: e.metrics["user.hr"],
	};
});

const averages: Averages = [
	{
		value: 98,
		color: "red",
	},
	{
		value: 60,
		color: "green",
	},
];
storiesOf("LineChart", module)
	.add("default", () => (
		<LineChart
			averages={object("averages", averages)}
			xColor={colors.textPrimary}
			yColor={colors.darkGray}
			data={lines}
			shouldDrawCircles={false}
			graphColor={"red"}
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
				graphColor={"red"}
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
				graphColor={"red"}
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
				graphColor={"red"}
			/>
		);
	});
