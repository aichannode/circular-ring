import { useServices } from "@core/services";
import { getScoreQuality } from "@domain/circleActivity/circleActivityData";
import { UserAvatar } from "@ui/components/userAvatar";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useCallback } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const score = 82.42; // FAKE
export const ProfileScreen = () => {
	const { format, formatScoreQuality } = useI18n();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const logout = useCallback(async () => {
		await userService.logout();
	}, []);

	const scoreQuality = score ? getScoreQuality(score, 80, 90) : null;

	const goToProfileInformation = useCallback(() => {
		navigate(Routes.ProfileInformation);
	}, []);

	return (
		<ScrollScreen
			style={{ justifyContent: "flex-start", alignItems: "center" }}
			contentContainerStyle={{ paddingTop: 20 }}
		>
			<UserAvatar />
			<ResponsiveCenterView>
				<ScoreCard gap={16} align="center" justify="center">
					<ScoreView value={score} color={colors.primary} />
					<View>
						<SecondaryText>{format("profile.global_score.label")}</SecondaryText>
						{scoreQuality && (
							<TitleText style={{ color: colors.primary }}>{formatScoreQuality(scoreQuality)}</TitleText>
						)}
					</View>
				</ScoreCard>
			</ResponsiveCenterView>
			<InfoListHeader>{format("profile.list_header.profile")}</InfoListHeader>
			<InfoListItem
				name={format("profile.list.profile_information")}
				hasDisclosure={true}
				action={goToProfileInformation}
			/>
			<SeparatedItem name={format("profile.logout")} action={logout} emphasize={true} />
		</ScrollScreen>
	);
};

const SeparatedItem = styled(InfoListItem)`
	margin-top: 20px;
`;

const ScoreCard = styled(Row)`
	${roundedWhiteCardStyle};
	padding: 25px;
`;
