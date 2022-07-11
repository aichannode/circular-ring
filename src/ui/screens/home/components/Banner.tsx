import { CloseButton } from "@ui/components/closeButton";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { ImageSourcePropType, Pressable, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

interface BannerProps {
	img: ImageSourcePropType;
	title: WordingKey;
	description: WordingKey;
	onPress: () => void;
	onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ img, title, description, onPress, onClose }) => {
	const [isPressed, setIsPressed] = useState(false);
	const [isDisplayed, setIsDisplayed] = useState(true);
	const { format } = useI18n();

	const disable = () => setIsDisplayed(false);

	if (!isDisplayed) return <View />;

	return (
		<Pressable
			onPress={onPress}
			onPressIn={function () {
				setIsPressed(true);
			}}
			onPressOut={function () {
				setIsPressed(false);
			}}
		>
			<Gradient
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0.5 }}
				colors={isPressed ? [...colors.gradient.orange].reverse() : [...colors.gradient.orange]}
			>
				<Icon source={img} />
				<ContainerText>
					<Title>{format(title)}</Title>
					<Description>{format(description)}</Description>
				</ContainerText>
			</Gradient>
			<CloseBtn onClose={onClose ? onClose : disable} />
		</Pressable>
	);
};

const Gradient = styled(LinearGradient)`
	display: flex;
	flex-direction: row;
	padding-horizontal: 20px;
	padding-vertical: 25px;
	margin-vertical: 10px;
	margin-horizontal: 8px;
	border-radius: 2px;
`;

const ContainerText = styled.View`
	margin-left: 20px;
	margin-right: 50px;
`;

const Icon = styled.Image`
	resize-mode: contain;
	height: 65px;
`;

const Title = styled(SecondaryText)`
	font-weight: 500;
	margin-bottom: 10px;
	color: white;
`;

const Description = styled(SecondaryText)`
	color: white;
`;

const CloseBtn = styled(CloseButton)`
	top: 16px;
	right: 16px;
	tint-color: white;
`;
