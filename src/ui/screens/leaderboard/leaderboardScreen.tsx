import { useServices } from "@core/services";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import emoji from "node-emoji";
import React, { createRef, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface I_LeaderboardData {
	rank: number;
	score: number;
	previousScore: number;
	user: {
		userName: string;
		profilePictureUrl: string;
		country?: string;
		streak: number;
	};
}

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
	if (position === 1) return <Star resizeMode="contain" source={require("@assets/images/goldStar.png")} />;
	if (position === 2) return <Star resizeMode="contain" source={require("@assets/images/starSilver.png")} />;
	if (position === 3) return <Star resizeMode="contain" source={require("@assets/images/starCopper.png")} />;
	return <Star resizeMode="contain" source={require("@assets/images/starOrange.png")} />;
};

const LeaderboardTile = ({ data, gradient, color }: { data: I_LeaderboardData; gradient: boolean; color: string }) => {
	let { score } = data;
	const { previousScore, rank } = data;
	const { userName, country, profilePictureUrl } = data.user;
	const progress = score > previousScore;

	score *= 100;
	return (
		<Tile
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0.5 }}
			colors={gradient ? colors.gradient.orange.slice(0) : [colors.white, colors.white]}
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
				<UserPic
					resizeMode="cover"
					source={profilePictureUrl ? { uri: profilePictureUrl } : require("@assets/images/man.png")}
				></UserPic>
			</PictureContainer>
			<MiddleTileContainer>
				<UserName>
					<FirstName color={color}>{userName.split(" ")[0]}</FirstName>
					<LastName color={color}>{userName.split(" ")[1]}</LastName>
				</UserName>
				<MiddleBottomContainer>
					<ColoredStar position={rank}></ColoredStar>
					<SubScore color={color}>{0}</SubScore>
					{country && <CountryEmoji>{emoji.get(`flag-${country}`.toLowerCase())}</CountryEmoji>}
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
	const { format } = useI18n();
	const { leaderboardService } = useServices();
	const [data, setData] = useState<null | any>(null);
	const [loading, setLoading] = useState(false);

	const ScrollToPosition = (position: number) => {
		const y = position * 67;
		scrollRef.current?.scrollTo({
			x: 0,
			y: y,
			animated: true,
		});
	};

	const fetchLeaderboard = async () => {
		setLoading(true);
		try {
			const res = await leaderboardService.getLeaderboard();
			setData(res);
		} catch (err) {}
		setLoading(false);
	};

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	if (loading)
		return (
			<View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
				<Spinner size={50}></Spinner>
			</View>
		);

	if (!data) return null;

	if (data.leaderboard.data.length === 0) return <Text style={{ textAlign: "center", marginTop: 30 }}>No data</Text>;

	return (
		<>
			<Container ref={scrollRef}>
				<TitleContainer>
					<Title>{format("header.leaderboard")}</Title>
					<SubTitle>{`${moment().format("MMMM")} - ${format("leaderboard.updatedDaily")}`}</SubTitle>
				</TitleContainer>
				<LeaderboardContainer>
					{data.leaderboard.data.map((d: I_LeaderboardData, key: number) =>
						data?.targetUser?.rank !== d.rank ? (
							<LeaderboardTile color="black" gradient={false} data={d} key={key} />
						) : (
							<LeaderboardTile color="white" gradient={true} data={d} key={key} />
						)
					)}
				</LeaderboardContainer>
			</Container>
			{data.targetUser && (
				<MyScore onPress={() => ScrollToPosition(data.targetUser.rank)}>
					<>
						<Separator></Separator>
						<LeaderboardTile color="white" gradient={true} data={data.targetUser} />
					</>
				</MyScore>
			)}
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
