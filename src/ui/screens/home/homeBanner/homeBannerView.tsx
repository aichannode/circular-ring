import { useServices } from "@core/services";
import { HomeBanner, IconType } from "@domain/homeBanner/homeBanner";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { SecondaryText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface HomeBannerViewProps {
	banner: HomeBanner;
	style?: StyleProp<ViewStyle>;
}
export const HomeBannerView: React.FC<HomeBannerViewProps> = ({ banner, style }) => {
	const { homeBannerService } = useServices();

	return (
		<Container style={style}>
			<View style={{ marginRight: 30 }}>
				{banner.iconType === IconType.URL ? <Image source={{ uri: banner.icon }} /> : null}
			</View>
			<Stack gap={10} style={{ flex: 1 }}>
				<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{banner.title}</SecondaryText>
				<SecondaryText style={{ color: colors.white }}>{banner.body}</SecondaryText>
			</Stack>
			<CloseButton padding={16} onClose={() => homeBannerService.dismiss(banner)} />
		</Container>
	);
};

const Container = styled(OrangeDiagonalGradient)`
	padding: 20px 40px 20px 28px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;
