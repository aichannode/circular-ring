import { ChronoType } from "@domain/user/advancedInfo";
import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import { advanceInfoI18nKey, chronoTypeKeys } from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";

export const ChronotypeCard = () => {
	const { format } = useI18n();
	const advancedInfo = useUserAdvancedInfo();

	const iconSource = () => {
		switch (advancedInfo?.chronoType ?? ChronoType.MORNING) {
			case ChronoType.MORNING:
			case ChronoType.MORNING_ERRATIC:
				return require("@assets/images/chronomorning_small.png");
			case ChronoType.SOLAR:
			case ChronoType.SOLAR_ERRATIC:
				return require("@assets/images/chronosolar.png");
			case ChronoType.NIGHT:
			case ChronoType.NIGHT_ERRATIC:
				return require("@assets/images/chrononight.png");
		}
	};

	const displayedTypeName = advancedInfo?.chronoType
		? format(advanceInfoI18nKey(chronoTypeKeys, advancedInfo.chronoType))
		: format("global.not_enough_data");

	return (
		<Card>
			<Title>{format("profile_advanced_info.chrono_type.title")}</Title>
			{advancedInfo?.chronoType ? <Icon source={iconSource()} /> : null}
			<Value>{displayedTypeName}</Value>
		</Card>
	);
};

const Card = styled.View`
	flex: 1;
	${roundedWhiteCardStyle};
	padding: 15px 12px;
	align-items: center;
`;

const Title = styled.Text`
	${textStyles.tertiary};
	align-self: flex-start;
`;

const Icon = styled.Image`
	height: 32px;
	resize-mode: center;
	margin-top: 11px;
`;

const Value = styled.Text`
	font-size: 10px;
	font-weight: bold;
	color: ${colors.textPrimary};
`;
