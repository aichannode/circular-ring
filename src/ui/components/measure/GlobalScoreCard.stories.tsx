// components/Task.stories.js
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { GlobalScoreCard } from "./globalScoreCard";

export default storiesOf("GlobalScoreCard", module)
	.addDecorator(withKnobs)
	.add("default", () => <GlobalScoreCard score={0.9} hasNotEnoughData={boolean("hasNotEnoughData", false)} />);
