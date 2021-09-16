import { replaceInArray } from "@core/utils";
import { colors } from "@ui/styles/colors";
import React, { useEffect, useRef } from "react";
import { StyleProp, TextInput, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface SixDigitInputProps {
	style?: StyleProp<ViewStyle>;
	codeValue: readonly string[];
	onCodeChanged: (code: readonly string[]) => void;
}

export const SixDigitInput = (props: SixDigitInputProps) => {
	const { style, codeValue, onCodeChanged } = props;

	const codeFieldRef = [
		useRef<TextInput | null>(null), // code1
		useRef<TextInput | null>(null), // code2
		useRef<TextInput | null>(null), // code3
		useRef<TextInput | null>(null), // code4
		useRef<TextInput | null>(null), // code5
		useRef<TextInput | null>(null), // code6
	];

	useEffect(() => {
		if (codeValue === ["", "", "", "", "", ""]) {
			codeFieldRef[0].current?.focus();
		}
	}, codeValue);

	return (
		<FlexRow style={style}>
			<InputField
				ref={codeFieldRef[0]}
				selectTextOnFocus={true}
				value={codeValue[0]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 0, value));
					if (value.length === 1) {
						codeFieldRef[1].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[1]}
				selectTextOnFocus={true}
				value={codeValue[1]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 1, value));
					if (value.length === 1) {
						codeFieldRef[2].current?.focus();
					}
				}}
				onKeyPress={(e) => {
					if (codeValue[1] === "" && e.nativeEvent.key === "Backspace") {
						onCodeChanged(replaceInArray(codeValue, 0, ""));
						codeFieldRef[0].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[2]}
				selectTextOnFocus={true}
				value={codeValue[2]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 2, value));
					if (value.length === 1) {
						codeFieldRef[3].current?.focus();
					}
				}}
				onKeyPress={(e) => {
					if (codeValue[2] === "" && e.nativeEvent.key === "Backspace") {
						onCodeChanged(replaceInArray(codeValue, 1, ""));
						codeFieldRef[1].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[3]}
				selectTextOnFocus={true}
				value={codeValue[3]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 3, value));
					if (value.length === 1) {
						codeFieldRef[4].current?.focus();
					}
				}}
				onKeyPress={(e) => {
					if (codeValue[3] === "" && e.nativeEvent.key === "Backspace") {
						onCodeChanged(replaceInArray(codeValue, 2, ""));
						codeFieldRef[2].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[4]}
				selectTextOnFocus={true}
				value={codeValue[4]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 4, value));
					if (value.length === 1) {
						codeFieldRef[5].current?.focus();
					}
				}}
				onKeyPress={(e) => {
					if (codeValue[4] === "" && e.nativeEvent.key === "Backspace") {
						onCodeChanged(replaceInArray(codeValue, 3, ""));
						codeFieldRef[3].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[5]}
				selectTextOnFocus={true}
				value={codeValue[5]}
				onChangeText={(value) => {
					onCodeChanged(replaceInArray(codeValue, 5, value));
				}}
				onKeyPress={(e) => {
					if (codeValue[5] === "" && e.nativeEvent.key === "Backspace") {
						onCodeChanged(replaceInArray(codeValue, 4, ""));
						codeFieldRef[4].current?.focus();
					}
				}}
				blurOnSubmit={true}
				maxLength={1}
				keyboardType={"numeric"}
			/>
		</FlexRow>
	);
};

const FlexRow = styled.View`
	flex-direction: row;
	flex-grow: 1;
	align-items: center;
	justify-content: space-around;
`;

const InputField = styled(TextInput)`
	font-size: 22px;
	min-width: 18px;
	text-align: center;
	margin-right: 8px;
	margin-left: 8px;
	padding: 6px 0;
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	color: ${colors.textPrimary};
`;
