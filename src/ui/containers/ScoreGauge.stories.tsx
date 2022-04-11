import { ScoreQuality } from "@domain/measure/representation/api";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { ScoreGauge } from "./scoreGauge";

export default storiesOf("ScoreGauge", module)
	.addDecorator(withKnobs)
	.add("default", () => (
		<ScoreGauge
			label="label"
			value="value"
			percent={0.5}
			quality={ScoreQuality.GOOD}
			hasNotEnoughData={boolean("hasNotEnoughData", false)}
		/>
	));
