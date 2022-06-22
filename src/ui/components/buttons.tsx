import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { TouchableOpacity as BottomSheetTouchableOpacity, TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface CircularButtonProps {
	style?: StyleProp<ViewStyle>;
	contentStyle?: StyleProp<ViewStyle>;
	useOnBottomSheet?: boolean;
	onPress: () => void;
	light?: boolean;
	disabled?: boolean;
}

export const PrimaryButton: React.FC<CircularButtonProps> = ({
	onPress,
	style,
	contentStyle,
	useOnBottomSheet,
	light,
	disabled,
	children,
}) => {
	const [isPressed, setIsPressed] = useState(false);

	const content = (
		<PrimaryContent
			style={contentStyle}
			light={light}
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0.5 }}
			colors={
				disabled
					? [colors.lightgray, colors.lightgray]
					: isPressed
					? [...colors.gradient.orange].reverse()
					: [...colors.gradient.orange]
			}
		>
			<PrimaryButtonText light={light}>{children}</PrimaryButtonText>
		</PrimaryContent>
	);

	return useOnBottomSheet ? (
		<BottomSheetTouchableOpacity
			activeOpacity={1}
			onPress={onPress}
			onPressIn={function () {
				setIsPressed(true);
			}}
			onPressOut={function () {
				setIsPressed(false);
			}}
			style={style}
		>
			{content}
		</BottomSheetTouchableOpacity>
	) : (
		<Pressable
			onPress={onPress}
			style={style}
			onPressIn={function () {
				setIsPressed(true);
			}}
			onPressOut={function () {
				setIsPressed(false);
			}}
		>
			{content}
		</Pressable>
	);
};

export const SecondaryButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<SecondaryContent style={style}>
				<SecondaryButtonText>{children}</SecondaryButtonText>
			</SecondaryContent>
		</TouchableOpacity>
	);
};
interface TertiaryButtonProps extends CircularButtonProps {
	containerBackgroundColor: string;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
	onPress,
	style,
	useOnBottomSheet,
	children,
	containerBackgroundColor,
}) => {
	const [isPressed, setIsPressed] = useState(false);

	const content = (
		<TertiaryBorder
			colors={isPressed ? [...colors.gradient.orange].reverse() : [...colors.gradient.orange]}
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0.5 }}
		>
			<TertiaryInner bgColor={containerBackgroundColor}>
				<TertiaryButtonText>{children}</TertiaryButtonText>
			</TertiaryInner>
		</TertiaryBorder>
	);

	return useOnBottomSheet ? (
		<BottomSheetTouchableOpacity
			activeOpacity={1}
			onPress={onPress}
			onPressIn={function () {
				setIsPressed(true);
			}}
			onPressOut={function () {
				setIsPressed(false);
			}}
			style={style}
		>
			{content}
		</BottomSheetTouchableOpacity>
	) : (
		<Pressable
			onPress={onPress}
			style={style}
			onPressIn={function () {
				setIsPressed(true);
			}}
			onPressOut={function () {
				setIsPressed(false);
			}}
		>
			{content}
		</Pressable>
	);
};

export const QuadraryButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={style}>
				<QuadraryContent>
					<PrimaryButtonText>{children}</PrimaryButtonText>
				</QuadraryContent>
			</View>
		</TouchableOpacity>
	);
};

export const PrimaryBigButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<PrimaryBigContent
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? [...colors.gradient.orange].reverse() : [...colors.gradient.orange]}
				>
					<PrimaryBigButtonText>{children}</PrimaryBigButtonText>
				</PrimaryBigContent>
			)}
		</Pressable>
	);
};

export const SecondaryBigButton: React.FC<CircularButtonProps> = ({ onPress, style, children }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<SecondaryBigContent style={style}>
				<GrayButtonText>{children}</GrayButtonText>
			</SecondaryBigContent>
		</TouchableOpacity>
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
	text-align: center;
`;

const SecondaryButtonText = styled.Text`
	${textStyles.primary};
	text-align: center;
`;

const TertiaryButtonText = styled.Text`
	${textStyles.primary};
	color: ${colors.orangeRed};
`;

const PrimaryBigButtonText = styled.Text`
	${textStyles.bigButton};
	color: ${colors.white};
	text-align: center;
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

const SecondaryContent = styled.View`
	padding: 7px 22px;
	border-radius: 18px;
	border-color: ${colors.textPrimary};
	border-width: 1px;
`;

const QuadraryContent = styled.View`
	padding: 9px 22px;
	border-radius: 18px;
	background-color: ${colors.blue};
`;

const TertiaryBorder = styled(LinearGradient)<{ light?: boolean }>`
	padding: 1px;
	border-radius: 19px;
`;

const TertiaryInner = styled.View<{ bgColor: string }>`
	padding: 9px 22px;
	border-radius: 18px;
	background-color: ${({ bgColor }) => bgColor};
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
	background-color: ${colors.lightgray};
`;
