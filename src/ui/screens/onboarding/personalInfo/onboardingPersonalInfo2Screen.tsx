import { useServices } from "@core/services";
import {
	cmToFt,
	defaultHeight,
	defaultWeight,
	ftToCm,
	HeightUnit,
	heightValuesCm,
	heightValuesFt,
	kgToLbs,
	lbsToKg,
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
import { Spinner } from "@ui/components/spinner";
import { Switch } from "@ui/components/switch";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import { usePrevious } from "@ui/utils/usePrevious";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const OnboardingPersonalInfo2Screen = () => {
	const { format } = useI18n();
	const navigation = useNavigation();
	const { userService } = useServices();
	const safeArea = useSafeAreaInsets();

	const route = useAppRoute<Routes.OnboardingPersonalInfo2>();
	const { firstName, lastName, country } = route.params;

	const [weightUnit, setWeightUnit] = useState<WeightUnit>(WeightUnit.kg);
	const [weightRange, setWeightRange] = useState<number[]>(weightValuesKg);
	const previousWeightUnit = usePrevious(weightUnit);

	const [heightUnit, setHeightUnit] = useState<HeightUnit>(HeightUnit.cm);
	const [heightRange, setHeightRange] = useState<number[]>(heightValuesCm);
	const previousHeightUnit = usePrevious(heightUnit);

	const [sex, setSex] = useState(Sex.Female);
	const [bornDate, setBornDate] = useState("");
	const [weight, setWeight] = useState(defaultWeight.get(weightUnit) ?? 80);
	const [height, setHeight] = useState(defaultHeight.get(heightUnit) ?? 170);

	const [errorMessage, setErrorMessage] = useState("");

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (!!previousWeightUnit && previousWeightUnit !== weightUnit) {
			setWeightRange(weightUnit === WeightUnit.kg ? weightValuesKg : weightValuesLbs);
			setWeight(weightUnit === WeightUnit.kg ? lbsToKg(weight) : kgToLbs(weight));
		}
	}, [weightUnit]);

	useEffect(() => {
		if (!!previousHeightUnit && previousHeightUnit !== heightUnit) {
			setHeightRange(heightUnit === HeightUnit.cm ? heightValuesCm : heightValuesFt);
			setHeight(heightUnit === HeightUnit.cm ? ftToCm(height) : cmToFt(height));
		}
	}, [heightUnit]);

	const completeTutorial = useCallback(async () => {
		setLoading(true);
		const birthDate = dayjs(bornDate, "DD/MM/YYYY", true).toDate();
		try {
			await userService.completeTutorial({
				firstName,
				lastName,
				country,
				bornDate: birthDate,
				sex,
				weight: weightUnit === WeightUnit.kg ? weight : lbsToKg(weight),
				height: heightUnit === HeightUnit.cm ? height : ftToCm(height),
			});
			await userService.updateUserSettings("DD/MM/YYYY", heightUnit, weightUnit);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("onboarding.personal_info.error.default"));
		}
	}, [bornDate, sex, weight, height]);

	const goNext = useCallback(() => {
		setErrorMessage("");
		if (bornDate.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.born_date"));
		} else {
			const birthDate = dayjs(bornDate, "DD/MM/YYYY", true);
			if (!birthDate.isValid() || birthDate.isAfter(dayjs())) {
				setErrorMessage(format("onboarding.personal_info.error.born_date_invalid"));
			} else {
				completeTutorial();
			}
		}
	}, [bornDate, sex, weight, height]);

	return (
		<StyledScrollScreen>
			<StyledBackButton top={safeArea.top} />
			<Title>{format("onboarding.personal_info.title")}</Title>
			<InfoBlock>
				<TitleAndOptions>
					<BlockTitle>{format("onboarding.personal_info.sex_title")}</BlockTitle>
				</TitleAndOptions>
				<SexButtons>
					<SelectableButton
						title={format("onboarding.personal_info.sex_male")}
						selected={sex === Sex.Male}
						onSelected={() => setSex(Sex.Male)}
						bgColor={colors.white}
					/>
					<View style={{ width: 15 }} />
					<SelectableButton
						title={format("onboarding.personal_info.sex_female")}
						selected={sex === Sex.Female}
						onSelected={() => setSex(Sex.Female)}
						bgColor={colors.white}
					/>
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
						value={bornDate}
						onChangeText={setBornDate}
						style={{ padding: 0, width: "100%" }}
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
					data={weightRange}
					renderItem={(item, index) => <PickerValue itemWidth={50}>{item}</PickerValue>}
					itemWidth={50}
					onItemChange={setWeight}
					item={weight}
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
					data={heightRange}
					renderItem={(item) => (
						<PickerValue itemWidth={heightUnit === HeightUnit.cm ? 50 : 60}>
							{item.toFixed(heightUnit === HeightUnit.cm ? 0 : 2)}
						</PickerValue>
					)}
					itemWidth={heightUnit === HeightUnit.cm ? 50 : 60}
					onItemChange={setHeight}
					item={height}
					animatedScrollToDefaultIndex={false}
				/>
			</InfoBlock>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<Grow />
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<RowButtonContainer>
						<StyledSimpleTextButton onPress={navigation.goBack}>{format("global.back")}</StyledSimpleTextButton>
						<StyledSimpleTextButton onPress={goNext}>{format("global.next")}</StyledSimpleTextButton>
					</RowButtonContainer>
				)}
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

const StyledBackButton = styled(BackButton)<{ top: number }>`
	position: absolute;
	left: 20px;
	top: ${({ top }) => top}px;
`;

const Title = styled.Text`
	${textStyles.bigTitle};
	margin-top: 67px;
	margin-bottom: 70px;
`;

const InfoBlock = styled.View`
	${whiteCardStyle};
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
	border-width: 1px;
	border-color: #00bcd4;
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
