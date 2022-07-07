import { colors } from "@ui/styles/colors";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface StreakBadgeProps {
	leaderboardRank: string;
	streak: number;
}

export const StreakBadge = ({ leaderboardRank, streak }: StreakBadgeProps) => {
	return (
		<Gradient colors={[...colors.gradient.orange]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.5 }}>
			<Division>
				<LightText>Rank</LightText>
			</Division>
			<Division>
				<LightText>Best Streak</LightText>
			</Division>
			<Division>
				<BoldText>{leaderboardRank}</BoldText>
			</Division>
			<Division>
				<StarContainer>
					<Star resizeMode="contain" source={require("@assets/images/starGold.png")}></Star>
					<BoldText>{streak} days</BoldText>
				</StarContainer>
			</Division>
			<Medal resizeMode="contain" source={require("@assets/images/medal.png")}></Medal>
			<LittleVerticalBar />
		</Gradient>
	);
};

// user.lifetime.best.streak

const StarContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const LittleVerticalBar = styled.View`
	height: 28px;
	width: 0px;
	border: 0.25px solid white;
	position: absolute;
	right: 50%;
	top: 55px;
`;

const Star = styled.Image`
	width: 20px;
	height: 20px;
	margin-right: 5px;
	margin-top: 2px;
`;

const Medal = styled.Image`
	position: absolute;
	top: -30px;
	width: 100%;
`;

const Gradient = styled(LinearGradient)`
	width: 300px;
	height: 100px;
	border-radius: 10px;
	margin-bottom: 15px;
	margin-top: 25px;
	display: flex;
	flex-direction: row;
	flex-flow: wrap;
`;

const Division = styled.View`
	width: 50%;
	height: 50%;
	justify-content: center;
`;

const LightText = styled.Text`
	text-align: center;
	color: ${colors.white};
	padding-top: 15px;
	font-size: 16px;
`;

const BoldText = styled.Text`
	text-align: center;
	color: ${colors.white};
	font-weight: 700;
	padding-bottom: 15px;
	font-size: 18px;
`;
