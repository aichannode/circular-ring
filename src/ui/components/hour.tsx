import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Pressable, StyleProp, TextStyle } from "react-native";
import styled from "styled-components/native";

interface HourProps {
	value: Date;
	style?: StyleProp<TextStyle>;
	onPress?: () => void;
}
export const Hour: React.FC<HourProps> = ({ value, style, onPress }) => {
	const { formatHour } = useI18n();
	return (
		<Pressable onPress={onPress}>
			<Time style={style}>{formatHour(value)}</Time>
		</Pressable>
	);
};

const Time = styled.Text`
	font-size: 18px;
	font-weight: 700;
	color: ${colors.textPrimary};
`;
