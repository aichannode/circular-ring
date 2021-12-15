import { Row, Stack } from "@ui/components/layout";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";
import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { CircleEntity } from "../../../domain/circles/type";
// import { useCircles } from "@domain/circles/hooks";

interface CircleInfo {
	id: number;
	route: Routes;
	source: number;
	key: WordingKey;
}

// const circles: CircleInfo[] = [
// 	{	
// 		id: 0,
// 		route: Routes.CircleAdd, 
// 		source: require("@assets/images/circleAdd.png"),
// 		key: "home.circles.add.label",
// 	},
// 	{
// 		id: 1,
// 		route: Routes.Alarm,
// 		source: require("@assets/images/circleAlarm.png"),
// 		key: "home.circles.alarm.label",
// 	},
		
// 	{
// 		id: 2,
// 		route: Routes.Sleep,
// 		source: require("@assets/images/circleSleep.png"),
// 		key: "home.circles.sleep.label",
// 	},
// 	{
// 		id: 3,
// 		route: Routes.Activity,
// 		source: require("@assets/images/circleActivity.png"),
// 		key: "home.circles.activity.label",
// 	},
// 	{
// 		id: 4,
// 		route: Routes.Live,
// 		source: require("@assets/images/circleLive.png"),
// 		key: "home.circles.live.label",
// 	},
// ];
interface CirclesProps {
	style?: StyleProp<ViewStyle>;
}
export const CirclesBanner: React.FC<CirclesProps> = ({ style }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();

	const { circlesService } = useServices()

	const circles = useObservable(circlesService.circles)
	const addCircle: CircleEntity =	{	
			id: 0,
			route: Routes.CircleAdd, 
			source: require("@assets/images/circleAdd.png"),
			key: "home.circles.add.label",
			on: true,
			desc: "home.circles.alarm.description",
			type: ""
		}

	const circlesBanner = [addCircle].concat(circles)

	return (
		<Container style={style} gap={15}>
			<TitleText style={{paddingLeft: 10}}>{format("home.circles.title")}</TitleText>
			<Row align="flex-start" gap={3}>
				{circlesBanner.map((circle) => (
					circle.on ?
					<CircleView key={circle.route} onPress={() => navigation.navigate(circle.route)}>
						<Stack gap={10} align="center">
							<Image source={circle.source} />
							<CircleLabel>{format(circle.key)}</CircleLabel>
						</Stack>
					</CircleView>
					:
					null
					
				))}
			</Row>
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
