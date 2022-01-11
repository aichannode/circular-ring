import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface OrangeDiagonalGradienProps {
	style?: StyleProp<ViewStyle>;
}
export const OrangeDiagonalGradient: React.FC<OrangeDiagonalGradienProps> = ({ style, children }) => {
	return (
		<LinearGradient
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0 }}
			colors={colors.gradient.orange.slice(0)}
			style={style}
		>
			{children}
		</LinearGradient>
	);
};
