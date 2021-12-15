import { SimpleTextButton } from "@ui/components/buttons";
import { Grow } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import styled from "styled-components/native";

export const OnboardingWearInfoScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", () => true);
		return () => BackHandler.removeEventListener("hardwareBackPress", () => true);
	}, []);

	const goNext = useCallback(() => {
		navigate(Routes.OnboardingPersonalInfo1);
	}, []);

	return (
		<StyledScrollScreen>
			<Title>{format("onboarding.wear.title")}</Title>
			<InfoBlock>
				<InfoText>{format("onboarding.wear.info.top")}</InfoText>
				<InfoImage source={require("@assets/images/fingerNamesRight.png")} />
			</InfoBlock>
			<InfoBlock>
				<InfoText>{format("onboarding.wear.info.bottom")}</InfoText>
			</InfoBlock>
			<Grow />
			<ButtonContainer>
				<StyledSimpleTextButton onPress={goNext}>{format("global.next")}</StyledSimpleTextButton>
			</ButtonContainer>
		</StyledScrollScreen>
	);
};

const StyledScrollScreen = styled(ScrollScreen)`
	background-color: ${colors.lightgray};
	justify-content: flex-start;
	align-items: center;
	padding-left: 30px;
	padding-right: 30px;
`;

const Title = styled.Text`
	${textStyles.bigTitle};
	margin-top: 67px;
	margin-bottom: 28px;
`;

const InfoBlock = styled.View`
	${whiteCardStyle};
	width: 100%;
	margin-bottom: 12px;
`;

const InfoText = styled.Text`
	${textStyles.primary};
	font-size: 14px;
`;

const InfoImage = styled.Image`
	margin-top: 24px;
`;

const ButtonContainer = styled.View`
	align-self: flex-end;
	margin: 30px 0;
`;

const StyledSimpleTextButton = styled(SimpleTextButton)`
	text-decoration: none;
`;
