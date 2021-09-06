import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, TextInput } from "react-native";
import styled from "styled-components/native";

export const SignUpScreen = () => {
	const { format } = useI18n();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);
	const [confirmPassword, setConfirmPassword] = useState("");
	const confirmPasswordFieldRef = useRef<TextInput | null>(null);

	// const [errorMessage, setErrorMessage] = useState<string>("");

	const performSignUp = useCallback(() => {
		// TODO
	}, [email, password, confirmPassword]);

	return (
		<ScrollScreen>
			<Title>{format("signup.title")}</Title>
			<Subtitle>{format("signup.subtitle")}</Subtitle>
			{/*<ErrorMessage>{errorMessage}</ErrorMessage>*/}
			<InputField
				title={format("signup.email.title")}
				placeholder={format("signup.email.placeholder")}
				value={email}
				onValueChanged={setEmail}
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

const Title = styled.Text`
	${textStyles.titleMedium};
	margin-top: 64px;
	margin-bottom: 14px;
`;

const Subtitle = styled.Text`
	${textStyles.titleMedium};
	font-size: 15px;
	color: ${colors.textPlaceholder};
	margin-bottom: 36px;
`;

// const ErrorMessage = styled.Text`
// 	${textStyles.errorMessage};
// 	margin-bottom: 20px;
// 	text-align: center;
// `;

const InputField = styled(TextField)`
	margin-bottom: 40px;
`;

const ButtonContainer = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 50px;
	margin-bottom: 40px;
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
