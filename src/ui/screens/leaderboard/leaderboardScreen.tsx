import React, { createRef } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import emoji from "node-emoji";

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
		country: "flag-fr",
	},
	{
		rank: 3,
		firstname: "Gale",
		lastname: "Blue",
		score: 99.21,
		progress: false,
		subscore: 34,
		country: "flag-fi",
	},
	{
		rank: 4,
		firstname: "William",
		lastname: "Bowlow",
		score: 98.41,
		progress: false,
		subscore: 39,
		country: "flag-ru",
	},
	{
		rank: 5,
		firstname: "John",
		lastname: "Lee",
		score: 98.09,
		progress: true,
		subscore: 51,
		country: "flag-us",
	},
	{
		rank: 6,
		firstname: "Simone",
		lastname: "Roger",
		score: 98.01,
		progress: true,
		subscore: 51,
		country: "flag-cw",
	},
	{
		rank: 7,
		firstname: "Elen",
		lastname: "Love",
		score: 97.99,
		progress: false,
		subscore: 32,
		country: "flag-fr",
	},
	{
		rank: 8,
		firstname: "Clara",
		lastname: "Ocean",
		score: 97.93,
		progress: true,
		subscore: 46,
		country: "flag-fr",
	},
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
		country: "flag-fr",
	},
	{
		rank: 3,
		firstname: "Gale",
		lastname: "Blue",
		score: 99.21,
		progress: false,
		subscore: 34,
		country: "flag-fr",
	},
	{
		rank: 4,
		firstname: "William",
		lastname: "Bowlow",
		score: 98.41,
		progress: false,
		subscore: 39,
		country: "flag-fr",
	},
	{
		rank: 5,
		firstname: "John",
		lastname: "Lee",
		score: 98.09,
		progress: true,
		subscore: 51,
		country: "flag-fr",
	},
	{
		rank: 6,
		firstname: "Simone",
		lastname: "Roger",
		score: 98.01,
		progress: true,
		subscore: 51,
		country: "flag-fr",
	},
	{
		rank: 7,
		firstname: "Elen",
		lastname: "Love",
		score: 97.99,
		progress: false,
		subscore: 32,
		country: "flag-fr",
	},
	{
		rank: 8,
		firstname: "Clara",
		lastname: "Ocean",
		score: 97.93,
		progress: true,
		subscore: 46,
		country: "flag-fr",
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

const CountryEmoji = styled.Text`
	font-size: 14px;
	margin-left: 13px;
	margin-top: -4px;
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

const ColoredStar = ({ position }: { position: number }) => {
	if (position === 0) return <Star resizeMode="contain" source={require("@assets/images/goldStar.png")} />;
	if (position === 1) return <Star resizeMode="contain" source={require("@assets/images/starSilver.png")} />;
	if (position === 2) return <Star resizeMode="contain" source={require("@assets/images/starCopper.png")} />;
	return <Star resizeMode="contain" source={require("@assets/images/starOrange.png")} />;
};

const LeaderboardTile = ({
	data,
	gradient,
	color,
	i,
}: {
	data: I_Data;
	gradient: boolean;
	color: string;
	i: number;
}) => {
	const { firstname, lastname, score, progress, subscore, country } = data;

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
			<Rank color={color}>{i + 1}</Rank>
			<PictureContainer>
				<UserPic resizeMode="contain" source={require("@assets/images/man.png")}></UserPic>
			</PictureContainer>
			<MiddleTileContainer>
				<UserName>
					<FirstName color={color}>{firstname}</FirstName>
					<LastName color={color}>{lastname}</LastName>
				</UserName>
				<MiddleBottomContainer>
					<ColoredStar position={i}></ColoredStar>
					<SubScore color={color}>{subscore}</SubScore>
					{/* <Country resizeMode="contain" source={require("@assets/images/france.png")}></Country> */}
					{country && <CountryEmoji>{emoji.get(country)}</CountryEmoji>}
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
	const scrollRef = createRef<ScrollView>();

	const ScrollToPosition = (position: number) => {
		const y = position * 67;
		scrollRef.current?.scrollTo({
			x: 0,
			y: y,
			animated: true,
		});
	};

	return (
		<>
			<Container ref={scrollRef}>
				<TitleContainer>
					<Title>Leaderboard</Title>
					<SubTitle>{moment().format("MMMM")} - updated daily</SubTitle>
				</TitleContainer>
				<LeaderboardContainer>
					{data.map((d, key) =>
						key !== 12 ? (
							<LeaderboardTile color="black" gradient={false} data={d} i={key} key={key} />
						) : (
							<LeaderboardTile color="white" gradient={true} data={d} i={key} key={key} />
						)
					)}
				</LeaderboardContainer>
			</Container>
			<MyScore onPress={() => ScrollToPosition(12)}>
				<>
					<Separator></Separator>
					<LeaderboardTile color="white" gradient={true} data={data[12]} i={12} />
				</>
			</MyScore>
		</>
	);
};

const Separator = styled.View`
	border-top-width: 0.5px;
	border-top-color: #38454c;
	padding-bottom: 15px;
`;

const MyScore = styled.Pressable`
	position: absolute;
	bottom: 0;
	width: 100%;
	padding-horizontal: 20px;

	background-color: #efefef;
`;

const LeaderboardContainer = styled.View`
	flex: 1;
	background-color: #efefef;
	padding: 30px 20px;
	padding-bottom: 90px;
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

const Container = styled.ScrollView`
	flex: 1;
	background-color: #efefef;
`;
