import { textStyles } from "@ui/styles/textStyles";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

interface HourProps {
	value: Date;
	onPress?: () => void;
}
export const Hour: React.FC<HourProps> = ({ value, onPress }) => {
	const [timeType, setTimeType] = useState("");
	let hour = value.getHours();
	const minutes = value.getMinutes();
	const [formatedTime, setFormatedTime] = useState("");

	useEffect(() => {
		if (hour <= 11) {
			setTimeType("AM");
		} else {
			setTimeType("PM");
			hour = hour - 12;
		}
		if (hour == 0) {
			hour = 12;
		}
		setFormatedTime(hour + " : " + (minutes < 10 ? "0" + minutes.toString() : minutes) + " " + timeType);
	}, [value, timeType]);

	return <Pressable onPress={onPress}>{<Time>{`${formatedTime}`}</Time>}</Pressable>;
};

const Time = styled.Text`
	${textStyles.bigTitle};
	font-size: 30px;
`;
