import { useServices } from "@core/services";
import { BannerAction, BannerStyle, HomeBanner, IconType } from "@domain/homeBanner/homeBanner";
import { CloseButton } from "@ui/components/closeButton";
import { Row, row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { MetaDataText, SecondaryText, SubTitleText, TitleText } from "@ui/components/text";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue, Image, Linking, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import BannerParagraph from "./BannerParagraph";
import { ParagraphComponentConfigurationDto } from "@domain/homeBanner/homeBanner"

interface HomeBannerViewProps {
	banner: HomeBanner;
	style?: StyleProp<ViewStyle>;
}

function getColorFromBannerStyle(bannerStyle: BannerStyle): ColorValue | undefined {
	switch(bannerStyle) {
		case BannerStyle.ORANGE_GRADIENT:
			return undefined;
		case BannerStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
	}
}

export const HomeBannerView: React.FC<HomeBannerViewProps> = ({ banner, style }) => {
	const { homeBannerService } = useServices();
	const { navigate } = useRoutesNavigation();
	const highlightColor = getColorFromBannerStyle(banner.style)
	const useContrastColor = banner.style === BannerStyle.ORANGE_GRADIENT

	return (
		<Pressable
			onPress={() => {
				const action = banner.actions[0];
				if (action) {
					switch (action.type) {
						case BannerAction.OPEN_WEB:
							Linking.openURL(action.data);
							break;
						case BannerAction.APP_PAGE:
							navigate(Routes.Activity); // TODO Handle routing with backend when we got specs
							break;
						default:
							throw Error("Unhandled client action");
					}
					homeBannerService.dismiss(banner);
				}
			}}
			style={style}
		>
			{banner.style === BannerStyle.ORANGE_GRADIENT
				? (
					<OrangeDiagonalGradientContainer>
						<View style={{ marginRight: 30 }}>
							{banner.icon.type === IconType.URL ? <Image source={{ uri: banner.icon.type }} /> : null}
						</View>
						<Stack gap={10} style={{ flex: 1 }}>
							<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{banner.title}</SecondaryText>
							<BannerParagraph
								coloredTagColor={highlightColor}
								useContrastColor={useContrastColor}
								{...(banner.components[0] as ParagraphComponentConfigurationDto).configuration}
							/>
						</Stack>
						<CloseButton padding={16} onClose={() => homeBannerService.dismiss(banner)} />
					</OrangeDiagonalGradientContainer>
				) : (
					<WhiteWithColoredBorderContainer bannerStyle={banner.style}>
						<Stack gap={10} style={{ flex: 1 }}>
							{/* Use a wrapper to set the gutter so hat Separator will be at full width */}
							<View style={{paddingTop: 20, paddingRight: 26, paddingBottom: 10, paddingLeft: 38}}>
								<Row style={{alignItems: "center", justifyContent: "space-between"}}>
									<TitleText>{banner.title.toUpperCase()}</TitleText>
									<SubTitleText style={{color: highlightColor}}>zdzd</SubTitleText>
								</Row>	
							</View>
							<Separator/>
							<View style={{paddingRight: 26, paddingBottom: 17, paddingLeft: 38}}>
								<Row style={{alignItems: "center", marginBottom: 8}}>
									<Image
										style={{width: 14, height: 14, marginRight: 8}}
										source={require("@assets/images/clockGrey.png")}
									/>
									{/* Wait for CIR-448 to format the date*/}
									<MetaDataText>{banner.startDate}</MetaDataText>
								</Row>
								<BannerParagraph
									coloredTagColor={highlightColor}
									useContrastColor={useContrastColor}
									{...(banner.components[0] as ParagraphComponentConfigurationDto).configuration}
								/>
							</View>
						</Stack>
					</WhiteWithColoredBorderContainer>
				)
			}
		</Pressable>
	);
};

const OrangeDiagonalGradientContainer = styled(OrangeDiagonalGradient)`
	padding: 20px 40px 20px 28px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;

const WhiteWithColoredBorderContainer = styled.View<{bannerStyle: BannerStyle}>`
	${row("center")};
	background-color: white;
	border-radius: 2px;
	border-left-width: 10px;
	${props => `border-left-color: ${getColorFromBannerStyle(props.bannerStyle) as string}`};
`;

const Separator = styled.View`
	height: 1px;
	opacity: .5;
	background-color: ${colors.lightgray};
`;