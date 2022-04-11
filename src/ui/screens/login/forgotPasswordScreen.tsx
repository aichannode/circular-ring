import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { LogoImageHeader } from "@ui/components/logoImageHeader";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { isEmail } from "@ui/utils/emailUtils";
import React, { useState } from "react";
import styled from "styled-components/native";
import { parseEmail } from "../business";

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
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<LogoImageHeader source={require("@assets/images/forgotPasswordZen.jpg")} />
			<ResponsiveCenterView>
				<Title>{format("forgot_password.reset.title")}</Title>
				{error ? (
					<ErrorMessage>{format("signup.error.email_format")}</ErrorMessage>
				) : (
					<Description>{format("forgot_password.reset.description")}</Description>
				)}

				<InputField
					placeholder={format("forgot_password.reset.email.placeholder")}
					value={email}
					onValueChanged={(state) => setEmail(parseEmail(state))}
					blurOnSubmit={true}
					keyboardType={"email-address"}
					autoCapitalize={"none"}
				/>
			</ResponsiveCenterView>
			<Grow />
			<ButtonContainer gap={35} justify="center">
				<SecondaryButton onPress={navigation.goBack}>{format("global.back")}</SecondaryButton>
				<PrimaryButton onPress={resetPassword}>{format("global.next")}</PrimaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-top: 60px;
	margin-bottom: 20px;
`;

const Description = styled.Text`
	${textStyles.primary};
	justify-content: center;
	margin-bottom: 20px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 20px;
	text-align: center;
`;

const InputField = styled(TextField)`
	justify-content: center;
	margin-bottom: 20px;
`;

const ButtonContainer = styled(Row)`
	margin-top: 30px;
	margin-bottom: 40px;
`;
