import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, Text, TextStyle, View } from "react-native";

interface Props {
	content: string;
	shouldDisableRotation?: boolean;
	style?: StyleProp<TextStyle>;
}

export const TextPlaceholder = ({ content, shouldDisableRotation, style }: Props) => {
	// not sure if it don't brake somewhere else

	// const [rotation, setRotation] = useState(0.45); // in radians

	// function onLayout(event: LayoutChangeEvent) {
	// 	// compute angle based on width and height (tan(angle) = height / width)
	// 	const { width, height } = event.nativeEvent.layout;
	// 	const angle = Math.atan2(height, width);
	// 	// setRotation(angle);
	// }

	return (
		<View
			// onLayout={onLayout}
			style={[
				{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				},
				!shouldDisableRotation && { transform: [{ rotate: `-${0.45}rad` }] },
			]}
		>
			<Text style={[{ fontSize: 24, color: colors.gray, fontWeight: "bold", textTransform: "uppercase" }, style]}>
				{content}
			</Text>
		</View>
	);
};
