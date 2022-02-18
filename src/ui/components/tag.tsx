import { colors } from "@ui/styles/colors";
import React from "react";
import { Text, View } from "react-native";

export function Tag({ children }: { children: string }) {
	return (
		<View
			style={{
				height: 14,
				paddingHorizontal: 5,
				borderRadius: 7.5,
				backgroundColor: colors.orangeRed,
			}}
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
				{children}
			</Text>
		</View>
	);
}
