import { Row, Stack } from "@ui/components/layout";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { CircleEntity } from "../../../domain/circles/type";

interface CirclesProps {
	style?: StyleProp<ViewStyle>;
}

export const CirclesBanner: React.FC<CirclesProps> = ({ style }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();
	const { circlesService, userQuickAccessService } = useServices();
	const circles = useObservable(circlesService.circles);
	const isInSleepMode = useObservable(userQuickAccessService.isInSleepMode);
	const addCircle: CircleEntity = {
		id: 0,
		route: Routes.CircleAdd,
		source: require("@assets/images/circleAdd.png"),
		sleepModeIcon: require("@assets/images/circleAdd.png"),
		key: "home.circles.add.label",
		on: true,
		desc: "home.circles.alarm.description",
		type: "",
		canNavigateInSleepMode: true,
	};
	const circlesBanner = [addCircle].concat(circles);

	const circleNavigate = (circle: CircleEntity) => {
		if (!isInSleepMode) {
			navigation.navigate(circle.route);
		}
		if (isInSleepMode && circle.canNavigateInSleepMode) {
			navigation.navigate(circle.route);
		}
	};

	return (
		<Container style={style} gap={15}>
			<TitleText style={{ paddingLeft: 10 }}>{format("home.circles.title")}</TitleText>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				<Row align="flex-start" gap={0}>
					{circlesBanner.map((circle) =>
						circle.on ? (
							<CircleView key={circle.route} onPress={() => circleNavigate(circle)}>
								<Stack style={{ marginTop: circle.id === 0 ? -10 : 0 }} gap={circle.id === 0 ? -3 : 10} align="center">
									<Image source={isInSleepMode ? circle.sleepModeIcon : circle.source} />
									<CircleLabel>{format(circle.key)}</CircleLabel>
								</Stack>
							</CircleView>
						) : null
					)}
				</Row>
			</ScrollView>
		</Container>
	);
};

const Container = styled(Stack)`
	background-color: ${colors.white};
	padding: 15px 0px;
`;

const CircleLabel = styled(PrimaryText)`
	font-size: 12px;
	text-align: center;
	flex-wrap: wrap;
`;

const CircleView = styled.Pressable`
	width: 80px;
`;
