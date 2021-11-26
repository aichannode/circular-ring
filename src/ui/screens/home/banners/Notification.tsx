import { Banner, BannerStyle, IconType, Notification } from "@domain/homeBanner/homeBanner";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { SecondaryText } from "@ui/components/text";
import { useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Paragraph } from "./Paragraph";
import { ParagraphComponentConfigurationDto } from "@domain/homeBanner/homeBanner"
import { useI18n } from "@ui/i18n";
import { getActionHandler } from "./common";

interface Props {
	banner: Banner<Notification>;
	style?: StyleProp<ViewStyle>;
}

export const NotificationBanner: React.FC<Props> = ({ banner, style }) => {
	const { navigate } = useRoutesNavigation();
	const useContrastColor = banner.style === BannerStyle.ORANGE_GRADIENT
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
				<CloseButton padding={16} onClose={() => {/* homeBannerService.dismiss(banner) */}} />
			</Container>
		</Pressable>
	);
};

const Container = styled(OrangeDiagonalGradient)`
	padding: 20px 40px 20px 20px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;