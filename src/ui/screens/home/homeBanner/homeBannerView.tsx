import { useServices } from "@core/services";
import { BannerType, HomeBanner } from "@domain/homeBanner/homeBanner";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

interface BannerInfo {
	logo: number;
	titleKey: WordingKey;
	messageKey: WordingKey;
}
const bannerInfos: { [key in BannerType]: BannerInfo } = {
	[BannerType.CALIBRATION]: {
		logo: require("@assets/images/calendar.png"),
		titleKey: "banner.calibration.title",
		messageKey: "banner.calibration.message",
	},
};

interface HomeBannerViewProps {
	banner: HomeBanner;
	style?: StyleProp<ViewStyle>;
}
export const HomeBannerView: React.FC<HomeBannerViewProps> = ({ banner, style }) => {
	const infos = bannerInfos[banner.type];
	const { format } = useI18n();
	const { homeBannerService } = useServices();

	return (
		<Container style={style}>
			<View style={{ marginRight: 30 }}>
				<Image source={infos.logo} />
				{banner.type === BannerType.CALIBRATION && (
					<CalibrationEndDate>{dayjs().add(banner.daysLeft, "day").format("MM/DD")}</CalibrationEndDate>
				)}
			</View>
			<Stack gap={10} style={{ flex: 1 }}>
				<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{format(infos.titleKey)}</SecondaryText>
				<SecondaryText style={{ color: colors.white }}>{format(infos.messageKey)}</SecondaryText>
			</Stack>
			<CloseButton padding={16} onClose={() => homeBannerService.dismiss(banner)} />
		</Container>
	);
};

const Container = styled.View`
	padding: 20px 40px 20px 28px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;

const CalibrationEndDate = styled.Text`
	position: absolute;
	bottom: 6px;
	left: 3px;
	font-size: 12px;
	font-weight: bold;
	color: ${colors.white};
`;
