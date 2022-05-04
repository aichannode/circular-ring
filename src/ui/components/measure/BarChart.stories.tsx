// components/Task.stories.js
import { Points } from "@domain/measure/representation/api";
import { object, select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import { colors } from "@ui/styles/colors";
import { Averages } from "@ui/type";
import moment from "moment";
import * as React from "react";
import { View } from "react-native";
import { BarChart } from "./barChart";
const data: Points = [
	{ x: moment("2022-03-21").valueOf(), y: 102 },
	{ x: moment("2022-03-22").valueOf(), y: 110 },
	{ x: moment("2022-03-23").valueOf(), y: 114 },
	{ x: moment("2022-03-24").valueOf(), y: 0 },
	{ x: moment("2022-03-25").valueOf(), y: 105 },
	{ x: moment("2022-03-26").valueOf(), y: 99 },
	{ x: moment("2022-03-27").valueOf(), y: 95 },
];

const averages: Averages = [
	{
		value: 98,
		color: colors.red,
	},
	{
		value: 60,
		color: colors.redOrange,
	},
];

const valueFormatter = data.map(({ x, y }) => {
	const day = moment(x).format("dd");
	return day !== "Invalid date" ? day[0] : "";
});

export default storiesOf("BarChart", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<View style={{ height: 300 }}>
				<BarChart
					shouldShowMarker={true}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={data}
					valueFormatter={valueFormatter}
					graphColor={colors.red}
					mode={
						modeType === "disabled"
							? createDisabledMode()
							: modeType === "calibration"
							? createCalibrationMode(3)
							: createActiveMode()
					}
				/>
			</View>
		);
	})
	.add("Custom average value & color", () => {
		return (
			<View style={{ height: 300 }}>
				<BarChart
					averages={object("averages", averages)}
					shouldShowMarker={true}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={data}
					valueFormatter={valueFormatter}
					graphColor={colors.red}
				/>
			</View>
		);
	});
