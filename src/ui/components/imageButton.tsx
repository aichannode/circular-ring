import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface ImageButtonProps {
	source: ImageSourcePropType;
	onPress: () => void;
}

export const ImageButton: React.FC<ImageButtonProps> = ({ source, onPress }) => {
	return (
		<Container onPress={onPress}>
			<Image source={source} />
		</Container>
	);
};

const Container = styled.Pressable`
	width: 33px;
	height: 33px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.white};
	border-radius: 4px;
	shadow-color: #000000;
	shadow-offset: 0 10px;
	shadow-opacity: 0.1;
	shadow-radius: 18px;
	elevation: 10;
`;
