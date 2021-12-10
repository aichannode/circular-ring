import { ScrollScreen } from "@ui/components/scrollScreen";
import React from "react";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "@ui/styles/colors";

interface I_Data {
	rank: number;
	firstname: string;
	lastname: string;
	score: number;
	progress: boolean;
	subscore: number;
	country?: string;
}

const data: I_Data[] = [
	{
		rank: 1,
		firstname: "William",
		lastname: "Doe",
		score: 99.78,
		progress: true,
		subscore: 45,
	},
	{
		rank: 2,
		firstname: "Rose",
		lastname: "Jose",
		score: 99.23,
		progress: true,
		subscore: 45,
		country: "france",
	},
	{
		rank: 3,
		firstname: "Gale",
		lastname: "Blue",
		score: 99.21,
		progress: false,
		subscore: 34,
		country: "france",
	},
	{
		rank: 4,
		firstname: "William",
		lastname: "Bowlow",
		score: 98.41,
		progress: false,
		subscore: 39,
		country: "france",
	},
	{
		rank: 5,
		firstname: "John",
		lastname: "Lee",
		score: 98.09,
		progress: true,
		subscore: 51,
		country: "france",
	},
	{
		rank: 6,
		firstname: "Simone",
		lastname: "Roger",
		score: 98.01,
		progress: true,
		subscore: 51,
		country: "france",
	},
	{
		rank: 7,
		firstname: "Elen",
		lastname: "Love",
		score: 97.99,
		progress: false,
		subscore: 32,
		country: "france",
	},
	{
		rank: 8,
		firstname: "Clara",
		lastname: "Ocean",
		score: 97.93,
		progress: true,
		subscore: 46,
		country: "france",
	},
];

const Tile = styled(LinearGradient)`
	width: 100%;
	height: 57px;
	border-radius: 10px;
	display: flex;
	flex-direction: row;
	margin-bottom: 10px;
`;

const Rank = styled.Text<{ color: string }>`
	font-size: 20px;
	font-weight: bold;
	margin-left: 14px;
	margin-vertical: 16px;
	color: ${(props) => props.color};
`;

const PictureContainer = styled.View`
	height: 33px;
	width: 33px;
	margin-vertical: 12px;
	margin-left: 14px;
	border: 1px solid grey;
	border-radius: 17px;
	overflow: hidden;
`;

const MiddleBottomContainer = styled.View`
	margin-top: 4px;
	display: flex;
	flex-direction: row;
`;

const MiddleTileContainer = styled.View`
	margin-vertical: 12px;
	margin-left: 15px;
	flex: 1;
`;

const UserName = styled.View`
	display: flex;
	flex-direction: row;
`;

const FirstName = styled.Text<{ color: string }>`
	font-size: 16px;
	color: ${(props) => props.color};
`;

const LastName = styled.Text<{ color: string }>`
	font-size: 16px;
	color: ${(props) => props.color};
	font-weight: bold;
	margin-left: 4px;
`;

const TileRightContainer = styled.View<{ color: string }>`
	width: 90px;
	margin-vertical: 5px;
	border-left-width: 0.5px;
	border-left-color: ${(props) => props.color};
	display: flex;
	flex-direction: row;
`;

const UserPic = styled.Image`
	height: 33px;
	width: 33px;
`;

const Star = styled.Image`
	height: 11px;
	width: 11px;
`;

const Country = styled.Image`
	height: 14px;
	width: 14px;
	margin-left: 13px;
	margin-top: -2px;
`;

const SubScore = styled.Text<{ color: string }>`
	font-size: 10px;
	color: ${(props) => props.color};
	margin-top: -2px;
	margin-left: 4px;
`;

const Arrow = styled.Image`
	height: 11px;
	width: 7px;
	margin-left: 11px;
	margin-top: 21px;
`;

const BoldScore = styled.Text<{ color: string }>`
	font-size: 20px;
	color: ${(props) => props.color};
	font-weight: bold;
	margin-left: 8px;
	margin-top: 12px;
`;

const LightScore = styled.Text<{ color: string }>`
	font-size: 14px;
	color: ${(props) => props.color};
	margin-top: 17px;
`;

const LeaderboardTile = ({ data, gradient, color }: { data: I_Data; gradient: boolean; color: string }) => {
	const { rank, firstname, lastname, score, progress, subscore } = data;

	return (
		<Tile
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0.5 }}
			colors={gradient ? [colors.orangeGradientStart, colors.orangeGradientEnd] : [colors.white, colors.white]}
			style={{
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,
				elevation: 5,
			}}
		>
			<Rank color={color}>{rank}</Rank>
			<PictureContainer>
				<UserPic resizeMode="contain" source={require("@assets/images/man.png")}></UserPic>
			</PictureContainer>
			<MiddleTileContainer>
				<UserName>
					<FirstName color={color}>{firstname}</FirstName>
					<LastName color={color}>{lastname}</LastName>
				</UserName>
				<MiddleBottomContainer>
					<Star resizeMode="contain" source={require("@assets/images/goldStar.png")}></Star>
					<SubScore color={color}>{subscore}</SubScore>
					<Country resizeMode="contain" source={require("@assets/images/france.png")}></Country>
				</MiddleBottomContainer>
			</MiddleTileContainer>
			<TileRightContainer color={color}>
				<Arrow
					resizeMode="contain"
					source={progress ? require("@assets/images/upArrow.png") : require("@assets/images/downArrow.png")}
				></Arrow>
				<BoldScore color={color}>{Math.floor(score)}</BoldScore>
				<LightScore color={color}>
					,{Math.round((score % 1) * 100) < 10 ? "0" + Math.round((score % 1) * 100) : Math.round((score % 1) * 100)}
				</LightScore>
			</TileRightContainer>
		</Tile>
	);
};

export const LeaderboardScreen: React.FC = () => {
	return (
		<Container>
			<TitleContainer>
				<Title>Leaderboard</Title>
				<SubTitle>November - updated daily</SubTitle>
			</TitleContainer>
			<LeaderboardContainer>
				{data.map((d, key) => (
					<LeaderboardTile color="black" gradient={false} data={d} key={key} />
				))}
				<LeaderboardTile color="white" gradient={true} data={data[0]} />
			</LeaderboardContainer>
		</Container>
	);
};

const LeaderboardContainer = styled.View`
	flex: 1;
	background-color: #efefef;
	padding: 30px 20px;
`;

const TitleContainer = styled.View`
	height: 71px;
	background-color: white;
	width: 100%;
	padding-horizontal: 20px;
`;

const Title = styled.Text`
	font-size: 18px;
	color: #38454c;
	margin-top: 15px;
	font-weight: bold;
	margin-bottom: 4px;
`;

const SubTitle = styled.Text`
	color: #657884;
	font-size: 14px;
`;

const Container = styled(ScrollScreen)``;
