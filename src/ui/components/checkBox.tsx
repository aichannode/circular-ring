import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { row } from "./layout";
import { SecondaryText } from "./text";

interface CheckBoxProps {
	value: boolean;
	onChange: (newValue: boolean) => void;
	label?: string;
	style?: StyleProp<ViewStyle>;
}
export const CheckBox: React.FC<CheckBoxProps> = ({ value, onChange, label, style }) => {
	return (
		<Container onPress={() => onChange(!value)} style={style}>
			<Wrapper>{value && <Checked source={require("@assets/images/checkSmall.png")} />}</Wrapper>
			{label ? <Label>{label}</Label> : null}
		</Container>
	);
};
const Container = styled.Pressable`
	${row("center")};
`;
// TODO COLOR
const Wrapper = styled.View`
	width: 20px;
	height: 20px;
	border: 1px solid #657884;
	border-radius: 2px;
	overflow: visible;
`;

const Checked = styled.Image`
	position: absolute;
	bottom: 0;
	left: 0;
`;

const Label = styled(SecondaryText)`
	margin-left: 9px;
`;
