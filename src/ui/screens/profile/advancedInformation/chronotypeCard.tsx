import { ChronoType } from "@domain/user/advancedInfo";
import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { Grow } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { advanceInfoI18nKey, chronoTypeKeys } from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useRef } from "react";
import styled from "styled-components/native";
import { Image, Pressable, useWindowDimensions } from "react-native";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { ChronoTypeInfoInfoBottomSheet } from "@ui/screens/profile/advancedInformation/chronoTypeInfoBottomSheet";

export const ChronotypeCard = () => {
	const { format } = useI18n();
	const advancedInfo = useUserAdvancedInfo();
	const { height } = useWindowDimensions();

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

	const chronoTypeInfoRef = useRef<CircularBottomSheetHandle>(null);

	return (
		<Card>
			<TitleContainer>
				<Title>{format("profile_advanced_info.chrono_type.title")}</Title>
				<Pressable
					onPress={() => {
						chronoTypeInfoRef.current?.present();
					}}
				>
					<Image source={require("@assets/images/info.png")} />
				</Pressable>
			</TitleContainer>
			{advancedInfo?.chronoType ? <Icon source={iconSource()} /> : null}
			<Grow />
			<Value>{displayedTypeName}</Value>
			<Grow />
			<CircularBottomSheet snapPoints={[height * 0.8]} ref={chronoTypeInfoRef}>
				<ChronoTypeInfoInfoBottomSheet
					chronoType={advancedInfo?.chronoType as ChronoType}
					onClose={() => chronoTypeInfoRef.current?.close()}
				/>
			</CircularBottomSheet>
		</Card>
	);
};

const Card = styled.View`
	flex: 1;
	${roundedWhiteCardStyle};
	padding: 15px 12px;
	align-items: center;
`;

const TitleContainer = styled.View`
	flex: 1;
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`;

const Title = styled.Text`
	${textStyles.tertiary};
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
