// components/Task.stories.js
import { SleepStage } from "@domain/measure/type";
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import { Tag } from "@ui/components/tag";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import * as React from "react";
import { Text } from "react-native";
import { StepChart, Steps } from "./StepChart";

const defaultData: Steps = [
	{ x: 0, y: 1 },
	{ x: 1, y: 1 },
	{ x: 2, y: 2 },
	{ x: 5, y: 2 },
	{ x: 10, y: 4 },
	{ x: 11, y: 4 },
	{ x: 13, y: 3 },
	{ x: 16, y: 3 },
];

const cursor = moment().hour(3).minutes(0);

const hypnogramData: Steps = [
	// AWAKE
	{ x: cursor.valueOf(), y: 4 },
	{ x: cursor.add(3, "hours").valueOf(), y: 4 },
	// REM
	{ x: cursor.valueOf(), y: 3 },
	{ x: cursor.add(10, "minutes").valueOf(), y: 3 },
	// LIGHT
	{ x: cursor.valueOf(), y: 2 },
	{ x: cursor.add(30, "minutes").valueOf(), y: 2 },
	// DEEP
	{ x: cursor.valueOf(), y: 1 },
	{ x: cursor.add(10, "hours").valueOf(), y: 1 },
	// AWAKE
	{ x: cursor.valueOf(), y: 4 },
	{ x: cursor.add(2, "hours").valueOf(), y: 4 },
	// AWAKE
	{ x: cursor.valueOf(), y: 4 },
	{ x: cursor.add(2, "hours").valueOf(), y: 3 },
];

function yColor(y: number) {
	switch (y) {
		case 1:
			return "rgb(24, 48, 174)";
		case 2:
			return "rgb(17, 124, 243)";
		case 3:
			return "rgb(0, 179, 255)";
		case 4:
			return "rgb(25, 217, 71)";
		default:
			throw new Error("Unknown step value");
	}
}

function yLabelFormat(y: number) {
	switch (y) {
		case 1:
			return "Deep";
		case 2:
			return "Light";
		case 3:
			return "REM";
		case 4:
			return "Awake";
		default:
			throw new Error("Unknown step value");
	}
}

function xLabelFormat(x: number) {
	return moment(x).format("H A");
}

const defaultYAxis = [SleepStage.DEEP, SleepStage.LIGHT, SleepStage.REM, SleepStage.AWAKE];
const defaultXAxis = [moment().hour(0).valueOf(), moment().hour(8).valueOf()];

storiesOf("StepChart", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		return <StepChart data={defaultData} />;
	})
	.add("with tooltip", () => {
		return (
			<StepChart
				data={defaultData}
				renderTooltip={(step) => (
					<Text style={{ color: "white" }}>
						({step.x},{step.y})
					</Text>
				)}
				tooltipYOffset={-10}
			/>
		);
	})
	.add("with only 2 steps", () => {
		return <StepChart data={defaultData.filter((el) => el.y == 1 || el.y == 2)} />;
	})
	.add("without x axis ticks", () => {
		return <StepChart data={defaultData} xAxisNbTicks={2} />;
	})
	.add("without data", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<StepChart
				data={[]}
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
	.add("without data and with placeholders", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<StepChart
				data={[]}
				defaultYAxis={[1, 2, 3, 4]}
				defaultXAxis={[0, 10]}
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
	.add("no overlap x label", () => {
		return <StepChart data={defaultData} xAxisContentInset={5} />;
	})
	.add("custom color", () => {
		return <StepChart data={defaultData} yColor={yColor} />;
	})
	.add("custom y label format", () => {
		return <StepChart data={defaultData} yLabelFormat={(y) => `${y} px`} yAxisWidth={20} />;
	})
	.add("custom x label format", () => {
		return <StepChart data={defaultData} xLabelFormat={(x) => `${x} H`} xAxisContentInset={12} />;
	})
	.add("custom number of ticks", () => {
		return <StepChart data={defaultData} xAxisNbTicks={3} />;
	})
	.add("hypnograme", () => {
		return (
			<StepChart
				data={hypnogramData}
				yAxisWidth={31}
				yColor={yColor}
				yLabelFormat={yLabelFormat}
				xLabelFormat={xLabelFormat}
				xAxisContentInset={15}
				tooltipYOffset={-30}
				tooltipSize={{ width: 40, height: 30 }}
				renderTooltip={(step) => (
					<>
						<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
							{moment(step.x).format("HH:mm")}
						</Tag>
						<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
					</>
				)}
			/>
		);
	})
	.add("hypnograme without data", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<StepChart
				data={[]}
				defaultYAxis={defaultYAxis}
				defaultXAxis={defaultXAxis}
				yAxisWidth={31}
				yColor={yColor}
				yLabelFormat={yLabelFormat}
				xLabelFormat={xLabelFormat}
				xAxisContentInset={15}
				tooltipYOffset={-30}
				tooltipSize={{ width: 40, height: 30 }}
				renderTooltip={(step) => (
					<>
						<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
							{moment(step.x).format("HH:mm")}
						</Tag>
						<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
					</>
				)}
				mode={
					modeType === "disabled"
						? createDisabledMode()
						: modeType === "calibration"
						? createCalibrationMode(3)
						: createActiveMode()
				}
			/>
		);
	});
