import { useServices } from "@core/services";
import { PrimaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native";
import styled from "styled-components/native";

export const LoginScreen = () => {
	const { format } = useI18n();
	const { userService } = useServices();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const performLogin = useCallback(async () => {
		if (email.length > 0 && password.length >= 4) {
			await userService.loginWithEmail(email, password);
		}
	}, [email, password]);

	return (
		<ScrollScreen>
			<Title>{format("login.title")}</Title>
			<InputField
				title={format("login.email.title")}
				placeholder={format("login.email.placeholder")}
				value={email}
				onValueChanged={setEmail}
				blurOnSubmit={false}
				onSubmit={() => passwordFieldRef.current?.focus()}
			/>
			<InputField
				ref={passwordFieldRef}
				title={format("login.password.title")}
				placeholder={format("login.password.placeholder")}
				canBeSecure
				value={password}
				onValueChanged={setPassword}
				blurOnSubmit={true}
			/>
			<ButtonContainer>
				<PrimaryButton onPress={performLogin}>{format("login.login_button")}</PrimaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Title = styled.Text`
	${textStyles.titleMedium};
	margin-top: 100px;
	margin-bottom: 50px;
`;

const InputField = styled(TextField)`
	margin-bottom: 40px;
`;

const ButtonContainer = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 80px;
	margin-bottom: 40px;
`;
