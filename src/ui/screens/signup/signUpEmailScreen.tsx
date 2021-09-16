import { useLogger } from "@core/logger/hooks/useLogger";
import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { isEmail } from "@ui/utils/emailUtils";
import { isCorrectPassword } from "@ui/utils/passwordUtils";
import { openURL } from "@ui/utils/urlUtils";
import React, { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";

export const SignUpEmailScreen = () => {
	const logger = useLogger("SignUpEmailScreen");
	const { format } = useI18n();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmPasswordFieldRef = useRef<TextInput | null>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [isLoading, setLoading] = useState(false);

	const goToLoginScreen = useCallback(() => {
		navigate(Routes.Login);
	}, []);

	const performSignUp = useCallback(async (email: string, password: string) => {
		setLoading(true);
		try {
			await userService.signUpWithEmail(email, password);
			setLoading(false);
			navigate(Routes.SignUpConfirmationCode);
		} catch (error) {
			logger.warn("Error : " + JSON.stringify(error));
			setLoading(false);
			setErrorMessage(format("signup.error.default"));
		}
	}, []);

	const checkAndSignUp = useCallback(async () => {
		setErrorMessage("");
		if (email.length === 0 || password.length === 0) {
			setErrorMessage(format("signup.error.empty_field"));
		} else if (!isEmail(email)) {
			setErrorMessage(format("signup.error.email_format"));
		} else if (!isCorrectPassword(password)) {
			setErrorMessage(format("signup.error.password_format"));
		} else if (password !== confirmPassword) {
			setErrorMessage(format("signup.error.password_confirm"));
		} else {
			await performSignUp(email, password);
		}
	}, [email, password, confirmPassword]);

	return (
		<ScrollScreen>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<ResponsiveCenterView>
				<Title>{format("signup.title")}</Title>
				{errorMessage.length > 0 ? (
					<ErrorMessage>{errorMessage}</ErrorMessage>
				) : (
					<Subtitle>{format("signup.subtitle")}</Subtitle>
				)}
				<Stack gap={40}>
					<TextField
						key={"email"}
						title={format("signup.email.title")}
						placeholder={format("signup.email.placeholder")}
						value={email}
						onValueChanged={setEmail}
						keyboardType={"email-address"}
						returnKeyType={"next"}
						blurOnSubmit={false}
						onSubmit={() => passwordFieldRef.current?.focus()}
					/>
					<TextField
						key={"password"}
						ref={passwordFieldRef}
						title={format("signup.password.title")}
						placeholder={format("signup.password.placeholder")}
						canBeSecure
						value={password}
						onValueChanged={setPassword}
						returnKeyType={"next"}
						blurOnSubmit={false}
						onSubmit={() => confirmPasswordFieldRef.current?.focus()}
					/>
					<TextField
						key={"confirm"}
						ref={confirmPasswordFieldRef}
						title={format("signup.confirm_password.title")}
						placeholder={format("signup.confirm_password.placeholder")}
						canBeSecure
						value={confirmPassword}
						onValueChanged={setConfirmPassword}
						blurOnSubmit={true}
					/>
				</Stack>
			</ResponsiveCenterView>
			<ButtonContainer gap={35} justify="center">
				{isLoading ? (
					<Spinner size={24} />
				) : (
					[
						<SecondaryButton key="back-login" onPress={goToLoginScreen}>
							{format("signup.button.login")}
						</SecondaryButton>,
						<PrimaryButton key="signup" onPress={checkAndSignUp}>
							{format("signup.button.confirm")}
						</PrimaryButton>,
					]
				)}
			</ButtonContainer>
			<ResponsiveCenterView>
				<TermsAndConditions>
					{format("signup.terms.link_prefix")}
					<TermsLink
						onPress={() => {
							openURL("https://www.circular.xyz/en/terms-of-use");
						}}
					>
						{" "}
						{format("signup.terms.link")}
					</TermsLink>
				</TermsAndConditions>
			</ResponsiveCenterView>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-top: 40px;
	margin-bottom: 64px;
	align-self: center;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 14px;
`;

const Subtitle = styled.Text`
	${textStyles.subtitle};
	margin-bottom: 35px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 35px;
	text-align: center;
`;

const ButtonContainer = styled(Row)`
	margin-top: 40px;
	margin-bottom: 40px;
`;

const TermsAndConditions = styled.Text`
	${textStyles.secondary};
	color: ${colors.textPrimary};
	text-align: center;
`;

const TermsLink = styled(TermsAndConditions)`
	color: ${colors.primary};
`;
