import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import styled from "styled-components/native";

export const PrimaryText = styled.Text`
	${textStyles.primary};
`;
export const SecondaryText = styled.Text`
	${textStyles.secondary};
`;
export const TitleText = styled.Text`
	${textStyles.title};
`;
export const Strong = styled.Text`
	font-weight: bold;
	color: ${colors.primary};
`;
export const Colored = styled.Text`
	color: ${colors.primary};
`;
