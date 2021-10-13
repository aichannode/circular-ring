import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CalendarTagViewProps {
	selected: boolean;
	onClick: () => void;
	style?: StyleProp<ViewStyle>;
}

export const CalendarTagView: React.FC<CalendarTagViewProps> = ({ selected, onClick, style, children }) => {
	return (
		<Container onPress={onClick} selected={selected} style={style}>
			<TagText selected={selected}>{children}</TagText>
		</Container>
	);
};

const Container = styled.Pressable<{ selected: boolean }>`
	height: 36px;
	border-radius: 18px;
	padding: 0 20px;
	background-color: ${({ selected }) => (selected ? colors.primary : "transparent")};
	border-width: 1px;
	border-color: ${({ selected }) => (selected ? colors.primary : colors.textPrimary)};
	justify-content: center;
	margin-top: 4px;
	margin-bottom: 4px;
`;

const TagText = styled.Text<{ selected: boolean }>`
	color: ${({ selected }) => (selected ? colors.white : colors.textPrimary)};
`;
