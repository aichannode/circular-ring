import { PrimaryBigButton, SecondaryBigButton } from "@ui/components/buttons";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React, { useCallback } from "react";
import styled from "styled-components/native";

export const LoginOrRegisterScreen = () => {
	const { format } = useI18n();

	const { navigate } = useRoutesNavigation();

	const goToSignIn = useCallback(() => {
		navigate(Routes.Login);
	}, []);

	const goToSignUp = useCallback(() => {
		// TODO
	}, []);

	return (
		<Container>
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
`;

const ButtonContainer = styled.View`
	margin: 0 66px;
`;

const SignInButton = styled(PrimaryBigButton)`
	margin-bottom: 20px;
`;

const SignUpButton = styled(SecondaryBigButton)``;
