
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
	const boxViews = circles.map((circle, i) => {
		return (
			// eslint-disable-next-line react/jsx-key
				
				<BoxContainer key={i}>
					<InnerContainer>
						<Draggable source={circle.source}></Draggable>
						<RightContainer>
							<Title>{format(circle.key)}</Title>
							<TileDesc>{format(circle.desc)}</TileDesc>
						</RightContainer>
						<TouchableOpacity onPress={() => circlesService.toggleCircle(i)}>
							<Status>{circle.on ? "ON" : "OFF"}</Status>
						</TouchableOpacity>
							
						
						
					</InnerContainer>
				</BoxContainer>
									
			
		);
	})

	return(
		<Container>
			<PageTile>Add, delete or discover new circles</PageTile>
			{boxViews}
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
	margin-vertical: 8px;
	padding-left: 10px;
`;

const Title = styled.Text`
	font-size: 18px;
	color: black;
	font-weight: 500;
	margin-vertical: 4px;
`;


const TileDesc = styled.Text`
	color: ${colors.gray};

`;

const PageTile = styled.Text`
	font-size: 18px;
	color: black;
	font-weight: 500;
	margin-left: 15px;
	margin-vertical: 4px;
	
	
	
`;


const Status = styled.Text`
	color: ${colors.gray};
	margin-top: 4;
	margin-right: 4;
`;

const Draggable = styled.Image`
	
	margin-vertical: 22px;
`;
// const ElementStack = styled(Stack)`
// 	padding: 25px 20px;
// 	background-color: ${colors.lightgray};
// `;
// const Tile = styled.View`
// 	flex: 1;
// 	height: 50px;
// 	justify-content: center;
// 	border-right-width: 0.25px;
// 	border-left-width: 0.25px;
// 	border-color: ${colors.gray};
// `;
// const Bold = styled.Text`
// 	text-align: center;
// 	font-size: 14px;
// `;