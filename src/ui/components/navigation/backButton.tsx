import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable } from "react-native";

export const BackButton = () => {
	const navigation = useNavigation();

	return (
		<Pressable onPress={navigation.goBack}>
			<Image source={require("@assets/images/menuBackArrow.png")} />
		</Pressable>
	);
};
