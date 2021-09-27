import { colors } from "@ui/styles/colors";
import React, { useEffect, useState } from "react";
import { Pressable, StyleProp, TextStyle } from "react-native";
import styled from "styled-components/native";

interface HourProps {
	value: Date;
	is24Hour?: boolean;
	style?: StyleProp<TextStyle>;
	onPress?: () => void;
}
export const Hour: React.FC<HourProps> = ({ value, is24Hour = false, style, onPress }) => {
	const [timeType, setTimeType] = useState("");
	let hour = value.getHours();
	const minutes = value.getMinutes();
	const [formatedTime, setFormatedTime] = useState("");

	useEffect(() => {
		if (!is24Hour) {
			if (hour <= 11) {
				setTimeType("AM");
			} else {
				setTimeType("PM");
				hour = hour - 12;
			}
			if (hour == 0) {
				hour = 12;
			}
			setFormatedTime(
				(hour < 10 ? "0" + hour : hour) + " : " + (minutes < 10 ? "0" + minutes.toString() : minutes) + " " + timeType
			);
		} else {
			setFormatedTime((hour < 10 ? "0" + hour : hour) + " : " + (minutes < 10 ? "0" + minutes : minutes));
		}
	}, [value, timeType]);

	return <Pressable onPress={onPress}>{<Time style={style}>{`${formatedTime}`}</Time>}</Pressable>;
};

const Time = styled.Text`
	font-size: 18px;
	font-weight: 700;
	color: ${colors.textPrimary};
`;
