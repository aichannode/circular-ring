import React from "react";
import { Image } from "react-native";
import { colors } from "@ui/styles/colors";
import { ScrollScreen } from "@ui/components/scrollScreen";
import styled from "styled-components/native";

export const ForgotPasswordScreen: React.FC = () => {
	return (
		<ScrollScreen>
			<Container>
				<HeaderImage source={require("@assets/images/forgotPasswordZen.png")} />
			</Container>
		</ScrollScreen>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 50px;
	background-color: ${colors.white};
`;

const HeaderImage = styled.Image`
	flex: 1;
`;
