import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface DividerProps {
	style?: StyleProp<ViewStyle>;
	width?: number;
}
export const Divider: React.FC<DividerProps> = ({ width = 150, style }) => {
	return <Container style={style} width={width} />;
};

const Container = styled.View<{ width: number }>`
	width: ${({ width }) => width}px;
	height: 1px;
	background-color: ${colors.gray};
`;
