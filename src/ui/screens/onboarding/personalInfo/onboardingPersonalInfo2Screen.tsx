import { round2Digits } from "@core/utils";
import {
	cmToFt,
	ftToCm,
	HeightUnit,
	heightValuesCm,
	heightValuesFt,
	kgToLbs,
	lbsToKg,
	UNDEFINED_HEIGHT,
	UNDEFINED_WEIGHT,
	WeightUnit,
	weightValuesKg,
	weightValuesLbs,
} from "@domain/units";
import { Sex } from "@domain/user/user";
import { useNavigation } from "@react-navigation/native";
import { SimpleTextButton } from "@ui/components/buttons";
import { HorizontalCarousel } from "@ui/components/horizontalCarousel";
import { Grow } from "@ui/components/layout";
import { BackButton } from "@ui/components/navigation/backButton";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SelectableButton } from "@ui/components/selectableButton";
import { Switch } from "@ui/components/switch";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import styled from "styled-components/native";

export const OnboardingPersonalInfo2Screen = () => {
	const { format } = useI18n();
	const navigation = useNavigation();

	const route = useAppRoute<Routes.OnboardingPersonalInfo2>();
	const { firstName, lastName, country } = route.params;
	const { navigate } = useRoutesNavigation();

	const [sex, setSex] = useState(Sex.Female);

	const [birthDate, setBirthDate] = useState("");

	const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.kg);
	const [weight, setWeight] = useState(UNDEFINED_WEIGHT); // weight always in kg

	const [heightUnit, setHeightUnit] = useState<HeightUnit>(HeightUnit.cm);
	const [height, setHeight] = useState(UNDEFINED_HEIGHT); // height always in cm

	const [errorMessage, setErrorMessage] = useState("");

	const goNext = useCallback(() => {
		setErrorMessage("");
		if (birthDate.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.born_date"));
		} else {
			const _birthDate = dayjs(birthDate, "DD/MM/YYYY", true);
			if (!_birthDate.isValid() || _birthDate.isAfter(dayjs())) {
				setErrorMessage(format("onboarding.personal_info.error.born_date_invalid"));
			} else {
				navigate(Routes.OnboardingTutorial, {
					firstName,
					lastName,
					country,
					birthDate,
					sex,
					weight,
					height,
					heightUnit,
					weightUnit,
				});
			}
		}
	}, [birthDate, sex, weight, height, heightUnit, weightUnit]);

	return (
		<StyledScrollScreen>
			<TopContainer>
				<StyledBackButton />
				<Title>{format("onboarding.personal_info.title")}</Title>
			</TopContainer>
			<InfoBlock>
				<TitleAndOptions>
					<BlockTitle>{format("onboarding.personal_info.sex_title")}</BlockTitle>
				</TitleAndOptions>
				<SexButtons>
					<SelectableButton
						selected={sex === Sex.Male}
						onPress={() => setSex(Sex.Male)}
						bgColor={colors.white}
						colors={colors.gradient.orange}
					>
						{format("onboarding.personal_info.sex_male")}
					</SelectableButton>
					<View style={{ width: 15 }} />
					<SelectableButton
						selected={sex === Sex.Female}
						onPress={() => setSex(Sex.Female)}
						bgColor={colors.white}
						colors={colors.gradient.orange}
					>
						{format("onboarding.personal_info.sex_female")}
					</SelectableButton>
				</SexButtons>
			</InfoBlock>
			<InfoBlock>
				<TitleAndOptions>
					<BlockTitle>{format("onboarding.personal_info.born_title")}</BlockTitle>
				</TitleAndOptions>
				<BornDateContainer>
					<TextInputMask
						type={"datetime"}
						options={{
							format: "DD/MM/YYYY",
						}}
						placeholder={format("onboarding.personal_info.born_placeholder")}
						placeholderTextColor={colors.textTertiary}
						value={birthDate}
						onChangeText={setBirthDate}
						style={{ padding: 0, width: "100%", color: colors.textPrimary }}
					/>
				</BornDateContainer>
			</InfoBlock>
			<InfoBlock>
				<TitleAndOptions>
					<BlockTitle>{format("onboarding.personal_info.weight_title")}</BlockTitle>
					<Switch
						options={[WeightUnit.kg, WeightUnit.lbs]}
						currentOption={weightUnit}
						onSelectOption={setWeightUnit}
						containerBgColor={colors.white}
					/>
				</TitleAndOptions>
				<HorizontalCarousel
					data={weightUnit === WeightUnit.kg ? weightValuesKg : weightValuesLbs}
					renderItem={(item) => <PickerValue itemWidth={50}>{item}</PickerValue>}
					itemWidth={50}
					item={weightUnit === WeightUnit.kg ? Math.round(weight) : Math.round(kgToLbs(weight))}
					onItemChange={(value) => setWeight(weightUnit === WeightUnit.kg ? value : lbsToKg(value))}
					animatedScrollToDefaultIndex={false}
				/>
			</InfoBlock>
			<InfoBlock>
				<TitleAndOptions>
					<BlockTitle>{format("onboarding.personal_info.height_title")}</BlockTitle>
					<Switch
						options={[HeightUnit.cm, HeightUnit.ft]}
						currentOption={heightUnit}
						onSelectOption={setHeightUnit}
						containerBgColor={colors.white}
					/>
				</TitleAndOptions>
				<HorizontalCarousel
					data={heightUnit === HeightUnit.cm ? heightValuesCm : heightValuesFt}
					renderItem={(item) => (
						<PickerValue itemWidth={heightUnit === HeightUnit.cm ? 50 : 60}>
							{item.toFixed(heightUnit === HeightUnit.cm ? 0 : 2)}
						</PickerValue>
					)}
					itemWidth={heightUnit === HeightUnit.cm ? 50 : 60}
					item={heightUnit === HeightUnit.cm ? Math.round(height) : round2Digits(cmToFt(height))}
					onItemChange={(value) => setHeight(heightUnit === HeightUnit.cm ? value : round2Digits(ftToCm(value)))}
					animatedScrollToDefaultIndex={false}
				/>
			</InfoBlock>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<Grow />
			<ButtonContainer>
				<RowButtonContainer>
					<StyledSimpleTextButton onPress={navigation.goBack}>{format("global.back")}</StyledSimpleTextButton>
					<StyledSimpleTextButton onPress={goNext}>{format("global.next")}</StyledSimpleTextButton>
				</RowButtonContainer>
			</ButtonContainer>
		</StyledScrollScreen>
	);
};

const TopContainer = styled.View`
	width: 100%;
	margin-top: 67px;
	margin-bottom: 70px;
`;

const StyledScrollScreen = styled(ScrollScreen)`
	background-color: ${colors.lightgray};
	justify-content: flex-start;
	align-items: center;
	padding-left: 30px;
	padding-right: 30px;
`;

const StyledBackButton = styled(BackButton)`
	position: absolute;
	top: 3;
	left: -10;
`;
const Title = styled.Text`
	${textStyles.bigTitle};
	width: 100%;
	text-align: center;
`;

const InfoBlock = styled.View`
	${whiteCardStyle};
	width: 100%;
	margin-bottom: 12px;
`;

const BlockTitle = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
`;

const BornDateContainer = styled.View`
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	width: 100%;
	padding: 0 8px;
	flex-direction: row;
	align-items: center;
`;

const SexButtons = styled.View`
	flex-direction: row;
	align-items: center;
`;

const TitleAndOptions = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

const PickerValue = styled.Text<{ itemWidth: number }>`
	width: ${({ itemWidth }) => itemWidth}px;
	text-align: center;
	font-size: 22px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const ButtonContainer = styled.View`
	width: 100%;
	margin: 20px 0;
`;

const RowButtonContainer = styled.View`
	justify-content: space-between;
	flex-direction: row;
`;

const StyledSimpleTextButton = styled(SimpleTextButton)`
	text-decoration: none;
	padding: 10px;
`;
