import { ScoreQuality } from "@domain/measure/representation/api";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import * as React from "react";
import { ScoreSection } from "./scoreSection";

export default storiesOf("ScoreSection", module)
	.addDecorator(withKnobs)
	.add("default", () => (
		<ScoreSection
			label="label"
			score={1}
			quality={ScoreQuality.GOOD}
			hasNotEnoughData={boolean("hasNotEnoughData", false)}
			color={colors.red}
		/>
	));
