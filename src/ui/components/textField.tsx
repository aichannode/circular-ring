import { colors } from "@ui/styles/colors";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleProp, TextInput, TouchableWithoutFeedback, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface TextFieldProps {
	title?: string;
	placeholder?: string;
	value: string;
	onValueChanged?: (value: string) => void;
	maxLength?: number;
	inputRef?: (input: TextInput | null) => void;
	onSubmit?: () => void;
	blurOnSubmit?: boolean;
	isError?: boolean;
	canBeSecure?: boolean;
	style?: StyleProp<ViewStyle>;
}

export interface TextFieldRef {
	focus: () => void;
}

export const TextField = forwardRef<TextFieldRef, TextFieldProps>((props: TextFieldProps, ref) => {
	const inputRef = useRef<TextInput | null>(null);

	const [isSecure, setSecure] = useState(!!props.canBeSecure);

	useImperativeHandle(ref, () => ({
		focus: () => {
			inputRef.current?.focus();
		},
	}));

	return (
		<Container style={props.style}>
			{props.title ? <Title>{props.title}</Title> : null}
			<InputView isError={props.isError ? props.isError : false}>
				<Field
					ref={inputRef}
					onChangeText={props.onValueChanged}
					onSubmitEditing={props.onSubmit}
					placeholderTextColor={colors.textPrimary}
					multiline={false}
					maxLength={props.maxLength}
					value={props.value}
					blurOnSubmit={props.blurOnSubmit}
					placeholder={props.placeholder}
					secureTextEntry={isSecure}
				/>
				{!!props.canBeSecure && (
					<TouchableWithoutFeedback onPress={() => setSecure(!isSecure)}>
						<SecureIconContainer>
							<Eye open={!isSecure} />
						</SecureIconContainer>
					</TouchableWithoutFeedback>
				)}
			</InputView>
		</Container>
	);
});

const Container = styled.View`
	width: 100%;
`;

const Title = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	margin-bottom: 16px;
`;

const InputView = styled.View<{ isError: boolean }>`
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	width: 100%;
	padding: 0;
`;

const Field = styled.TextInput`
	flex-grow: 1;
	padding: 0 8px;
	font-size: 12px;
	color: ${colors.textPrimary};
`;

const SecureIconContainer = styled.View`
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	width: 40px;
	align-items: center;
	justify-content: center;
`;

const Eye = styled.View<{ open: boolean }>`
	width: 24px;
	height: 24px;
	background-color: ${({ open }) => (open ? "green" : "red")};
`;
