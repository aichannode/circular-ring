import { Sex } from "@domain/user/user";
import { useNavigation } from "@react-navigation/native";
import { SimpleTextButton } from "@ui/components/buttons";
import { Grow } from "@ui/components/layout";
import { BackButton } from "@ui/components/navigation/backButton";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SelectableButton } from "@ui/components/selectableButton";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import styled from "styled-components/native";

export const OnboardingPersonalInfo2Screen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const navigation = useNavigation();

	const [sex, setSex] = useState(Sex.Female);
	const [bornDate, setBornDate] = useState("");
	const [weight, setWeight] = useState(80);
	const [height, setHeight] = useState(170);

	const openCalendar = useCallback(() => {
		// TODO
	}, []);

	const goNext = useCallback(() => {
		// navigate(Routes.OnboardingPersonalInfo1);
	}, []);

	return (
		<StyledScrollScreen>
			<StyledBackButton />
			<Title>{format("onboarding.personal_info.title")}</Title>
			<InfoBlock>
				<BlockTitle>{format("onboarding.personal_info.sex_title")}</BlockTitle>
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
				<BlockTitle>{format("onboarding.personal_info.born_title")}</BlockTitle>
				<Pressable onPress={openCalendar}>
					<BornDateContainer>
						<BornText isPlaceholder={bornDate.length > 0}>
							{bornDate ? bornDate : format("onboarding.personal_info.born_placeholder")}
						</BornText>
					</BornDateContainer>
				</Pressable>
				{/*<TextField*/}
				{/*	placeholder={format("onboarding.personal_info.placeholder.text")}*/}
				{/*	value={lastName}*/}
				{/*	title={format("onboarding.personal_info.lastname_title")}*/}
				{/*	onValueChanged={setLastName}*/}
				{/*	returnKeyType={"next"}*/}
				{/*/>*/}
			</InfoBlock>
			<InfoBlock>
				{/*<TextField*/}
				{/*	placeholder={format("onboarding.personal_info.placeholder.text")}*/}
				{/*	value={country}*/}
				{/*	title={format("onboarding.personal_info.country_title")}*/}
				{/*	onValueChanged={setCountry}*/}
				{/*/>*/}
			</InfoBlock>
			<InfoBlock>
				{/*<TextField*/}
				{/*	placeholder={format("onboarding.personal_info.placeholder.text")}*/}
				{/*	value={country}*/}
				{/*	title={format("onboarding.personal_info.country_title")}*/}
				{/*	onValueChanged={setCountry}*/}
				{/*/>*/}
			</InfoBlock>
			<Grow />
			<ButtonContainer>
				<StyledSimpleTextButton onPress={navigation.goBack}>{format("global.back")}</StyledSimpleTextButton>
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

const StyledBackButton = styled(BackButton)`
	position: absolute;
	left: 20px;
	top: 30px;
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
	margin-bottom: 16px;
`;

const BornDateContainer = styled.View`
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	width: 100%;
	padding: 0 8px;
	height: 30px;
	flex-direction: row;
	align-items: center;
`;

const BornText = styled.Text<{ isPlaceholder: boolean }>`
	font-size: 12px;
	color: ${({ isPlaceholder }) => (isPlaceholder ? colors.textPlaceholder : colors.textPrimary)};
`;

const SexButtons = styled.View`
	flex-direction: row;
	align-items: center;
`;

const ButtonContainer = styled.View`
	width: 100%;
	margin: 30px 0;
	flex-direction: row;
	justify-content: space-between;
`;

const StyledSimpleTextButton = styled(SimpleTextButton)`
	text-decoration: none;
`;
