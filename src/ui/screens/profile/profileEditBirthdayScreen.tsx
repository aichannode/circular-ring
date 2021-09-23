import { useServices } from "@core/services";
import { useUser } from "@domain/user/hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { TextInputMask } from "react-native-masked-text";
import styled from "styled-components/native";

export const ProfileEditBirthdayScreen = () => {
	const user = useUser();

	if (!user) {
		return <></>;
	}

	const { format } = useI18n();
	const { userService } = useServices();
	const navigation = useNavigation();

	const [birthday, setBirthday] = useState(dayjs(user.bornDate).format("DD/MM/YYYY"));
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveBirthday = useCallback(async (birthDate: dayjs.Dayjs) => {
		if (!birthDate.isSame(dayjs(user.bornDate), "day")) {
			setLoading(true);
			const bornDate = birthDate.toDate();
			try {
				await userService.updateUserInfo({ bornDate });
				setLoading(false);
				navigation.goBack();
			} catch (error) {
				setLoading(false);
				setErrorMessage(format("global.default_error"));
			}
		} else {
			navigation.goBack();
		}
	}, []);

	const checkAndSaveBirthday = useCallback(async () => {
		setErrorMessage("");
		if (birthday.length === 0) {
			setErrorMessage(format("onboarding.personal_info.error.born_date"));
		} else {
			const birthDate = dayjs(birthday, "DD/MM/YYYY", true);
			if (!birthDate.isValid() || birthDate.isAfter(dayjs())) {
				setErrorMessage(format("onboarding.personal_info.error.born_date_invalid"));
			} else {
				await saveBirthday(birthDate);
			}
		}
	}, [birthday]);

	return (
		<ScrollScreen contentContainerStyle={{ paddingTop: 100, alignItems: "center", paddingBottom: 100 }}>
			<ResponsiveCenterView>
				<Title>{format("profile_info.edit_birthday.title")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
				<EditionContainer>
					<InputTitle>{format("onboarding.personal_info.born_title")}</InputTitle>
					<BornDateContainer>
						<TextInputMask
							type={"datetime"}
							options={{
								format: "DD/MM/YYYY",
							}}
							placeholder={format("onboarding.personal_info.born_placeholder")}
							value={birthday}
							onChangeText={setBirthday}
							style={{ padding: 0, width: "100%" }}
							autoFocus={true}
						/>
					</BornDateContainer>
				</EditionContainer>
			</ResponsiveCenterView>
			<Grow />
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={checkAndSaveBirthday}>{format("global.save")}</PrimaryButton>
				)}
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const EditionContainer = styled.View`
	margin-top: 20px;
`;

const InputTitle = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	margin-bottom: 16px;
`;

const BornDateContainer = styled.View`
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	width: 100%;
	padding: 0 8px;
	flex-direction: row;
	align-items: center;
`;

const ButtonContainer = styled.View`
	margin-top: 30px;
	align-items: center;
`;
