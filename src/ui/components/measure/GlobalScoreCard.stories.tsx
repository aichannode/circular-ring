// components/Task.stories.js
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import * as React from "react";
import { GlobalScoreCard } from "./globalScoreCard";

export default storiesOf("GlobalScoreCard", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");

		return (
			<GlobalScoreCard
				score={0.9}
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
