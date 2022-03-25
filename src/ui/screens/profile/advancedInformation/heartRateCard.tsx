import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { useI18n } from "@ui/i18n";
import { ComparativeInfoBottomSheet } from "@ui/screens/profile/advancedInformation/comparativeInfoBottomSheet";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useRef } from "react";
import { Image, Pressable } from "react-native";
import styled from "styled-components/native";

export const HeartRateCard = () => {
	const { format } = useI18n();
	const advancedInfo = useUserAdvancedInfo();

	const comparativeInfoRef = useRef<CircularBottomSheetHandle>(null);

	return !advancedInfo ? null : (
		<Card>
			<HeartRateLeft>
				<CardTitle>{format("profile_advanced_info.heart_rate.title")}</CardTitle>
				<HRItem>
					<HRItemTitleText>{format("profile_advanced_info.heart_rate.maximum")}</HRItemTitleText>
					<HRItemValue>
						<HRItemValueNumber>
							{advancedInfo.maxHr ?? "-"}
							<HRItemValueUnit> bpm</HRItemValueUnit>
						</HRItemValueNumber>
					</HRItemValue>
				</HRItem>
				<HRItem>
					<HRItemTitleText>{format("profile_advanced_info.heart_rate.sport_target")}</HRItemTitleText>
					<HRItemValue>
						<HRItemValueNumber>
							{advancedInfo.hrZone.min && advancedInfo.hrZone.max
								? `${advancedInfo.hrZone.min} : ${advancedInfo.hrZone.max}`
								: "-"}
							<HRItemValueUnit> bpm</HRItemValueUnit>
						</HRItemValueNumber>
					</HRItemValue>
				</HRItem>
			</HeartRateLeft>
			<HeartRateRight>
				<TitleContainer>
					<CardTitle>{format("profile_advanced_info.heart_rate.comparative_title")}</CardTitle>
					<Pressable
						onPress={() => {
							comparativeInfoRef.current?.present();
						}}
					>
						<Image source={require("@assets/images/info.png")} />
					</Pressable>
				</TitleContainer>
				<HRItem>
					<HRItemTitleText>{format("profile_advanced_info.heart_rate.rhr")}</HRItemTitleText>
					<HRItemValue>
						<HRItemValueNumber>
							{advancedInfo.comparativeRhr ?? "-"}
							<HRItemValueUnit> bpm</HRItemValueUnit>
						</HRItemValueNumber>
					</HRItemValue>
				</HRItem>
				<HRItem>
					<HRItemTitleText>{format("profile_advanced_info.heart_rate.vo2_max")}</HRItemTitleText>
					<HRItemValue>
						<HRItemValueNumber>
							{advancedInfo.comparativeVo2Max ?? "-"}
							<HRItemValueUnit> bpm</HRItemValueUnit>
						</HRItemValueNumber>
					</HRItemValue>
				</HRItem>
			</HeartRateRight>
			<CircularBottomSheet snapPoints={[480]} ref={comparativeInfoRef}>
				<ComparativeInfoBottomSheet onClose={() => comparativeInfoRef.current?.close()} />
			</CircularBottomSheet>
		</Card>
	);
};

const Card = styled.View`
	margin: 0 20px;
	${roundedWhiteCardStyle};
	flex-direction: row;
`;

const HeartRateLeft = styled.View`
	flex: 1;
	background-color: ${colors.white};
	border-radius: 10px;
	padding: 15px 12px;
`;

const HeartRateRight = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
	border-radius: 10px;
	padding: 15px 12px;
`;

const TitleContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

const CardTitle = styled.Text`
	${textStyles.tertiary};
`;

const HRItem = styled.View`
	flex-direction: row;
	margin-top: 20px;
`;

const HRItemTitleText = styled.Text`
	flex: 1;
	font-size: 11px;
	color: ${colors.textPrimary};
`;

const HRItemValue = styled.View`
	flex-direction: row;
`;
const HRItemValueNumber = styled.Text`
	font-size: 11px;
	font-weight: bold;
	color: ${colors.textPrimary};
`;

const HRItemValueUnit = styled.Text`
	font-size: 7px;
`;
