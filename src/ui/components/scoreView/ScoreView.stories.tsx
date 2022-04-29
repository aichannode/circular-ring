// components/Task.stories.js
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import { colors } from "@ui/styles/colors";
import * as React from "react";
import { ScoreView } from "./ScoreView";

export default storiesOf("ScoreView", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<ScoreView
				value={0.9}
				color={colors.primary}
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
