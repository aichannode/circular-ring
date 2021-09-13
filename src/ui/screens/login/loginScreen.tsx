import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, Text, TextInput } from "react-native";
import styled from "styled-components/native";

export const LoginScreen = () => {
	const navigation = useRoutesNavigation();
	const { format } = useI18n();
	const { userService } = useServices();

	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const performLogin = useCallback(async () => {
		if (email.length > 0 && password.length >= 4) {
			Keyboard.dismiss();
			setErrorMessage("");
			try {
				await userService.loginWithEmail(email, password);
			} catch (error: any) {
				if (error.statusCode === 401) {
					setErrorMessage(format("login.error.invalid_credentials"));
				} else {
					setErrorMessage(format("login.error.default"));
				}
			}
		}
	}, [email, password]);

	return (
		<ScrollScreen>
			<Logo source={require("../../../assets/images/circularOffcial.png")} />
			<Title>{format("login.title")}</Title>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<InputField
				title={format("login.email.title")}
				placeholder={format("login.email.placeholder")}
				value={email}
				onValueChanged={setEmail}
				keyboardType={"email-address"}
				returnKeyType={"next"}
				blurOnSubmit={false}
				onSubmit={() => passwordFieldRef.current?.focus()}
			/>
			<InputField
				ref={passwordFieldRef}
				title={format("login.password.title")}
				placeholder={format("login.password.placeholder")}
				canBeSecure
				value={password}
				onValueChanged={setPassword}
				blurOnSubmit={true}
			/>
			<ButtonContainer>
				<SecondaryButton onPress={() => console.log("click on sign up btn")}>
					{format("signin_signup.signup")}
				</SecondaryButton>
				<PrimaryButton onPress={performLogin}>{format("login.login_button")}</PrimaryButton>
			</ButtonContainer>
			<ForgotButton onPress={() => navigation.navigate(Routes.ForgotPassword, { email })}>
				<Text>{format("forgot_password.question")}</Text>
			</ForgotButton>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-top: 70px;
	margin-bottom: 70px;
	align-self: center;
`;

const Title = styled.Text`
	${textStyles.titleMedium};
	margin-bottom: 30px;
	align-self: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 20px;
	text-align: center;
	align-self: center;
`;

const InputField = styled(TextField)`
	margin-bottom: 40px;
`;

const ButtonContainer = styled.View`
	flex-direction: row;
	justify-content: space-around;
	margin-top: 80px;
	margin-bottom: 40px;
	margin-horizontal: 10px;
`;

const ForgotButton = styled.TouchableOpacity`
	background-color: transparent;
	align-items: center;
`;
