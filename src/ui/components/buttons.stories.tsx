import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { Text } from "react-native";
import { PrimaryButton } from "./buttons";

export default storiesOf("Buttons", module).add("default", () => {
	return (
		<PrimaryButton onPress={function () {}}>
			<Text>Hello</Text>
		</PrimaryButton>
	);
});
