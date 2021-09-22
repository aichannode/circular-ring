import { useServices } from "@core/services";
import { BannerAction, HomeBanner, IconType } from "@domain/homeBanner/homeBanner";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { SecondaryText } from "@ui/components/text";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Linking, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface HomeBannerViewProps {
	banner: HomeBanner;
	style?: StyleProp<ViewStyle>;
}
export const HomeBannerView: React.FC<HomeBannerViewProps> = ({ banner, style }) => {
	const { homeBannerService } = useServices();
	const { navigate } = useRoutesNavigation();

	return (
		<Pressable
			onPress={() => {
				const action = banner.clientActions[0];
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
			<Container>
				<View style={{ marginRight: 30 }}>
					{banner.iconType === IconType.URL ? <Image source={{ uri: banner.icon }} /> : null}
				</View>
				<Stack gap={10} style={{ flex: 1 }}>
					<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{banner.title}</SecondaryText>
					<SecondaryText style={{ color: colors.white }}>{banner.body}</SecondaryText>
				</Stack>
				<CloseButton padding={16} onClose={() => homeBannerService.dismiss(banner)} />
			</Container>
		</Pressable>
	);
};

const Container = styled(OrangeDiagonalGradient)`
	padding: 20px 40px 20px 28px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;
