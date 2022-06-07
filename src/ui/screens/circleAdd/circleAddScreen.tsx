import { useServices } from "@core/services";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { CircleEntity } from "@domain/circles/type";
import { mergeDefaultAndUserCirle } from "../business";

function createViews(myArray: CircleEntity[]) {
	const { circlesService } = useServices();
	const { format } = useI18n();
	return myArray.map((circle) => {
		const titleString = format(circle.name);
		const title = titleString.replace(/(\r\n|\n|\r)/gm, " ");
		return (
			<BoxContainer key={circle.id}>
				<InnerContainer>
					<Draggable source={circlesService.getIcon(circle.icon)}></Draggable>
					<RightContainer>
						<View style={{ flexDirection: "row", width: "100%" }}>
							<Bold>{title}</Bold>
							<TouchableOpacity
								style={{ padding: 10, marginTop: -10 }}
								onPress={() => circlesService.toggleCircle(circle.id)}
							>
								<Status>{circle.enabled ? "ON" : "OFF"}</Status>
							</TouchableOpacity>
						</View>
						<View>
							<Light>{format(circle.description)}</Light>
						</View>
					</RightContainer>
				</InnerContainer>
			</BoxContainer>
		);
	});
}

export const CircleAddScreen: React.FC = () => {
	const { appStateService } = useServices();
	const circles = mergeDefaultAndUserCirle(
		useObservable(appStateService.userCircles),
		useObservable(appStateService.defaultCircles)
	);
	const { format } = useI18n();

	const circlesVibration = circles.filter((circle) => circle.category === "cicle.category.vibration");
	const circlesWellness = circles.filter((circle) => circle.category === "cicle.category.wellness");
	const boxViewsWellness = createViews(circlesWellness);
	const boxViewsVibration = createViews(circlesVibration);
	return (
		<Container>
			<View style={{ borderBottomWidth: 0.25, borderColor: colors.gray }}>
				<PageTile>{format("circle.title")}</PageTile>
			</View>
			<TypeTile>{format("cicle.category.vibration")}</TypeTile>
			{boxViewsVibration}
			<TypeTile>{format("cicle.category.wellness")}</TypeTile>
			{boxViewsWellness}
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding-top: 0;
	width: 100%;
`;

const BoxContainer = styled(View)`
	width: 100%;
	border-radius: 8px;
	overflow: hidden;
	margin-bottom: 1px;
`;

const InnerContainer = styled.View`
	flex-direction: row;
	background-color: ${colors.lightgray};
	align-items: center;
`;

const RightContainer = styled.View`
	flex: 1;
	margin-right: 20px;
`;

const PageTile = styled.Text`
	font-size: 18px;
	font-weight: 500;
	margin-left: 15px;
	justify-content: center;
	margin-vertical: 20px;
`;

const TypeTile = styled.Text`
	font-size: 18px;
	font-weight: 500;
	margin-left: 15px;
	margin-vertical: 20px;
`;

const Status = styled.Text`
	color: ${colors.gray};
	font-size: 14px;
	text-align: right;
	width: 100%;
`;

const Draggable = styled.Image`
	margin-vertical: 19px;
	margin-left: 20px;
	margin-right: 20px;
`;

const Bold = styled.Text`
	font-size: 18px;
	padding-bottom: 5px;
	font-weight: 500;
	width: 90%;
`;

const Light = styled.Text`
	color: ${colors.gray};
	font-size: 14px;
	padding-top: 5px;
`;
