import shoes from "@assets/images/shoes.png";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { DailyMetric } from "./dailyMetric";

export default storiesOf("DailyMetric", module)
	.addDecorator(withKnobs)
	.add("default", () => (
		<DailyMetric icon={shoes} label="label" value="0.5" hasNotEnoughData={boolean("hasNotEnoughData", false)} />
	));
