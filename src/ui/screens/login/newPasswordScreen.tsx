import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { Keyboard, Text, TextInput } from "react-native";
import styled from "styled-components/native";

export const NewPasswordScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const { format } = useI18n();
	const { userService } = useServices();
	const route = useAppRoute<Routes.ForgotPassword>();

	const email = route.params.email;

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const performLogin = async () => {
		if (email.length > 0 && password.length >= 4) {
			try {
				await userService.loginWithEmail(email, password);
				setErrorMessage("");
			} catch (error: any) {
				if (error.statusCode === 401) {
					setErrorMessage(format("forgot_password.new.password.error"));
				} else {
					setErrorMessage(format("login.error.default"));
				}
			}
		}
	};

	return (
		<ScrollScreen contentContainerStyle={contentStyle}>
			<Logo source={require("../../../assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/forgotPasswordZen.jpg")} />
			<Title>{format("forgot_password.reset.title")}</Title>
			{errorMessage ? (
				<ErrorMessage>{errorMessage}</ErrorMessage>
			) : (
				<Description>{format("forgot_password.new.description")}</Description>
			)}
			<InputField
				title={format("forgot_password.new.password")}
				placeholder={format("forgot_password.new.password.placeholder")}
				value={password}
				onValueChanged={setPassword}
				blurOnSubmit={false}
				onSubmit={() => passwordFieldRef.current?.focus()}
			/>
			<InputField
				ref={passwordFieldRef}
				title={format("forgot_password.new.confirm_password")}
				placeholder={format("forgot_password.new.confirm_password.placeholder")}
				canBeSecure
				value={confirmPassword}
				onValueChanged={setConfirmPassword}
				blurOnSubmit={true}
			/>
			<ButtonContainer>
				<SecondaryButton onPress={() => navigation.goBack()}>{format("global.back")}</SecondaryButton>
				<PrimaryButton onPress={performLogin}>{format("forgot_password.new.button")}</PrimaryButton>
			</ButtonContainer>
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
	${textStyles.titleMedium};
	flex-grow: 1;
	align-self: center;
	margin-top: 60px;
	margin-bottom: 20px;
`;

const Description = styled.Text`
	${textStyles.primary};
	flex-grow: 1;
	align-self: center;
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

const InputField = styled(TextField)`
	flex-grow: 1;
	justify-content: center;
	margin-bottom: 20px;
	padding-left: 66px;
	padding-right: 66px;
`;

const ButtonContainer = styled.View`
	flex-grow: 1;
	flex-direction: row;
	justify-content: space-around;
	margin: 40px 66px;
`;

const ForgotButton = styled.TouchableOpacity`
	background-color: transparent;
	align-items: center;
`;

const contentStyle = {
	flexGrow: 1,
	paddingLeft: 0,
	paddingRight: 0,
};
