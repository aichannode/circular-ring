import { FeedEntityStyle, FeedBanner, IconType, FeedEntity, FeedEntityAction } from "@domain/feed/type";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { SecondaryText } from "@ui/components/text";
import { Navigate, Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Paragraph } from "../components/Paragraph";
import { ParagraphComponentConfigurationDto } from "@domain/feed/type"
import { useI18n } from "@ui/i18n";
import { useServices } from "@core/services";
import { openURL } from "@ui/utils/urlUtils";

interface Props {
	banner: FeedBanner;
	style?: StyleProp<ViewStyle>;
}

function getActionHandler(banner: FeedEntity, navigate: Navigate) {
	return () => {
		const action = banner.actions[0];
		if (action) {
			switch (action.type) {
				case FeedEntityAction.OPEN_WEB:
					openURL(action.data);
					break;
				case FeedEntityAction.APP_PAGE:
					navigate(Routes.Activity); // TODO Handle routing with backend when we got specs
					break;
				default:
					throw Error("Unhandled client action");
			}
		}
	};
}

export const Banner: React.FC<Props> = ({ banner, style }) => {
	const { navigate } = useRoutesNavigation();
	const { homeBannerService } = useServices()
	const useContrastColor = banner.style === FeedEntityStyle.ORANGE_GRADIENT
	const { format } = useI18n();

	return (
		<Pressable
			onPress={getActionHandler(banner, navigate)}
			style={style}
		>
			<Container>
				<View style={{ marginRight: 27 }}>
					{banner.icon.type === IconType.URL ? <Image source={{ uri: banner.icon.type }} /> : null}
				</View>
				<Stack gap={10} style={{ flex: 1 }}>
					<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{format(banner.title)}</SecondaryText>
					<Paragraph
						useContrastColor={useContrastColor}
						{...(banner.components[0] as ParagraphComponentConfigurationDto).configuration}
					/>
				</Stack>
				<CloseButton padding={16} onClose={() => {homeBannerService.closeNotification(banner.id)}} />
			</Container>
		</Pressable>
	);
};

const Container = styled(OrangeDiagonalGradient)`
	margin-top: 15px;
	padding: 20px 40px 20px 20px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;