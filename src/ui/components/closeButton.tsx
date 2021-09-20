import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CloseButtonProps {
	style?: StyleProp<ViewStyle>;
	padding?: number;
	onClose: () => void;
}
export const CloseButton: React.FC<CloseButtonProps> = ({ padding = 16, onClose, style }) => {
	return (
		<Container padding={padding} style={style} onPress={onClose}>
			<Image source={require("@assets/images/close.png")} />
		</Container>
	);
};

const Container = styled.Pressable<{ padding: number }>`
	position: absolute;
	top: 0;
	right: 0;
	padding: ${({ padding }) => `${padding}px ${padding}px ${padding / 2}px ${padding / 2}px`};
`;
