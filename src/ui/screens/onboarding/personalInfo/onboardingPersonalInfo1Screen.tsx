import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";

export const OnboardingPersonalInfo1Screen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();

	return (
		<StyledScrollScreen>
			<BackButton />
			<Title>{format("onboarding.personal_info.title")}</Title>
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
	margin-bottom: 12px;
`;
