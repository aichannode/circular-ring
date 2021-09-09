import { TextField } from "@ui/components/textField";
import React, { useRef, useState } from "react";
import { StyleProp, TextInput, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface Props {
	style?: StyleProp<ViewStyle>;
	onSubmit: () => void;
}

export const SixDigitInput: React.FC<Props> = (props: Props) => {
	const [code1, setCode1] = useState("0");
	const [code2, setCode2] = useState("0");
	const [code3, setCode3] = useState("0");
	const [code4, setCode4] = useState("0");
	const [code5, setCode5] = useState("0");
	const [code6, setCode6] = useState("0");

	const codeFieldRef = [
		useRef<TextInput | null>(null),
		useRef<TextInput | null>(null),
		useRef<TextInput | null>(null),
		useRef<TextInput | null>(null),
		useRef<TextInput | null>(null),
	];

	return (
		<FlexRow style={props.style}>
			<InputField
				selection={{ start: 0, end: 1 }}
				selectTextOnFocus={true}
				value={code1}
				onValueChanged={(value) => {
					setCode1(value);
					codeFieldRef[0].current?.focus();
				}}
				maxLength={1}
				fontSize={22}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[0]}
				selectTextOnFocus={true}
				selection={{ start: 0, end: 1 }}
				value={code2}
				onValueChanged={(value) => {
					setCode2(value);
					codeFieldRef[1].current?.focus();
				}}
				maxLength={1}
				fontSize={22}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[1]}
				selectTextOnFocus={true}
				selection={{ start: 0, end: 1 }}
				value={code3}
				onValueChanged={(value) => {
					setCode3(value);
					codeFieldRef[2].current?.focus();
				}}
				maxLength={1}
				fontSize={22}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[2]}
				selectTextOnFocus={true}
				selection={{ start: 0, end: 1 }}
				value={code4}
				onValueChanged={(value) => {
					setCode4(value);
					codeFieldRef[3].current?.focus();
				}}
				maxLength={1}
				fontSize={22}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[3]}
				selectTextOnFocus={true}
				selection={{ start: 0, end: 1 }}
				value={code5}
				onValueChanged={(value) => {
					setCode5(value);
					codeFieldRef[4].current?.focus();
				}}
				maxLength={1}
				fontSize={22}
				keyboardType={"numeric"}
			/>
			<InputField
				ref={codeFieldRef[4]}
				selectTextOnFocus={true}
				selection={{ start: 0, end: 1 }}
				value={code6}
				onValueChanged={(value) => setCode6(value)}
				onSubmit={() => props.onSubmit()}
				blurOnSubmit={true}
				maxLength={1}
				fontSize={22}
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

const InputField = styled(TextField)`
	flex: 1;
	padding-horizontal: 8px;
`;
