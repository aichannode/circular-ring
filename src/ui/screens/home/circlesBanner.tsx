import { Row, Stack } from "@ui/components/layout";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useServices } from "@core/services";
import { CircleEntity } from "@domain/circles/type";
import { useSleepMode, useCircles } from "@domain/appState/appStateHooks";

interface CirclesProps {
	style?: StyleProp<ViewStyle>;
}

export const CirclesBanner: React.FC<CirclesProps> = ({ style }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();
	const { circlesService } = useServices();
	const circles = useCircles();
	const isInSleepMode = useSleepMode();
	const addCircle: CircleEntity = {
		id: 0,
		route: Routes.CircleAdd,
		icon: { icon: "@assets/images/circleAdd.png", type: "LOCAL", id: 0 },
		sleepModeIcon: { icon: "@assets/images/circleAdd.png", type: "LOCAL", id: 0 },
		name: "home.circles.add.label",
		enabled: true,
		description: "home.circles.alarm.description",
		category: "home.circles.alarm.description",
		canNavigateInSleepMode: true,
		default: true,
		order: 0,
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
					{circlesBanner.map((circle, key) =>
						circle.enabled ? (
							<CircleView key={key} onPress={() => circleNavigate(circle)}>
								<Stack style={{ marginTop: circle.id === 0 ? -10 : 0 }} gap={circle.id === 0 ? -3 : 10} align="center">
									<Image
										resizeMode="center"
										style={{ borderWidth: 1 }}
										source={
											isInSleepMode ? circlesService.getIcon(circle.sleepModeIcon) : circlesService.getIcon(circle.icon)
										}
									/>
									<CircleLabel>{format(circle.name)}</CircleLabel>
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
