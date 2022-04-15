import { colors } from "@ui/styles/colors";
import styled from "styled-components/native";

export const Tile = styled.TouchableOpacity`
	flex: 1;
	height: 50px;
	justify-content: center;
	border-right-width: 0.25px;
	border-left-width: 0.25px;
	border-color: ${colors.gray};
	background-color: ${colors.white};
`;
