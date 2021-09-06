import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface CircularButtonProps {
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
}

export const PrimaryButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<PrimaryContent
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? ["#f97444", "#f44a59"] : ["#f44a59", "#f97444"]}
				>
					<PrimaryButtonText>{children}</PrimaryButtonText>
				</PrimaryContent>
			)}
		</Pressable>
	);
};

export const PrimaryBigButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<PrimaryBigContent
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? ["#f97444", "#f44a59"] : ["#f44a59", "#f97444"]}
				>
					<PrimaryBigButtonText>{children}</PrimaryBigButtonText>
				</PrimaryBigContent>
			)}
		</Pressable>
	);
};

export const SecondaryBigButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			<SecondaryBigContent>
				<GrayButtonText>{children}</GrayButtonText>
			</SecondaryBigContent>
		</Pressable>
	);
};

const PrimaryButtonText = styled.Text`
	${textStyles.primary};
	color: ${colors.white};
`;

const PrimaryBigButtonText = styled.Text`
	${textStyles.bigButton};
	color: ${colors.white};
`;

const GrayButtonText = styled.Text`
	${textStyles.primary};
	color: ${colors.textPrimary};
`;

const PrimaryContent = styled(LinearGradient)`
	padding: 9px 22px;
	border-radius: 18px;
`;

const PrimaryBigContent = styled(LinearGradient)`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 56px;
	border-radius: 28px;
`;

const SecondaryBigContent = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 56px;
	border-radius: 28px;
	background-color: ${colors.lightGray};
`;
