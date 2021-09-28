import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React from "react";
import { Pressable, StyleProp, TextStyle } from "react-native";
import styled from "styled-components/native";

interface HourProps {
	value: Date;
	is24Hour?: boolean;
	style?: StyleProp<TextStyle>;
	onPress?: () => void;
}
export const Hour: React.FC<HourProps> = ({ value, is24Hour = false, style, onPress }) => {
	return (
		<Pressable onPress={onPress}>
			{<Time style={style}>{`${is24Hour ? dayjs(value).format("HH : mm") : dayjs(value).format("hh : mm A")}`}</Time>}
		</Pressable>
	);
};

const Time = styled.Text`
	font-size: 18px;
	font-weight: 700;
	color: ${colors.textPrimary};
`;
