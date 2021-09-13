import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { isEmail } from "@ui/utils/emailUtils";
import React, { useState } from "react";
import styled from "styled-components/native";

export const ForgotPasswordScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const route = useAppRoute<Routes.ForgotPassword>();
	const { userService } = useServices();

	const { format } = useI18n();

	const [email, setEmail] = useState(route.params?.email ?? "");
	const [error, setError] = useState(false);

	const resetPassword = async () => {
		if (!isEmail(email)) {
			setError(true);
		} else {
			try {
				await userService.resetPassword(email);
				setError(false);
				navigation.navigate(Routes.ResetToken, { email });
			} catch (error) {
				setError(true);
			}
		}
	};

	return (
		<>
			<ScrollScreen contentContainerStyle={contentStyle}>
				<Logo source={require("@assets/images/circularOffcial.png")} />
				<HeaderImage source={require("@assets/images/forgotPasswordZen.jpg")} />
				<Title>{format("forgot_password.reset.title")}</Title>
				{error ? (
					<ErrorMessage>{format("signup.error.email_format")}</ErrorMessage>
				) : (
					<Description>{format("forgot_password.reset.description")}</Description>
				)}

				<InputField
					placeholder={format("forgot_password.reset.email.placeholder")}
					value={email}
					onValueChanged={setEmail}
					blurOnSubmit={true}
					keyboardType={"email-address"}
				/>
				<ButtonContainer>
					<SecondaryButton onPress={navigation.goBack}>{format("global.back")}</SecondaryButton>
					<PrimaryButton onPress={resetPassword}>{format("global.next")}</PrimaryButton>
				</ButtonContainer>
			</ScrollScreen>
		</>
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

const contentStyle = {
	flexGrow: 1,
	paddingLeft: 0,
	paddingRight: 0,
};
