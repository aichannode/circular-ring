import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
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
		<ScrollScreen>
			<Logo source={require("@assets/images/circularOffcial.png")} />
			<HeaderImage source={require("@assets/images/signup_runner.jpg")} />
			<ResponsiveCenterView>
				<Title>{format("signup_success.title")}</Title>
				<Check source={require("@assets/images/check.png")} />
				<Description>{format("signup_success.description")}</Description>
				<PrimaryButton onPress={goToRingSetup}>{format("signup_success.start")}</PrimaryButton>
			</ResponsiveCenterView>
		</ScrollScreen>
	);
};

const Logo = styled.Image`
	margin-bottom: 50px;
	align-self: center;
`;

const HeaderImage = styled.Image`
	width: 100%;
`;

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
