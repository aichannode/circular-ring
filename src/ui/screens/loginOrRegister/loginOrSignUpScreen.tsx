import { PrimaryBigButton, SecondaryBigButton } from "@ui/components/buttons";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React, { useCallback } from "react";
import styled from "styled-components/native";

export const LoginOrSignUpScreen = () => {
	const { format } = useI18n();

	const { navigate } = useRoutesNavigation();

	const goToSignIn = useCallback(() => {
		navigate(Routes.Login);
	}, []);

	const goToSignUp = useCallback(() => {
		// navigate(Routes.SignUpEmail);
		navigate(Routes.ResetToken, { email: "" });
	}, []);

	return (
		<Container>
			<LogoBig source={require("@assets/images/circularOffcialBig.png")} />
			<ButtonContainer>
				<SignInButton onPress={goToSignIn}>{format("signin_signup.signin")}</SignInButton>
				<SignUpButton onPress={goToSignUp}>{format("signin_signup.signup")}</SignUpButton>
			</ButtonContainer>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	justify-content: center;
	background-color: ${colors.white};
`;

const LogoBig = styled.Image`
	align-self: center;
	margin-bottom: 70px;
`;

const ButtonContainer = styled.View`
	margin: 0 66px;
`;

const SignInButton = styled(PrimaryBigButton)`
	margin-bottom: 20px;
`;

const SignUpButton = styled(SecondaryBigButton)``;
