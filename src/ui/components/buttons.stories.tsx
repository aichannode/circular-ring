import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { Text } from "react-native";
import { PrimaryButton } from "./buttons";
import { useI18n } from "@ui/i18n";

export default storiesOf("Buttons", module).add("default", () => {
	const { format } = useI18n();

	return (
		<PrimaryButton onPress={function () {}}>
			<Text>{format("header.storybook")}</Text>
		</PrimaryButton>
	);
});
