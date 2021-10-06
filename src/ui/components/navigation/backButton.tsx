import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, ViewProps } from "react-native";

export const BackButton = (props: ViewProps) => {
	const navigation = useNavigation();

	return (
		<Pressable onPress={navigation.goBack} style={props.style}>
			<Image source={require("@assets/images/menuBackArrow.png")} />
		</Pressable>
	);
};
