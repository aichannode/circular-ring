import shoes from "@assets/images/shoes.png";
import { select, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { createActiveMode, createCalibrationMode, createDisabledMode } from "@ui/business";
import * as React from "react";
import { DailyMetric } from "./dailyMetric";

export default storiesOf("DailyMetric", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const modeType = select("mode", ["active", "disabled", "calibration"], "active", "mode");
		return (
			<DailyMetric
				icon={shoes}
				label="label"
				value="0.5"
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
