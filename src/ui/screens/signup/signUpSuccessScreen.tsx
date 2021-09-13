import { useServices } from "@core/services";
import { PrimaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import styled from "styled-components/native";

export const SignUpSuccessScreen = () => {
	const { userService } = useServices();
	const { format } = useI18n();

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", () => true);
		return () => BackHandler.removeEventListener("hardwareBackPress", () => true);
	}, []);

	const performLogin = useCallback(async () => {
		setLoading(true);
		await userService.loginJustRegisteredUser();
		setLoading(false);
	}, []);

	return (
		<ScrollScreen contentContainerStyle={contentStyle}>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/signup_runner.jpg")} />
			<Title>{format("signup_success.title")}</Title>
			<Check source={require("@assets/images/check.png")} />
			<Description>{format("signup_success.description")}</Description>
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={performLogin}>{format("signup_success.start")}</PrimaryButton>
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
`;

const Check = styled.Image`
	margin-top: 32px;
	margin-bottom: 32px;
	align-self: center;
`;

const Description = styled.Text`
	${textStyles.primary};
	flex-grow: 1;
	align-self: center;
	justify-content: center;
	margin-bottom: 30px;
	padding: 0 66px;
	text-align: center;
`;

const ButtonContainer = styled.View`
	width: 100%;
	justify-content: space-between;
	padding: 40px 66px;
	align-items: center;
`;

const contentStyle = {
	flexGrow: 1,
	paddingLeft: 0,
	paddingRight: 0,
};
