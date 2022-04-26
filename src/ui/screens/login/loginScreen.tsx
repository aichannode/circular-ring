import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton, SimpleTextButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import styled from "styled-components/native";
import { ErrorMessage } from "../../components/errorMessage";
import { parseEmail } from "../business";

export const LoginScreen = () => {
	const navigation = useRoutesNavigation();
	const { format } = useI18n();
	const { userService, ringApi } = useServices();
	const { navigate } = useRoutesNavigation();

	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [isLoading, setLoading] = useState(false);

	const performLogin = useCallback(async () => {
		if (email.length > 0 && password.length >= 4) {
			Keyboard.dismiss();
			setErrorMessage("");
			setLoading(true);
			try {
				await userService.loginWithEmail(email, password);
			} catch ({ code }) {
				setLoading(false);
				if (code === "NotAuthorizedException") {
					setErrorMessage(format("login.error.invalid_credentials"));
				} else if (code === "UserNotConfirmedException") {
					navigate(Routes.SignUpConfirmationCode);
				} else {
					setErrorMessage(format("login.error.default"));
				}
			}
			await ringApi.getLatestFirmware();
		}
	}, [email, password]);

	const goToSignUp = useCallback(() => {
		navigate(Routes.SignUpEmail);
	}, []);

	return (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 50 }}>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<ResponsiveCenterView>
				<Title>{format("login.title")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
				<InputField
					title={format("login.email.title")}
					placeholder={format("login.email.placeholder")}
					value={email}
					onValueChanged={(state) => setEmail(parseEmail(state))}
					keyboardType={"email-address"}
					autoCapitalize={"none"}
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
					autoCapitalize={"none"}
					blurOnSubmit={true}
				/>
				<ButtonContainer gap={35} justify="center">
					{isLoading ? (
						<Spinner size={24} />
					) : (
						[
							<SecondaryButton key="back-signup" onPress={goToSignUp}>
								{format("login.signup_button")}
							</SecondaryButton>,
							<PrimaryButton key="login" onPress={performLogin}>
								{format("login.login_button")}
							</PrimaryButton>,
						]
					)}
				</ButtonContainer>
				<Grow />
				<ForgotButton
					onPress={() => {
						setErrorMessage("");
						setPassword("");
						navigation.navigate(Routes.ForgotPassword, { email });
					}}
				>
					{format("forgot_password.question")}
				</ForgotButton>
			</ResponsiveCenterView>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-top: 40px;
	margin-bottom: 100px;
	align-self: center;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 30px;
`;

const InputField = styled(TextField)`
	margin-bottom: 40px;
`;

const ButtonContainer = styled(Row)`
	margin-top: 80px;
	margin-bottom: 30px;
`;

const ForgotButton = styled(SimpleTextButton)`
	align-items: center;
	margin-bottom: 20px;
`;
