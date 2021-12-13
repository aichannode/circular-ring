import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TextField, TextFieldRef } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ConfirmChangePasswordBottomSheet } from "@ui/screens/profile/confirmChangePasswordBottomSheet";
import { textStyles } from "@ui/styles/textStyles";
import { isCorrectPassword } from "@ui/utils/passwordUtils";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components/native";

export const ChangePasswordScreen = () => {
	const { format } = useI18n();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const currentPasswordRef = useRef<TextFieldRef | null>(null);
	const newPasswordRef = useRef<TextFieldRef | null>(null);
	const newPasswordChallengeRef = useRef<TextFieldRef | null>(null);

	const [isLoading, setLoading] = useState(false);

	const [errorMessage, setErrorMessage] = useState<string>("");

	const changePassword = async () => {
		try {
			setLoading(true);
			await userService.changePassword(currentPassword, newPassword);
			setErrorMessage("");
			confirmChangePasswordBottomSheetRef.current?.present();
		} catch (e: any) {
			if (e.code === "NotAuthorizedException") {
				setErrorMessage(format("change_password.current.error"));
			}
			else if (e.message) setErrorMessage(e.message);
			else setErrorMessage(format("login.error.default"));
		} finally {
			setLoading(false);
		}
	};

	const checkAndValidatePassword = useCallback(async () => {
		setErrorMessage("");
		if (currentPassword === newPassword) {
			setErrorMessage(format("change_password.error.same"))
		} else if (!isCorrectPassword(newPassword)) {
			setErrorMessage(format("signup.error.password_format"));
		} else if (newPassword !== confirmPassword) {
			setErrorMessage(format("signup.error.password_confirm"));
		} else {
			await changePassword();
		}
	}, [newPassword, confirmPassword]);

	const onClose = () => {
		confirmChangePasswordBottomSheetRef.current?.close();
		navigate(Routes.Profile);
	};

	const confirmChangePasswordBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	return (
		<ScrollScreen contentContainerStyle={{ paddingTop: 20, alignItems: "center", paddingBottom: 100 }}>
			<ResponsiveCenterView>
				<Title>{format("change_password.description")}</Title>
				
				<InputField
					title={format("change_password.current.title")}
					placeholder={format("change_password.current.placeholder")}
					canBeSecure
					value={currentPassword}
					onValueChanged={setCurrentPassword}
					autoCapitalize={"none"}
					blurOnSubmit={false}
					onSubmit={() => currentPasswordRef.current?.focus()}
				/>

				<InputField
					title={format("change_password.new.title")}
					placeholder={format("change_password.new.placeholder")}
					canBeSecure
					value={newPassword}
					onValueChanged={setNewPassword}
					autoCapitalize={"none"}
					blurOnSubmit={false}
					onSubmit={() => newPasswordRef.current?.focus()}
				/>
				<InputField
					ref={newPasswordChallengeRef}
					title={format("change_password.confirm.title")}
					placeholder={format("change_password.confirm.placeholder")}
					canBeSecure
					value={confirmPassword}
					onValueChanged={setConfirmPassword}
					autoCapitalize={"none"}
					blurOnSubmit={true}
				/>
			</ResponsiveCenterView>
			<Grow />
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<ButtonContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton key={"validate"} onPress={checkAndValidatePassword}>
						{format("global.save")}
					</PrimaryButton>
				)}
			</ButtonContainer>
			<CircularBottomSheet snapPoints={[250]} ref={confirmChangePasswordBottomSheetRef}>
				<ConfirmChangePasswordBottomSheet onClose={onClose} />
			</CircularBottomSheet>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-top: 60px;
	margin-bottom: 20px;
`;

const InputField = styled(TextField)`
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
