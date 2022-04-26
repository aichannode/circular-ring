import { ScoreQuality } from "@domain/measure/representation/api";
import { select } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import { colors } from "@ui/styles/colors";
import * as React from "react";
import { ScoreSection } from "./scoreSection";

export default storiesOf("ScoreSection", module).add("default", () => {
	const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
	return (
		<ScoreSection
			label="label"
			score={1}
			quality={ScoreQuality.GOOD}
			mode={
				modeType === "disabled"
					? createDisabledMode()
					: modeType === "calibration"
					? createCalibrationMode(3)
					: createActiveMode()
			}
			color={colors.red}
		/>
	);
});
