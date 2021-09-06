import { useServices } from "@core/services";
import { PrimaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import styled from "styled-components/native";

export const LoginScreen = () => {
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
			} catch (error) {
				console.log("ERROR : " + error);
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
			<Title>{format("login.title")}</Title>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<InputField
				title={format("login.email.title")}
				placeholder={format("login.email.placeholder")}
				value={email}
				onValueChanged={setEmail}
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
				<PrimaryButton onPress={performLogin}>{format("login.login_button")}</PrimaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.titleMedium};
	margin-top: 100px;
	margin-bottom: 30px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 20px;
	text-align: center;
`;

const InputField = styled(TextField)`
	margin-bottom: 40px;
`;

const ButtonContainer = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 80px;
	margin-bottom: 40px;
`;
