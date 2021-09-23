import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton, SimpleTextButton } from "@ui/components/buttons";
import { Grow, Row, Stack } from "@ui/components/layout";
import { LogoImageHeader } from "@ui/components/logoImageHeader";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SixDigitInput } from "@ui/components/sixDigitInput";
import { Spinner } from "@ui/components/spinner";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { obfuscateEmail } from "@ui/utils/emailUtils";
import { isCorrectPassword } from "@ui/utils/passwordUtils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";

export const ResetTokenScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const route = useAppRoute<Routes.ResetToken>();
	const { userService } = useServices();

	const { format } = useI18n();

	const email = route.params.email;

	const [resetToken, setResetToken] = useState("");
	const [code, setCode] = useState<readonly string[]>(["", "", "", "", "", ""]);
	useEffect(() => {
		setResetToken(code.join(""));
	}, [code]);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const [errorMessageToken, setErrorMessageToken] = useState<string>();
	const [errorMessagePassword, setErrorMessagePassword] = useState<string>();
	const [resend, setResend] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const resendCode = async () => {
		try {
			setCode(["", "", "", "", "", ""]);
			await userService.resendResetToken(email);
			setResend(true);
		} catch (error) {
			setResend(false);
			setErrorMessageToken(format("login.error.default"));
		}
	};

	const validatePassword = async () => {
		if (email.length > 0 && password.length >= 4) {
			try {
				setLoading(true);
				await userService.newPassword(email, resetToken, password);
				setErrorMessageToken("");
				setErrorMessagePassword("");
				setLoading(false);
				navigation.navigate(Routes.Login);
			} catch ({ code }) {
				setLoading(false);
				if ((code = "CodeMismatchException")) {
					setErrorMessageToken(format("forgot_password.reset.token.error"));
				} else {
					setErrorMessagePassword(format("login.error.default"));
				}
			}
		}
	};

	const checkAndValidatePassword = useCallback(async () => {
		setErrorMessagePassword("");
		if (!isCorrectPassword(password)) {
			setErrorMessagePassword(format("signup.error.password_format"));
		} else if (password !== confirmPassword) {
			setErrorMessagePassword(format("signup.error.password_confirm"));
		} else {
			await validatePassword();
		}
	}, [password, confirmPassword]);

	return (
		<StyledScrollScreen contentContainerStyle={contentStyle}>
			<LogoImageHeader source={require("@assets/images/forgotPasswordZen.jpg")} />
			<Title>{format("forgot_password.reset.title")}</Title>
			{errorMessageToken ? (
				<ErrorMessage>{errorMessageToken}</ErrorMessage>
			) : resend ? (
				<Description>{format("forgot_password.reset.code.resend_description")}</Description>
			) : (
				<Description>{format("forgot_password.reset.code.description", { email: obfuscateEmail(email) })}</Description>
			)}
			<SixDigitInputField codeValue={code} onCodeChanged={setCode} />

			<ResendButton onPress={resendCode}>{format("forgot_password.reset.code.resend_button")}</ResendButton>

			{errorMessagePassword ? <ErrorMessage>{errorMessagePassword}</ErrorMessage> : null}
			<Stack gap={30}>
				<InputField
					title={format("forgot_password.new.password")}
					placeholder={format("forgot_password.reset.password.placeholder")}
					canBeSecure
					value={password}
					onValueChanged={setPassword}
					autoCapitalize={"none"}
					blurOnSubmit={false}
					onSubmit={() => passwordFieldRef.current?.focus()}
				/>
				<InputField
					ref={passwordFieldRef}
					title={format("forgot_password.new.confirm_password")}
					placeholder={format("forgot_password.reset.confirm_password.placeholder")}
					canBeSecure
					value={confirmPassword}
					onValueChanged={setConfirmPassword}
					autoCapitalize={"none"}
					blurOnSubmit={true}
				/>
			</Stack>
			<Grow />
			<ButtonContainer gap={35} justify="center">
				{isLoading ? (
					<Spinner size={24} />
				) : (
					[
						<SecondaryButton key={"back"} onPress={() => navigation.goBack()}>
							{format("global.back")}
						</SecondaryButton>,
						<PrimaryButton key={"validate"} onPress={checkAndValidatePassword}>
							{format("forgot_password.new.button")}
						</PrimaryButton>,
					]
				)}
			</ButtonContainer>
		</StyledScrollScreen>
	);
};

const StyledScrollScreen = styled(ScrollScreen)`
	justify-content: flex-start;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	align-self: center;
	margin-top: 40px;
	margin-bottom: 30px;
`;

const Description = styled.Text`
	${textStyles.primary};
	align-self: center;
	justify-content: center;
	margin-bottom: 40px;
	padding-left: 66px;
	padding-right: 66px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	align-self: center;
	justify-content: center;
	margin-bottom: 40px;
	padding-left: 66px;
	padding-right: 66px;
	text-align: center;
`;

const SixDigitInputField = styled(SixDigitInput)`
	margin-bottom: 30px;
	padding-left: 66px;
	padding-right: 66px;
`;

const InputField = styled(TextField)`
	justify-content: center;
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
`;

const ButtonContainer = styled(Row)`
	margin-top: 57px;
	margin-bottom: 40px;
`;

const ResendButton = styled(SimpleTextButton)`
	align-items: center;
	margin-bottom: 56px;
`;

const contentStyle = {
	paddingVertical: 0,
};
