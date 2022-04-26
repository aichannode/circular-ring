import { ScoreQuality } from "@domain/measure/representation/api";
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import * as React from "react";
import { ScoreGauge } from "./scoreGauge";

export default storiesOf("ScoreGauge", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<ScoreGauge
				label="label"
				value="value"
				percent={0.5}
				quality={ScoreQuality.GOOD}
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
