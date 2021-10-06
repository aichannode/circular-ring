import React from "react";
import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import styled from "styled-components/native";

export const BMICard = () => {
	const { format } = useI18n();
	const advancedInfo = useUserAdvancedInfo();

	return (
		<Card>
			<Title>{format("profile_advanced_info.bmi.title")}</Title>
			<Value>{advancedInfo?.bmi?.toFixed(1) ?? "-"}</Value>
		</Card>
	);
};

const Card = styled.View`
	flex: 1;
	${roundedWhiteCardStyle};
	padding: 15px 12px;
	align-items: flex-start;
`;

const Title = styled.Text`
	${textStyles.tertiary};
`;

const Value = styled.Text`
	font-size: 22px;
	margin-top: 15px;
	margin-bottom: 20px;
	font-weight: bold;
	color: ${colors.textPrimary};
	align-self: center;
`;
