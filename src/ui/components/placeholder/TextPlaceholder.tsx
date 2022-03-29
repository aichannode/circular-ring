import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleProp, Text, TextStyle, View } from "react-native";

interface Props {
	content: string;
	shouldDisableRotation?: boolean;
	style?: StyleProp<TextStyle>;
}

export const TextPlaceholder = ({ content, shouldDisableRotation, style }: Props) => {
	const [rotation, setRotation] = useState(0); // in radians

	function onLayout(event: LayoutChangeEvent) {
		// compute angle based on width and height (tan(angle) = height / width)
		const { width, height } = event.nativeEvent.layout;
		const angle = Math.atan2(height, width);
		setRotation(angle);
	}

	return (
		<View
			onLayout={onLayout}
			style={[
				{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				},
				!shouldDisableRotation && { transform: [{ rotate: `-${rotation}rad` }] },
			]}
		>
			<Text style={[{ fontSize: 24, color: colors.gray, fontWeight: "bold", textTransform: "uppercase" }, style]}>
				{content}
			</Text>
		</View>
	);
};
