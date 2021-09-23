import { useServices } from "@core/services";
import { useUser } from "@domain/user/hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TextField, TextFieldRef } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

export const ProfileEditNameScreen = () => {
	const user = useUser();

	if (!user) {
		return <></>;
	}

	const { format } = useI18n();
	const { userService } = useServices();
	const navigation = useNavigation();

	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName);
	const [errorMessage, setErrorMessage] = useState("");

	const firstNameRef = useRef<TextFieldRef | null>(null);
	const lastNameRef = useRef<TextFieldRef | null>(null);

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		firstNameRef.current?.focus();
	}, []);

	const submitNames = useCallback(async () => {
		setErrorMessage("");
		if (firstName.length === 0) {
			setErrorMessage("onboarding.personal_info.error.firstname");
		} else if (lastName.length === 0) {
			setErrorMessage("onboarding.personal_info.error.lastname");
		} else if (firstName !== user.firstName || lastName !== user.lastName) {
			setLoading(true);
			try {
				await userService.updateUserInfo({ firstName, lastName });
				setLoading(false);
				navigation.goBack();
			} catch (error) {
				setLoading(false);
				setErrorMessage(format("onboarding.personal_info.error.default"));
			}
		} else {
			navigation.goBack();
		}
	}, [firstName, lastName]);

	return (
		<ScrollScreen contentContainerStyle={{ paddingTop: 100, alignItems: "center", paddingBottom: 100 }}>
			<ResponsiveCenterView>
				<Title>{format("profile_info.edit_name.title")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
				<StyledTextField
					ref={firstNameRef}
					placeholder={format("onboarding.personal_info.placeholder.text")}
					title={format("onboarding.personal_info.firstname_title")}
					value={firstName}
					onValueChanged={setFirstName}
					returnKeyType={"next"}
					blurOnSubmit={false}
					onSubmit={() => lastNameRef.current?.focus()}
				/>
				<StyledTextField
					ref={lastNameRef}
					placeholder={format("onboarding.personal_info.placeholder.text")}
					title={format("onboarding.personal_info.lastname_title")}
					value={lastName}
					onValueChanged={setLastName}
					returnKeyType={"next"}
					blurOnSubmit={true}
				/>
			</ResponsiveCenterView>
			<Grow />
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={submitNames}>{format("global.save")}</PrimaryButton>
				)}
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
`;

const StyledTextField = styled(TextField)`
	margin-top: 20px;
	margin-bottom: 20px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const ButtonContainer = styled.View`
	margin-top: 30px;
	align-items: center;
`;
