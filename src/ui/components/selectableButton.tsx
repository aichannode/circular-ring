import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface SelectableButtonProps {
	selected: boolean;
	onPress: () => void;
	bgColor: string;
	isDisabled?: boolean;
	colors?: Readonly<[string, string]>
	style?: StyleProp<ViewStyle>;
}

export const SelectableButton: React.FC<SelectableButtonProps> = ({
	selected,
	colors: palette = ["#000", "#fff"],
	onPress,
	bgColor,
	style,
	children,
	isDisabled
}) => {
	const gradient = isDisabled ? [colors.disabled, colors.disabled] : palette
	const textColor = gradient[0]
	return (
		<Pressable onPress={onPress} style={style}>
			{({pressed}) => (
			<TertiaryBorder
				colors={
					pressed
						? gradient.slice(0).reverse()
						: gradient.slice(0)
				}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0.5 }}
			>
				<TertiaryInner bgColor={bgColor} selected={selected}>
					<TertiaryButtonText color={textColor} selected={selected}>{children}</TertiaryButtonText>
				</TertiaryInner>
				</TertiaryBorder>
			)}
		</Pressable>
	);
};

const TertiaryBorder = styled(LinearGradient)<{ light?: boolean }>`
	padding: 1px;
	border-radius: 19px;
`;

const TertiaryInner = styled.View<{ bgColor: string; selected: boolean }>`
	padding: 9px 22px;
	border-radius: 18px;
	background-color: ${({ bgColor, selected }) => (selected ? "transparent" : bgColor)};
`;

const TertiaryButtonText = styled.Text<{ selected: boolean, color: string }>`
	${textStyles.primary};
	color: ${({ selected, color }) => (selected ? colors.white : color)};
`;
