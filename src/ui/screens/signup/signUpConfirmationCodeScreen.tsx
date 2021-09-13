import { useLogger } from "@core/logger/hooks/useLogger";
import { useServices } from "@core/services";
import { useUserEmail } from "@domain/user/hooks/useUser";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SixDigitInput } from "@ui/components/sixDigitInput";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { obfuscateEmail } from "@ui/utils/emailUtils";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

export const SignUpConfirmationCodeScreen: React.FC = () => {
	const logger = useLogger("SignUpConfirmationCodeScreen");
	const navigation = useRoutesNavigation();
	const { format } = useI18n();
	const { userService } = useServices();
	const email = useUserEmail();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const validateCode = useCallback(async (code: string) => {
		setErrorMessage("");
		if (code.length !== 6) {
			return;
		}
		setLoading(true);
		logger.debug("Trying to validate code : " + code);
		try {
			await userService.validateSignUp(code);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("login.error.default"));
		}
	}, []);

	const resendCode = async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.resendSignUpCode();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("login.error.default"));
		}
	};

	return (
		<ScrollScreen contentContainerStyle={contentStyle}>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/signup_runner.jpg")} />
			<Title>{format("signup_code.title")}</Title>
			{errorMessage.length > 0 ? (
				<ErrorMessage>{errorMessage}</ErrorMessage>
			) : (
				<Description>{format("signup_code.description", { email: !!email ? obfuscateEmail(email) : "" })}</Description>
			)}
			<SixDigitInputField onSubmit={validateCode} />
			<ButtonContainer centerElements={isLoading}>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<>
						<SecondaryButton onPress={navigation.goBack}>{format("global.back")}</SecondaryButton>
						<PrimaryButton onPress={resendCode}>{format("signup_code.resend_button")}</PrimaryButton>
					</>
				)}
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
	padding: 0 66px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	flex-grow: 1;
	align-self: center;
	justify-content: center;
	margin-bottom: 20px;
	padding: 0 80px;
	text-align: center;
`;

const SixDigitInputField = styled(SixDigitInput)`
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

const contentStyle = {
	flexGrow: 1,
	paddingLeft: 0,
	paddingRight: 0,
};
