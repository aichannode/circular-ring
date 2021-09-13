import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton, SimpleTextButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SixDigitInput } from "@ui/components/sixDigitInput";
import { Spinner } from "@ui/components/spinner";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { obfuscateEmail } from "@ui/utils/emailUtils";
import { isCorrectPassword } from "@ui/utils/passwordUtils";
import React, { useCallback, useRef, useState } from "react";
import { Text, TextInput } from "react-native";
import styled from "styled-components/native";

export const ResetTokenScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const route = useAppRoute<Routes.ResetToken>();
	const { userService } = useServices();

	const { format } = useI18n();

	const email = route.params.email;

	const [resetToken, setResetToken] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const [errorMessageToken, setErrorMessageToken] = useState<string>();
	const [errorMessagePassword, setErrorMessagePassword] = useState<string>();
	const [resend, setResend] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const resendCode = async () => {
		try {
			await userService.resendResetToken(email);
			setResend(true);
		} catch (error) {
			setResend(false);
			setErrorMessageToken("login.error.default");
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
		<ScrollScreen contentContainerStyle={contentStyle}>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/forgotPasswordZen.jpg")} />
			<Title>{format("forgot_password.reset.title")}</Title>
			{errorMessageToken ? (
				<ErrorMessage>{errorMessageToken}</ErrorMessage>
			) : resend ? (
				<Description>{format("forgot_password.reset.code.resend_description")}</Description>
			) : (
				<Description>{format("forgot_password.reset.code.description", { email: obfuscateEmail(email) })}</Description>
			)}
			<SixDigitInputField
				onSubmit={(code) => {
					setResetToken(code);
				}}
			/>

			<Separator />

			{errorMessagePassword ? <ErrorMessage>{errorMessagePassword}</ErrorMessage> : null}
			<InputField
				title={format("forgot_password.new.password")}
				placeholder={format("forgot_password.reset.password.placeholder")}
				canBeSecure
				value={password}
				onValueChanged={setPassword}
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
				blurOnSubmit={true}
			/>
			<ButtonContainer centerElements={false}>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<>
						<SecondaryButton onPress={() => navigation.goBack()}>{format("global.back")}</SecondaryButton>
						<PrimaryButton
							onPress={() => {
								checkAndValidatePassword();
							}}
						>
							{format("forgot_password.new.button")}
						</PrimaryButton>
					</>
				)}
			</ButtonContainer>

			<ResendButton onPress={resendCode}>{format("forgot_password.reset.code.resend_button")}</ResendButton>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-top: 70px;
	margin-bottom: 70px;
	align-self: center;
`;

const HeaderImage = styled.Image`
	width: 100%;
	flex-grow: 1;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	flex-grow: 1;
	align-self: center;
	margin-top: 60px;
	margin-bottom: 20px;
`;

const Separator = styled(Divider)`
	flex-grow: 1;
	align-self: center;
	margin-bottom: 20px;
`;

const Description = styled.Text`
	${textStyles.primary};
	flex-grow: 1;
	align-self: center;
	justify-content: center;
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	flex-grow: 1;
	align-self: center;
	justify-content: center;
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
	text-align: center;
`;

const SixDigitInputField = styled(SixDigitInput)`
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
`;

const InputField = styled(TextField)`
	flex-grow: 1;
	justify-content: center;
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
`;

const ButtonContainer = styled.View<{ centerElements: boolean }>`
	width: 100%;
	flex-direction: row;
	justify-content: ${({ centerElements }) => (centerElements ? "center" : "space-between")};
	padding: 40px 66px;
	align-items: center;
`;

const ResendButton = styled(SimpleTextButton)`
	align-items: center;
	margin-bottom: 20px;
`;

const contentStyle = {
	flexGrow: 1,
	paddingLeft: 0,
	paddingRight: 0,
};
