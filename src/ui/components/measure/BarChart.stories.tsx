// components/Task.stories.js
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";
import { BarChart } from "./barChart";

export default storiesOf("BarChart", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		return (
			<View style={{ height: 300 }}>
				<BarChart
					data={{}}
					style={{
						flex: 1,
					}}
					hasNotEnoughData={boolean("hasNotEnoughData", false)}
				/>
			</View>
		);
	});
