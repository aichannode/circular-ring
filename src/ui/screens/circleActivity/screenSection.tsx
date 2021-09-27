import { TitleText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface ScreenSectionProps {
	style?: StyleProp<ViewStyle>;
	title?: string;
}
export const ScreenSection: React.FC<ScreenSectionProps> = ({ title, style, children }) => {
	return (
		<Container style={style}>
			{title ? <TitleText>{title}</TitleText> : null}
			{children}
		</Container>
	);
};

const Container = styled.View`
	background-color: ${colors.white};
	padding: 25px 20px;
`;
