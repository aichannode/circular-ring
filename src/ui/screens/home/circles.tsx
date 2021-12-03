import { Row, Stack } from "@ui/components/layout";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

interface CircleInfo {
	route: Routes;
	source: number;
	key: WordingKey;
}

const circles: CircleInfo[] = [
	{
		route: Routes.Alarm,
		source: require("@assets/images/circleAlarm.png"),
		key: "home.circles.alarm.label",
	},
	{
		route: Routes.Sleep,
		source: require("@assets/images/circleSleep.png"),
		key: "home.circles.sleep.label",
	},
	{
		route: Routes.Activity,
		source: require("@assets/images/circleActivity.png"),
		key: "home.circles.activity.label",
	},
	{
		route: Routes.Live,
		source: require("@assets/images/circleLive.png"),
		key: "home.circles.live.label",
	},
];
interface CirclesProps {
	style?: StyleProp<ViewStyle>;
}
export const Circles: React.FC<CirclesProps> = ({ style }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();

	return (
		<Container style={style} gap={15}>
			<TitleText>{format("home.circles.title")}</TitleText>
			<Row align="flex-start" gap={4}>
				{circles.map((circle) => (
					<CircleView key={circle.route} onPress={() => navigation.navigate(circle.route)}>
						<Stack gap={10} align="center">
							<Image source={circle.source} />
							<CircleLabel>{format(circle.key)}</CircleLabel>
						</Stack>
					</CircleView>
				))}
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
	flex-wrap: wrap;
`;

const CircleView = styled.Pressable`
	width: 80px;
`;
