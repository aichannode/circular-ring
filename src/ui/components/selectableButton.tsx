import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface SelectableButtonProps {
	selected: boolean;
	onSelected: () => void;
	bgColor: string;
	style?: StyleProp<ViewStyle>;
}

export const SelectableButton: React.FC<SelectableButtonProps> = ({
	selected,
	onSelected,
	bgColor,
	style,
	children,
}) => {
	return (
		<Pressable onPress={selected ? null : onSelected} style={style}>
			{({ pressed }) => (
				<TertiaryBorder
					colors={
						pressed
							? [colors.orangeGradientEnd, colors.orangeGradientStart]
							: [colors.orangeGradientStart, colors.orangeGradientEnd]
					}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
				>
					<TertiaryInner bgColor={bgColor} selected={selected}>
						<TertiaryButtonText selected={selected}>{children}</TertiaryButtonText>
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

const TertiaryButtonText = styled.Text<{ selected: boolean }>`
	${textStyles.primary};
	color: ${({ selected }) => (selected ? colors.white : colors.red)};
`;
