import styled from "styled-components/native";
import { colors } from "@ui/styles/colors";

export const GraphContainer = styled.View`
	background-color: ${colors.white};
	padding: 20px;
	border-radius: 5px;
	shadow-color: #000;
	shadow-offset: {
	width: 0,
	height: 2,
	};
	shadow-opacity: 0.25;
	shadow-radius: 3.84;
	elevation: 5;
`;
