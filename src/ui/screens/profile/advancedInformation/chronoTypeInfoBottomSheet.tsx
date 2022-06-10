import { ResponsiveCenterView } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";
import { ChronoType } from "@domain/user/advancedInfo";

import Swiper from "react-native-swiper";
import { ImageSourcePropType, Text, View } from "react-native";
import { WordingKey } from "src/wordings";

interface ChronoTypeInfoInfoBottomSheetProps {
	chronoType: ChronoType;
	onClose: () => void;
}

export interface ChronoTypeSwiperItem {
	title: WordingKey;
	subtitle?: WordingKey;
	icon?: ImageSourcePropType;
	emoji?: string;
	label: WordingKey;
	description: WordingKey;
}

const chronoTypeBottomSheetData: {
	MORNING: ChronoTypeSwiperItem[];
	SOLAR: ChronoTypeSwiperItem[];
	NIGHT: ChronoTypeSwiperItem[];
	MORNING_ERRATIC: ChronoTypeSwiperItem[];
	SOLAR_ERRATIC: ChronoTypeSwiperItem[];
	NIGHT_ERRATIC: ChronoTypeSwiperItem[];
} = {
	MORNING: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chronomorning_small.png"),
			label: "profile_advanced_info.chrono_type.morning",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.morning",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.morning.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.morning",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.morning.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.morning",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.morning.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.morning",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.morning.productivity",
		},
	],
	SOLAR: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chronosolar.png"),
			label: "profile_advanced_info.chrono_type.solar",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.solar",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.solar.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.solar",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.solar.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.solar",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.solar.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.solar",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.solar.productivity",
		},
	],
	NIGHT: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chrononight.png"),
			label: "profile_advanced_info.chrono_type.night",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.night",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.night.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.night",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.night.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.night",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.night.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.night",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.night.productivity",
		},
	],
	MORNING_ERRATIC: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chronomorning_small.png"),
			label: "profile_advanced_info.chrono_type.morning_erratic",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.morning_erratic",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.morning_erratic.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.morning_erratic",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.morning_erratic.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.morning_erratic",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.morning_erratic.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.morning_erratic",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.morning_erratic.productivity",
		},
	],
	SOLAR_ERRATIC: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chronosolar.png"),
			label: "profile_advanced_info.chrono_type.solar_erratic",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.solar_erratic",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.solar_erratic.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.solar_erratic",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.solar_erratic.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.solar_erratic",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.solar_erratic.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.solar_erratic",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.solar_erratic.productivity",
		},
	],
	NIGHT_ERRATIC: [
		{
			title: "profile_advanced_info.chrono_type.title",
			icon: require("@assets/images/chrononight.png"),
			label: "profile_advanced_info.chrono_type.night_erratic",
			description: "profile_advanced_info.chrono_type.description",
		},
		{
			title: "profile_advanced_info.chrono_type.night_erratic",
			subtitle: "profile_advanced_info.chrono_type.eating_times",
			emoji: "🥘",
			label: "profile_advanced_info.chrono_type.eating_times.label",
			description: "profile_advanced_info.chrono_type.night_erratic.eating_times",
		},
		{
			title: "profile_advanced_info.chrono_type.night_erratic",
			subtitle: "profile_advanced_info.chrono_type.coffee",
			emoji: "☕️",
			label: "profile_advanced_info.chrono_type.coffee.label",
			description: "profile_advanced_info.chrono_type.night_erratic.coffee",
		},
		{
			title: "profile_advanced_info.chrono_type.night_erratic",
			subtitle: "profile_advanced_info.chrono_type.gym",
			emoji: "🏋️",
			label: "profile_advanced_info.chrono_type.gym.label",
			description: "profile_advanced_info.chrono_type.night_erratic.gym",
		},
		{
			title: "profile_advanced_info.chrono_type.night_erratic",
			subtitle: "profile_advanced_info.chrono_type.productivity",
			emoji: "👩",
			label: "profile_advanced_info.chrono_type.productivity.label",
			description: "profile_advanced_info.chrono_type.night_erratic.productivity",
		},
	],
};

export const ChronoTypeInfoInfoBottomSheet: React.FC<ChronoTypeInfoInfoBottomSheetProps> = ({ chronoType }) => {
	const { format } = useI18n();

	const Item = ({ index }: { index: number }) => {
		return (
			<View>
				<Title style={index === 0 && { marginBottom: 40 }}>
					{format(chronoTypeBottomSheetData[chronoType][index].title)}
				</Title>
				{chronoTypeBottomSheetData[chronoType][index].subtitle && (
					<Subtitle>{format(chronoTypeBottomSheetData[chronoType][index].subtitle as WordingKey)}</Subtitle>
				)}
				{chronoTypeBottomSheetData[chronoType][index].icon && (
					<Icon source={chronoTypeBottomSheetData[chronoType][index].icon as ImageSourcePropType} />
				)}
				{chronoTypeBottomSheetData[chronoType][index].emoji && (
					<Emoji>{chronoTypeBottomSheetData[chronoType][index].emoji}</Emoji>
				)}
				{chronoTypeBottomSheetData[chronoType][index].label && (
					<Label style={index === 0 && { fontWeight: "bold" }}>
						{format(chronoTypeBottomSheetData[chronoType][index].label)}
					</Label>
				)}
				<Description>{format(chronoTypeBottomSheetData[chronoType][index].description)}</Description>
			</View>
		);
	};

	return (
		<Container>
			<Swiper
				showsButtons={true}
				activeDotColor={colors.primary}
				paginationStyle={{ bottom: 30 }}
				buttonWrapperStyle={{
					alignItems: "flex-end",
					top: -20,
				}}
				nextButton={<Text>Next</Text>}
				prevButton={<Text>Prev</Text>}
				loop={false}
				removeClippedSubviews={false}
			>
				<Item index={0} />
				<Item index={1} />
				<Item index={2} />
				<Item index={3} />
				<Item index={4} />
			</Swiper>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
	padding-top: 50px;
	padding-horizontal: 0px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	text-align: center;
	margin-bottom: 13px;
	font-size: 18px;
	font-weight: bold;
`;

const Subtitle = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-bottom: 40px;
`;

const Icon = styled.Image`
	height: 76px;
	width: 105px;
	margin-bottom: 60px;
	align-self: center;
`;

const Emoji = styled.Text`
	margin-bottom: 24px;
	text-align: center;
	font-size: 35px;
`;

const Label = styled.Text`
	font-size: 17px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-bottom: 40px;
`;

const Description = styled.Text`
	font-size: 17px;
	color: ${colors.textPrimary};
	text-align: center;
`;
