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
	recommendation: FeedRecommendation;
	style?: StyleProp<ViewStyle>;
}

function getColorFromBannerStyle(style: Activity["style"]): ColorValue | undefined {
	switch(style) {
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
	}
}

export const Recommendation: React.FC<Props> = ({ recommendation }) => {
	const highlightColor = getColorFromBannerStyle(recommendation.style)
	const userSettings = useUserSettings()
	const todayIso = new Date().toISOString();
	const { format } = useI18n();
	const userInput = recommendation.components.find(({type}) => type === FeedEntityComponentType.USER_INPUT) as UserInputComponentConfigurationDto | undefined

	return (
		<>
			<Container style={recommendation.style}>
				<Stack gap={10} style={{ flex: 1 }}>
					{/* Use a wrapper to set the gutter so hat Separator will be at full width */}
					<View style={{paddingTop: 20, paddingRight: 26, paddingBottom: 10, paddingLeft: 30}}>
						<Row style={{alignItems: "center", justifyContent: "space-between"}}>
							<TitleText>{format(recommendation.title).toUpperCase()}</TitleText>
							<SubTitleText style={{color: highlightColor}}>{format(recommendation.secondaryTitle)}</SubTitleText>
						</Row>	
					</View>
					<Separator/>
					<View style={{paddingRight: 26, paddingBottom: 17, paddingLeft: 30}}>
						<Row style={{alignItems: "center", marginBottom: 8}}>
							<Image
								style={{width: 14, height: 14, marginRight: 8}}
								source={require("@assets/images/clockGrey.png")}
							/>
							<MetaDataText>{getFeedEntityDate(recommendation.startDate, todayIso, userSettings?.hourFormat)}</MetaDataText>
						</Row>
						<Paragraph
							coloredTagColor={highlightColor}
							{...(recommendation.components[0] as ParagraphComponentConfigurationDto).configuration}
						/>
					</View>
				</Stack>
			</Container>
			{userInput && <UserInput palette={recommendation.style} {...userInput}/>}
		</>
	);
};

const Container = styled.View<{style: Activity["style"]}>`
	${row("center")};
	margin-top: 15px;
	border-left-width: 10px;
	background-color: white;
	border-radius: 2px;
	${props => `border-left-color: ${getColorFromBannerStyle(props.style) as string}`};
`;

const Separator = styled.View`
	height: 1px;
	background-color: ${colors.midGray};
`;


