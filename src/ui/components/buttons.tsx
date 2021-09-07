import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface PrimaryButtonProps {
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
}
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={style}>
			{({ pressed }) => (
				<Content
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0.5 }}
					colors={pressed ? ["#f97444", "#f44a59"] : ["#f44a59", "#f97444"]}
				>
					<ButtonText>{children}</ButtonText>
				</Content>
			)}
		</Pressable>
	);
};

export const SecondaryButton: React.FC<PrimaryButtonProps> = ({ onPress, style, children }) => {
	return (
		<Pressable onPress={onPress} style={[secondaryButton, style]}>
			<SecondaryContent>
				<ButtonTextSecondary>{children}</ButtonTextSecondary>
			</SecondaryContent>
		</Pressable>
	);
};

const ButtonText = styled.Text`
	${textStyles.primary};
	color: ${colors.white};
`;

const ButtonTextSecondary = styled.Text`
	${textStyles.primary};
	color: ${colors.charcoalGrey};
`;

const Content = styled(LinearGradient)`
	padding: 9px 22px;
	border-radius: 18px;
`;

const SecondaryContent = styled.View`
	padding: 9px 22px;
	border-radius: 18px;
	border-width: 1px;
`;

const secondaryButton = {
	backgroundColor: "transparent",
	borderColor: colors.charcoalGrey,
};
