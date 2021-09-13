import { SecondaryText, TitleText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface GaugeDescriptionProps {
	label: string;
	description: string;
	onClose: () => void;
	style?: StyleProp<ViewStyle>;
}
export const GaugeDescription: React.FC<GaugeDescriptionProps> = ({ label, description, style, onClose }) => {
	return (
		<Container start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.5 }} colors={["#e00a0a", "#f53949"]} style={style}>
			<Label>{label}</Label>
			<Description>{description}</Description>
			<Close onPress={onClose}>
				<Image source={require("@assets/images/close.png")} />
			</Close>
		</Container>
	);
};

const Container = styled(LinearGradient)`
	padding: 20px;
	border-radius: 10px;
`;

const Label = styled(TitleText)`
	color: ${colors.white};
	margin-right: 60px;
`;

const Description = styled(SecondaryText)`
	color: ${colors.white};
`;

const Close = styled.Pressable`
	position: absolute;
	top: 20px;
	right: 20px;
`;
