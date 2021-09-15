import { Row, Stack } from "@ui/components/layout";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation, Routes } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CirclesBannerProps {
	style?: StyleProp<ViewStyle>;
}
export const CirclesBanner: React.FC<CirclesBannerProps> = ({ style }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();

	return (
		<Container style={style} gap={15}>
			<TitleText>{format("home.circles.title")}</TitleText>
			<Row align="flex-start" gap={20}>
				<CircleView onPress={() => navigation.navigate(Routes.Activity)}>
					<Stack gap={10} align="center">
						<Image source={require("@assets/images/circleActivity.png")} />
						<CircleLabel>{format("home.circles.activity.label")}</CircleLabel>
					</Stack>
				</CircleView>
				<CircleView onPress={() => navigation.navigate(Routes.Alarm)}>
					<Stack gap={10} align="center">
						<Image source={require("@assets/images/circleAlarm.png")} />
						<CircleLabel>{format("home.circles.alarm.label")}</CircleLabel>
					</Stack>
				</CircleView>
			</Row>
		</Container>
	);
};

const Container = styled(Stack)`
	background-color: ${colors.white};
	padding: 15px 20px;
`;

const CircleLabel = styled(PrimaryText)`
	font-size: 12px;
	text-align: center;
`;

const CircleView = styled.Pressable`
	width: 60px;
`;
