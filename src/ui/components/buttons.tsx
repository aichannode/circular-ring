import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface PrimaryButtonProps {
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
	light?: boolean;
}
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, style, light, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<Content
					light={light}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? ["#f97444", "#f44a59"] : ["#f44a59", "#f97444"]}
				>
					<ButtonText light={light}>{children}</ButtonText>
				</Content>
			)}
		</Pressable>
	);
};

const ButtonText = styled.Text<{ light?: boolean }>`
	${textStyles.primary};
	color: ${colors.white};
	${({ light }) => light && "font-size: 11px"};
`;

const Content = styled(LinearGradient)<{ light?: boolean }>`
	padding: ${({ light }) => (light ? "4px 16px" : "9px 22px")};
	border-radius: 18px;
`;
