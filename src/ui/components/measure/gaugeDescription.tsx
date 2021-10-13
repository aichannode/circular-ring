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
	colorType: "Activity" | "Sleep";
}
export const GaugeDescription: React.FC<GaugeDescriptionProps> = ({
	label,
	description,
	style,
	onClose,
	colorType,
}) => {
	return (
		<Container
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0.5 }}
			colors={colorType === "Activity" ? ["#e00a0a", "#f53949"] : ["#2932ee", "#3960f7"]}
			style={style}
		>
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
	margin-bottom: 10px;
`;

const Description = styled(SecondaryText)`
	color: ${colors.white};
`;

const Close = styled.Pressable`
	position: absolute;
	top: 20px;
	right: 20px;
`;
