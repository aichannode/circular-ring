// components/Task.stories.js
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import * as React from "react";
import { ScoreView } from "./ScoreView";

export default storiesOf("ScoreView", module)
	.addDecorator(withKnobs)
	.add("default", () => (
		<ScoreView value={0.9} color={colors.primary} hasNotEnoughData={boolean("hasNotEnoughData", false)} />
	));
