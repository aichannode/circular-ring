import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CircleCalendarButtonProps {
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
	currentDay: string;
}

export const CircleCalendarButton: React.FC<CircleCalendarButtonProps> = ({ currentDay, onPress, style }) => {
	const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
	const { format, formatDate } = useI18n();
	const currDay = formatDate(new Date(currentDay));

	return (
		<Container onPress={onPress} style={style}>
			<CalendarIconWrapper>
				<Image
					style={{ tintColor: colors.darkGray, width: 16, height: 16 }}
					source={require("@assets/images/calendar.png")}
				/>
			</CalendarIconWrapper>
			<CurrentDay>{currentDay === today ? format("today") : currDay}</CurrentDay>
		</Container>
	);
};

const Container = styled.Pressable`
	align-items: center;
`;

const CalendarIconWrapper = styled.View`
	${roundedWhiteCardStyle};
	padding: 8px;
	align-items: center;
	justify-content: center;
	margin-bottom: 2px;
`;

const CurrentDay = styled.Text`
	font-size: 10px;
	color: ${colors.darkGray};
	width: 60px;
	text-align: center;
`;
