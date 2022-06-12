import { colors } from "@ui/styles/colors";
import styled from "styled-components/native";

export const GraphContainer = styled.View`
	background-color: ${colors.white};
	border-radius: 5px;
	shadow-color: ${colors.black};
	shadow-offset: 0 10px;
	shadow-opacity: 0.15;
	shadow-radius: 10px;
	elevation: 10;
	overflow: hidden;
	padding: 15px;
`;
