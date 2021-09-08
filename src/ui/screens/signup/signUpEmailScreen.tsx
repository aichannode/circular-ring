import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { isEmail } from "@ui/utils/emailUtils";
import { isCorrectPassword } from "@ui/utils/passwordUtils";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, TextInput } from "react-native";
import styled from "styled-components/native";

export const SignUpEmailScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmPasswordFieldRef = useRef<TextInput | null>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const performSignUp = useCallback(() => {
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
			navigate(Routes.SignUpPersonalInfo, {
				signUpData: { email, password, country: "", timezone: "", firstName: "", lastName: "" },
			});
		}
	}, [email, password, confirmPassword]);

	return (
		<ScrollScreen>
			<Logo source={require("../../../assets/images/circularOffcial.png")} />
			<Title>{format("signup.title")}</Title>
			{errorMessage.length > 0 ? (
				<ErrorMessage>{errorMessage}</ErrorMessage>
			) : (
				<Subtitle>{format("signup.subtitle")}</Subtitle>
			)}
			<InputField
				title={format("signup.email.title")}
				placeholder={format("signup.email.placeholder")}
				value={email}
				onValueChanged={setEmail}
				keyboardType={"email-address"}
				returnKeyType={"next"}
				blurOnSubmit={false}
				onSubmit={() => passwordFieldRef.current?.focus()}
			/>
			<InputField
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
			<InputField
				ref={confirmPasswordFieldRef}
				title={format("signup.confirm_password.title")}
				placeholder={format("signup.confirm_password.placeholder")}
				canBeSecure
				value={confirmPassword}
				onValueChanged={setConfirmPassword}
				blurOnSubmit={true}
			/>
			<ButtonContainer>
				<LoginButton onPress={performSignUp}>{format("signup.button.login")}</LoginButton>
				<ConfirmButton onPress={performSignUp}>{format("signup.button.confirm")}</ConfirmButton>
			</ButtonContainer>
			<TermsAndConditions>
				{format("signup.terms.link_prefix")}
				<Pressable
					onPress={() => {
						// TODO
						// openURL("")
					}}
				>
					<TermsLink>{format("signup.terms.link")}</TermsLink>
				</Pressable>
			</TermsAndConditions>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-top: 70px;
	margin-bottom: 50px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 14px;
`;

const Subtitle = styled.Text`
	${textStyles.subtitle};
	margin-bottom: 20px;
	text-align: center;
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
	margin-top: 20px;
	margin-bottom: 25px;
`;

const LoginButton = styled(SecondaryButton)`
	margin-right: 12px;
`;

const ConfirmButton = styled(PrimaryButton)`
	margin-left: 12px;
`;

const TermsAndConditions = styled.Text`
	${textStyles.secondary};
	color: ${colors.textPrimary};
	text-align: center;
`;

const TermsLink = styled(TermsAndConditions)`
	color: ${colors.primary};
	margin-bottom: 20px;
`;
