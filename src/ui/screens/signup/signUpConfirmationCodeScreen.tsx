import { useLogger } from "@core/logger/hooks/useLogger";
import { useServices } from "@core/services";
import { useJustRegisteredUserEmail } from "@domain/user/hooks/useUser";
import { PrimaryButton, SecondaryButton, SimpleTextButton } from "@ui/components/buttons";
import { Grow, Row } from "@ui/components/layout";
import { LogoImageHeader } from "@ui/components/logoImageHeader";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SixDigitInput } from "@ui/components/sixDigitInput";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import { obfuscateEmail } from "@ui/utils/emailUtils";
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import styled from "styled-components/native";

export const SignUpConfirmationCodeScreen: React.FC = () => {
	const logger = useLogger("SignUpConfirmationCodeScreen");
	const navigation = useRoutesNavigation();
	const { format } = useI18n();
	const { userService, ringApi } = useServices();
	const email = useJustRegisteredUserEmail();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const [code, setCode] = useState<readonly string[]>(["", "", "", "", "", ""]);

	useEffect(() => {
		validateCode(code);
	}, [code]);

	const validateCode = useCallback(async (codeArray: readonly string[]) => {
		const code = codeArray.join("");
		setErrorMessage("");
		if (code.length !== 6) {
			return;
		}
		Keyboard.dismiss();
		setLoading(true);
		logger.debug("Trying to validate code : " + code);
		try {
			await userService.validateSignUp(code);

			setLoading(false);
		} catch (error) {
			setLoading(false);
			setCode(["", "", "", "", "", ""]);
			setErrorMessage(format("login.error.default"));
		}
		await ringApi.getLatestFirmware();
	}, []);

	const resendCode = async () => {
		setLoading(true);
		setErrorMessage("");
		setCode(["", "", "", "", "", ""]);
		try {
			await userService.resendSignUpCode();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("login.error.default"));
		}
	};

	return (
		<ScrollScreen style={{ justifyContent: "flex-start" }} contentContainerStyle={contentStyle}>
			<LogoImageHeader source={require("@assets/images/signup_runner.jpg")} />
			<Title>{format("signup_code.title")}</Title>
			{errorMessage.length > 0 ? (
				<ErrorMessage>{errorMessage}</ErrorMessage>
			) : (
				<Description>{format("signup_code.description", { email: !!email ? obfuscateEmail(email) : "" })}</Description>
			)}
			<SixDigitInputField codeValue={code} onCodeChanged={setCode} />
			<Grow />
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<>
						<RowButtonContainer gap={35}>
							<SecondaryButton onPress={navigation.goBack}>{format("global.back")}</SecondaryButton>
							<PrimaryButton
								onPress={() => {
									validateCode(code);
								}}
							>
								{format("signup_code.validate_button")}
							</PrimaryButton>
						</RowButtonContainer>
						<SimpleTextButton onPress={resendCode}>{format("signup_code.resend_button")}</SimpleTextButton>
					</>
				)}
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
	align-self: center;
	margin-top: 60px;
	margin-bottom: 40px;
`;

const Description = styled.Text`
	${textStyles.primary};
	align-self: center;
	justify-content: center;
	margin-bottom: 60px;
	padding: 0 66px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	align-self: center;
	justify-content: center;
	margin-bottom: 60px;
	padding: 0 80px;
	text-align: center;
`;

const SixDigitInputField = styled(SixDigitInput)`
	margin-bottom: 0px;
	padding-left: 66px;
	padding-right: 66px;
`;

const ButtonContainer = styled.View`
	width: 100%;
	padding: 32px 66px 80px;
	align-items: center;
`;

const RowButtonContainer = styled(Row)`
	margin-bottom: 16px;
`;

const contentStyle = {
	paddingVertical: 0,
};
