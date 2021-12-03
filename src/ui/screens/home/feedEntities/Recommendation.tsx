import { FeedEntityStyle, Activity, FeedEntityComponentType, UserInputComponentConfigurationDto, FeedRecommendation } from "@domain/feed/type";
import { Row, row, Stack } from "@ui/components/layout";
import { MetaDataText, SubTitleText, TitleText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue, Image, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Paragraph } from "../components/Paragraph";
import { ParagraphComponentConfigurationDto } from "@domain/feed/type"
import { useUserSettings } from "@domain/user/hooks/useUser";
import { getFeedEntityDate } from "@domain/feed/business";
import { useI18n } from "@ui/i18n";
import { UserInput } from "../components/UserInput";

type Props = {
	banner: FeedRecommendation;
	style?: StyleProp<ViewStyle>;
}

function getColorFromBannerStyle(bannerStyle: Activity["style"]): ColorValue | undefined {
	switch(bannerStyle) {
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
	}
}

export const Recommendation: React.FC<Props> = ({ banner }) => {
	const highlightColor = getColorFromBannerStyle(banner.style)
	const userSettings = useUserSettings()
	const todayIso = new Date().toISOString();
	const { format } = useI18n();
	const userInput = banner.components.find(({type}) => type === FeedEntityComponentType.USER_INPUT) as UserInputComponentConfigurationDto | undefined

	return (
		<>
			<Container bannerStyle={banner.style}>
				<Stack gap={10} style={{ flex: 1 }}>
					{/* Use a wrapper to set the gutter so hat Separator will be at full width */}
					<View style={{paddingTop: 20, paddingRight: 26, paddingBottom: 10, paddingLeft: 30}}>
						<Row style={{alignItems: "center", justifyContent: "space-between"}}>
							<TitleText>{format(banner.title).toUpperCase()}</TitleText>
							<SubTitleText style={{color: highlightColor}}>{format(banner.secondaryTitle)}</SubTitleText>
						</Row>	
					</View>
					<Separator/>
					<View style={{paddingRight: 26, paddingBottom: 17, paddingLeft: 30}}>
						<Row style={{alignItems: "center", marginBottom: 8}}>
							<Image
								style={{width: 14, height: 14, marginRight: 8}}
								source={require("@assets/images/clockGrey.png")}
							/>
							<MetaDataText>{getFeedEntityDate(banner.startDate, todayIso, userSettings?.hourFormat)}</MetaDataText>
						</Row>
						<Paragraph
							coloredTagColor={highlightColor}
							{...(banner.components[0] as ParagraphComponentConfigurationDto).configuration}
						/>
					</View>
				</Stack>
			</Container>
			{userInput && <UserInput palette={banner.style} {...userInput}/>}
		</>
	);
};

const Container = styled.View<{bannerStyle: Activity["style"]}>`
	${row("center")};
	margin-top: 15px;
	border-left-width: 10px;
	background-color: white;
	border-radius: 2px;
	${props => `border-left-color: ${getColorFromBannerStyle(props.bannerStyle) as string}`};
`;

const Separator = styled.View`
	height: 1px;
	background-color: ${colors.midGray};
`;


