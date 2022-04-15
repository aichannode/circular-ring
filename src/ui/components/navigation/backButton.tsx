import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ImageSourcePropType, Pressable, ViewProps } from "react-native";

interface BackButtonProps extends ViewProps {
	imageSource?: ImageSourcePropType;
}

export const BackButton: React.FC<BackButtonProps> = ({ imageSource, style }) => {
	const navigation = useNavigation();

	return (
		<Pressable onPress={navigation.goBack} style={[style, { padding: 10, marginLeft: -10 }]}>
			<Image source={imageSource ?? require("@assets/images/menuBackArrow.png")} />
		</Pressable>
	);
};
