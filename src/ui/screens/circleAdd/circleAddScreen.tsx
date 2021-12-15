
import { Stack } from "@ui/components/layout";
import { Image, StyleProp, ViewStyle } from "react-native";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { useServices } from "@core/services";
// import { useCircles } from "@domain/circles/hooks";
import dayjs from "dayjs";
import React, { useRef, useState, useEffect } from "react";
import { LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { WordingKey } from "src/wordings";
import { TouchableOpacity } from "react-native";
import { useObservable } from "micro-observables";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";


// interface CirclesProps {
// 	style?: StyleProp<ViewStyle>;
// }



export const CircleAddScreen: React.FC = () => {
	const { circlesService } = useServices()
	
	const circles = useObservable(circlesService.circles)

	const { format } = useI18n();
	const circlesVibration = circles.filter((circle) => circle.type === "Vibration")
	const circlesWellness = circles.filter((circle) => circle.type === "Wellness")
	const boxViewsWellness = circlesWellness.map((circle, i) => {	

		const titleString = format(circle.key)
		const title = titleString.replace(/(\r\n|\n|\r)/gm," ");
		return (	
				<BoxContainer key={i}>
					<InnerContainer>
						<Draggable source={circle.source}></Draggable>
						<RightContainer>
							<Bold>{title}</Bold>
							<Light>{format(circle.desc)}</Light>
						</RightContainer>
						<TouchableOpacity onPress={() => circlesService.toggleCircle(circle.id)}>
							<Status>{circle.on ? "ON" : "OFF"}</Status>
						</TouchableOpacity>		
					</InnerContainer>
				</BoxContainer>	
		);
	})

	const boxViewsVibration = circlesVibration.map((circle, i) => {

		const titleString = format(circle.key)
		const title = titleString.replace(/(\r\n|\n|\r)/gm," ");

		return (	
				<BoxContainer key={i}>
					<InnerContainer>
						<Draggable source={circle.source}></Draggable>
						<RightContainer>
							<Bold>{title}</Bold>
							<Light>{format(circle.desc)}</Light>
						</RightContainer>
						<TouchableOpacity onPress={() => circlesService.toggleCircle(circle.id)}>
							<Status>{circle.on ? "ON" : "OFF"}</Status>
						</TouchableOpacity>		
					</InnerContainer>
				</BoxContainer>	
		);
	})

	return(
		<Container>
			<View style={{borderBottomWidth: 0.25, borderColor: colors.gray}}>
				<PageTile>Add, delete or discover new circles</PageTile>
			</View>			
			<TypeTile>Vibration</TypeTile>
			{boxViewsVibration}
			<TypeTile>Wellness</TypeTile>
			{boxViewsWellness}
			
		</Container>
	)

	
};

const Container = styled(ScrollScreen)`
	padding-top: 20px;
	background-color: ${colors.white};
	width: 100%;
`;

const BoxContainer = styled(View)`
	
	width: 100%;
	border-radius: 8px;
	overflow: hidden;	
	margin: 0;
	padding: 0px 2px;
`;

const InnerContainer = styled.View`
	display: flex;
	flex-direction: row;
	background-color: ${colors.lightgray};
	padding-left: 10px;
	margin-bottom: 1px;
`;

const RightContainer = styled.View`
	flex: 1;	
	border-left-color: ${colors.gray};
	justify-content: center;
	padding-left: 10px;
`;

const Title = styled.Text`
	font-size: 18px;
	color: black;
	font-weight: 500;
	margin-vertical: 4px;
`;


const PageTile = styled.Text`
	font-size: 18px;	
	font-weight: 500;
	margin-left: 15px;
	margin-vertical: 20px;
	border-bottom-width: 1px;
`;

const TypeTile = styled.Text`
	font-size: 18px;	
	font-weight: 500;
	margin-left: 15px;
	margin-vertical: 20px;
`;


const Status = styled.Text`
	color: ${colors.gray};
	margin-top: 4;
	margin-right: 4;
`;

const Draggable = styled.Image`	
	margin-vertical: 22px;
`;

const Bold = styled.Text`	
	font-size: 14px;
	paddingBottom: 5px;
	font-weight: 500,
`;

const Light = styled.Text`
	color: ${colors.gray};	
	font-size: 12px;
	paddingTop: 5px
`;


