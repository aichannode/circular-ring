import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView } from "@ui/components/layout";
import { LogoImageHeader } from "@ui/components/logoImageHeader";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import styled from "styled-components/native";

export const RingSetupStartScreen = () => {
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", () => true);
		return () => BackHandler.removeEventListener("hardwareBackPress", () => true);
	}, []);

	const goToRingSetup = useCallback(() => {
		navigate(Routes.Pairing);
	}, []);

	return (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<LogoImageHeader source={require("@assets/images/signup_runner.jpg")} />
			<ResponsiveCenterView>
				<Title>{format("signup_success.title")}</Title>
				<Check source={require("@assets/images/check.png")} />
				<Description>{format("signup_success.description")}</Description>
			</ResponsiveCenterView>
			<Grow />
			<ButtonContainer>
				<PrimaryButton onPress={goToRingSetup}>{format("signup_success.start")}</PrimaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-top: 60px;
`;

const Check = styled.Image`
	margin-top: 32px;
	margin-bottom: 32px;
`;

const Description = styled.Text`
	${textStyles.primary};
	margin-bottom: 30px;
	text-align: center;
`;

const ButtonContainer = styled.View`
	flex: 1;
	margin-bottom: 40px;
	align-items: center;
`;
