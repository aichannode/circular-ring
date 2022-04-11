import { colors } from "@ui/styles/colors";
import { capitalize } from "@ui/utils/stringUtils";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

export function Tag({ children, containerStyle }: { children: string; containerStyle?: StyleProp<ViewStyle> }) {
	return (
		<View
			style={[
				{
					height: 14,
					paddingHorizontal: 5,
					borderRadius: 7.5,
					backgroundColor: colors.orangeRed,
				},
				containerStyle,
			]}
		>
			<Text
				style={{
					textAlign: "center",
					fontSize: 9,
					fontWeight: "bold",
					fontStyle: "normal",
					letterSpacing: 0,
					color: colors.white,
				}}
			>
				{capitalize(children)}
			</Text>
		</View>
	);
}
