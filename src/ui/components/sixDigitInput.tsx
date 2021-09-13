import { colors } from "@ui/styles/colors";
import React, { useCallback, useRef, useState } from "react";
import { StyleProp, TextInput, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface Props {
	style?: StyleProp<ViewStyle>;
	onSubmit: (code: string) => void;
}

export const SixDigitInput: React.FC<Props> = (props: Props) => {
	const [code1, setCode1] = useState("");
	const [code2, setCode2] = useState("");
	const [code3, setCode3] = useState("");
	const [code4, setCode4] = useState("");
	const [code5, setCode5] = useState("");
	const [code6, setCode6] = useState("");

	const codeFieldRef = [
		useRef<TextInput | null>(null), // code2
		useRef<TextInput | null>(null), // code3
		useRef<TextInput | null>(null), // code4
		useRef<TextInput | null>(null), // code5
		useRef<TextInput | null>(null), // code6
	];

	const submitCode = useCallback(() => {
		props.onSubmit?.([code1, code2, code3, code4, code5, code6].join(""));
	}, [code1, code2, code3, code4, code5, code6]);

	return (
		<FlexRow style={props.style}>
			<InputField
				selectTextOnFocus={true}
				value={code1}
				onChangeText={(value) => {
					setCode1(value);
					if (value.length === 1) {
						codeFieldRef[0].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[0]}
				selectTextOnFocus={true}
				value={code2}
				onChangeText={(value) => {
					setCode2(value);
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
				value={code3}
				onChangeText={(value) => {
					setCode3(value);
					if (value.length === 1) {
						codeFieldRef[2].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[2]}
				selectTextOnFocus={true}
				value={code4}
				onChangeText={(value) => {
					setCode4(value);
					if (value.length === 1) {
						codeFieldRef[3].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[3]}
				selectTextOnFocus={true}
				value={code5}
				onChangeText={(value) => {
					setCode5(value);
					if (value.length === 1) {
						codeFieldRef[4].current?.focus();
					}
				}}
				maxLength={1}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[4]}
				selectTextOnFocus={true}
				value={code6}
				onChangeText={(value) => {
					setCode6(value);
					if (value.length === 1) {
						submitCode();
					}
				}}
				onSubmitEditing={submitCode}
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
`;

const InputField = styled(TextInput)`
	font-size: 22px;
	text-align: center;
	margin-right: 8px;
	margin-left: 8px;
	padding: 6px 0;
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
`;
