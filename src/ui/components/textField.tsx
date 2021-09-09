import { colors } from "@ui/styles/colors";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
	KeyboardTypeOptions,
	ReturnKeyTypeOptions,
	StyleProp,
	TextInput,
	TouchableWithoutFeedback,
	ViewStyle,
} from "react-native";
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
	keyboardType?: KeyboardTypeOptions;
	returnKeyType?: ReturnKeyTypeOptions;
	style?: StyleProp<ViewStyle>;
	selection?: { start: number; end: number };
	selectTextOnFocus?: boolean;
	fontSize?: number;
	keyboardType?:
		| "numeric"
		| "default"
		| "email-address"
		| "phone-pad"
		| "number-pad"
		| "decimal-pad"
		| "visible-password"
		| "ascii-capable"
		| "numbers-and-punctuation"
		| "url"
		| "name-phone-pad"
		| "twitter"
		| "web-search"
		| undefined;
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

	const eyeIcon = isSecure ? require("../../assets/images/eye_strike.png") : require("../../assets/images/eye.png");

	return (
		<Container style={props.style}>
			{props.title ? <Title>{props.title}</Title> : null}
			<InputView isError={props.isError ? props.isError : false}>
				<Field
					ref={inputRef}
					selection={props.selection}
					selectTextOnFocus={props.selectTxtOnFocus}
					style={{ fontSize: props.fontSize }}
					onChangeText={props.onValueChanged}
					onSubmitEditing={props.onSubmit}
					placeholderTextColor={colors.textPlaceholder}
					multiline={false}
					maxLength={props.maxLength}
					value={props.value}
					keyboardType={props.keyboardType}
					blurOnSubmit={props.blurOnSubmit}
					placeholder={props.placeholder}
					returnKeyType={props.returnKeyType}
					secureTextEntry={isSecure}
					keyboardType={props.keyboardType}
				/>
				{!!props.canBeSecure && (
					<TouchableWithoutFeedback onPress={() => setSecure(!isSecure)}>
						<SecureIconContainer>
							<Eye source={eyeIcon} />
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
	height: 30px;
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

const Eye = styled.Image`
	width: 24px;
	height: 24px;
	resize-mode: center;
`;
