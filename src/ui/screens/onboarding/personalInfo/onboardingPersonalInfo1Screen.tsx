import { useNavigation } from "@react-navigation/native";
import { SimpleTextButton } from "@ui/components/buttons";
import { CountryField } from "@ui/components/countryField";
import { Grow } from "@ui/components/layout";
import { BackButton } from "@ui/components/navigation/backButton";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField, TextFieldRef } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components/native";
import * as RNLocalize from "react-native-localize";

export const OnboardingPersonalInfo1Screen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const navigation = useNavigation();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [country, setCountry] = useState(RNLocalize.getCountry());
	const [errorMessage, setErrorMessage] = useState("");

	const firstNameRef = useRef<TextFieldRef | null>(null);
	const lastNameRef = useRef<TextFieldRef | null>(null);

	const goNext = useCallback(() => {
		if (firstName.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.firstname"));
		} else if (lastName.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.lastname"));
		} else if (country.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.country"));
		} else {
			navigate(Routes.OnboardingPersonalInfo2, { firstName, lastName, country });
		}
	}, [firstName, lastName, country]);

	return (
		<StyledScrollScreen>
			<TopContainer>
				<StyledBackButton />
				<Title>{format("onboarding.personal_info.title")}</Title>
			</TopContainer>
			<InfoBlock>
				<TextField
					ref={firstNameRef}
					placeholder={format("onboarding.personal_info.placeholder.text")}
					value={firstName}
					title={format("onboarding.personal_info.firstname_title")}
					onValueChanged={setFirstName}
					returnKeyType={"next"}
					blurOnSubmit={false}
					onSubmit={() => lastNameRef.current?.focus()}
				/>
			</InfoBlock>
			<InfoBlock>
				<TextField
					ref={lastNameRef}
					placeholder={format("onboarding.personal_info.placeholder.text")}
					value={lastName}
					title={format("onboarding.personal_info.lastname_title")}
					onValueChanged={setLastName}
					returnKeyType={"next"}
					blurOnSubmit={true}
				/>
			</InfoBlock>
			<InfoBlock>
				<CountryField
					title={format("onboarding.personal_info.country_title")}
					onCountryCodeChanged={setCountry}
					placeholder={format("onboarding.personal_info.country_placeholder")}
					countryCode={country}
				/>
			</InfoBlock>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<Grow />
			<ButtonContainer>
				<StyledSimpleTextButton onPress={navigation.goBack}>{format("global.back")}</StyledSimpleTextButton>
				<StyledSimpleTextButton onPress={goNext}>{format("global.next")}</StyledSimpleTextButton>
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

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
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
