import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface CircularButtonProps {
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
	light?: boolean;
}

export const PrimaryButton: React.FC<CircularButtonProps> = ({ onPress, style, light, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<PrimaryContent
					light={light}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? ["#f97444", "#f44a59"] : ["#f44a59", "#f97444"]}
				>
					<PrimaryButtonText light={light}>{children}</PrimaryButtonText>
				</PrimaryContent>
			)}
		</Pressable>
	);
};

export const SecondaryButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<SecondaryContent pressed={pressed}>
					<SecondaryButtonText>{children}</SecondaryButtonText>
				</SecondaryContent>
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
			{({ pressed }) => (
				<SecondaryBigContent pressed={pressed}>
					<GrayButtonText>{children}</GrayButtonText>
				</SecondaryBigContent>
			)}
		</Pressable>
	);
};

export const SimpleTextButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress}>
			<SimpleTextButtonText style={style}>{children}</SimpleTextButtonText>
		</Pressable>
	);
};

const PrimaryButtonText = styled.Text<{ light?: boolean }>`
	${textStyles.primary};
	color: ${colors.white};
	${({ light }) => light && "font-size: 11px"};
`;

const SecondaryButtonText = styled.Text`
	${textStyles.primary};
`;

const PrimaryBigButtonText = styled.Text`
	${textStyles.bigButton};
	color: ${colors.white};
`;

const GrayButtonText = styled.Text`
	${textStyles.primary};
	color: ${colors.textPrimary};
`;

const SimpleTextButtonText = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
`;

const PrimaryContent = styled(LinearGradient)<{ light?: boolean }>`
	padding: ${({ light }) => (light ? "4px 16px" : "9px 22px")};
	border-radius: 18px;
`;

const SecondaryContent = styled.View<{ pressed: boolean }>`
	padding: 9px 22px;
	border-radius: 18px;
	border-color: ${colors.textPrimary};
	border-width: 1px;
`;

const PrimaryBigContent = styled(LinearGradient)`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 56px;
	border-radius: 28px;
`;

const SecondaryBigContent = styled.View<{ pressed: boolean }>`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 56px;
	border-radius: 28px;
	background-color: ${({ pressed }) => (pressed ? colors.gray : colors.lightgray)};
`;
