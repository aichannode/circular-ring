import { PrimaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TextField } from "@ui/components/textField";
import { useI18n } from "@ui/i18n";
import { screenStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import styled from "styled-components/native";

export const LoginScreen = () => {
	const { format } = useI18n();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const passwordFieldRef = useRef<TextInput | null>(null);

	const performLogin = useCallback(() => {
		if (email.length > 0 && password.length >= 4) {
			// TODO
		}
	}, []);

	return (
		<ScrollScreen>
			<Title>{format("login.title")}</Title>
			<InputField
				title={format("login.email.title")}
				placeholder={format("login.email.placeholder")}
				onValueChanged={setEmail}
				blurOnSubmit={false}
				onSubmit={() => passwordFieldRef.current?.focus()}
			/>
			<InputField
				inputRef={(ref) => (passwordFieldRef.current = ref)}
				title={format("login.password.title")}
				placeholder={format("login.password.placeholder")}
				canBeSecure
				onValueChanged={setPassword}
				blurOnSubmit={true}
			/>
			<ButtonContainer>
				<PrimaryButton onPress={performLogin}>{format("login.login_button")}</PrimaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const Container = styled.ScrollView`
	${screenStyle};
`;

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
