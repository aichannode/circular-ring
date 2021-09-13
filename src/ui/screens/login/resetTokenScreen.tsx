import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SixDigitInput } from "@ui/components/sixDigitInput";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import React, { useState } from "react";
import styled from "styled-components/native";

export const ResetTokenScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const route = useAppRoute<Routes.ResetToken>();
	const { userService } = useServices();

	const { format } = useI18n();

	const email = route.params.email;

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(format("forgot_password.reset.code.error"));
	const [resend, setResend] = useState(false);

	const resendCode = async () => {
		try {
			await userService.resendResetToken(email);
			setResend(true);
		} catch (error) {
			setResend(false);
			setError(true);
			setErrorMessage("login.error.default");
		}
	};

	return (
		<ScrollScreen contentContainerStyle={contentStyle}>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/forgotPasswordZen.jpg")} />
			<Title>{format("forgot_password.reset.title")}</Title>
			{error ? (
				<ErrorMessage>{errorMessage}</ErrorMessage>
			) : resend ? (
				<Description>{format("forgot_password.reset.code.resend_description")}</Description>
			) : (
				<Description>{format("forgot_password.reset.code.description", { email })}</Description>
			)}
			<SixDigitInputField
				onSubmit={() => {
					navigation.navigate(Routes.NewPassword, { email });
				}}
			/>
			<ButtonContainer>
				<SecondaryButton onPress={() => navigation.goBack()}>{format("global.back")}</SecondaryButton>
				<PrimaryButton onPress={() => resendCode()}>{format("forgot_password.reset.code.resend_button")}</PrimaryButton>
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
