import { Banner, BannerStyle, Activity } from "@domain/homeBanner/homeBanner";
import { Row, row, Stack } from "@ui/components/layout";
import { MetaDataText, SubTitleText, TitleText } from "@ui/components/text";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue, Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Paragraph } from "./Paragraph";
import { ParagraphComponentConfigurationDto } from "@domain/homeBanner/homeBanner"
import { useUserSettings } from "@domain/user/hooks/useUser";
import { getBannerDate } from "@domain/homeBanner/business";
import { useI18n } from "@ui/i18n";
import { getActionHandler } from "./common";

type Props = {
	banner: Banner<Activity>;
	style?: StyleProp<ViewStyle>;
}

function getColorFromBannerStyle(bannerStyle: BannerStyle): ColorValue | undefined {
	switch(bannerStyle) {
		case BannerStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
	}
}

export const ActivityBanner: React.FC<Props> = ({ banner, style }) => {
	const { navigate } = useRoutesNavigation();
	const highlightColor = getColorFromBannerStyle(banner.style)
	const useContrastColor = banner.style === BannerStyle.ORANGE_GRADIENT
	const userSettings = useUserSettings()
	const todayIso = new Date().toISOString();
	const { format } = useI18n();

	return (
		<Pressable
			onPress={getActionHandler(banner, navigate)}
			style={style}
		>
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
							<MetaDataText>{getBannerDate(banner.startDate, todayIso, userSettings?.hourFormat)}</MetaDataText>
						</Row>
						<Paragraph
							coloredTagColor={highlightColor}
							useContrastColor={useContrastColor}
							{...(banner.components[0] as ParagraphComponentConfigurationDto).configuration}
						/>
					</View>
				</Stack>
			</Container>
		</Pressable>
	);
};

const Container = styled.View<{bannerStyle: BannerStyle}>`
	${row("center")};
	background-color: white;
	border-radius: 2px;
	border-left-width: 10px;
	${props => `border-left-color: ${getColorFromBannerStyle(props.bannerStyle) as string}`};
`;

const Separator = styled.View`
	height: 1px;
	background-color: ${colors.midGray};
`;


