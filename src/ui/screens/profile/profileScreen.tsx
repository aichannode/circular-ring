import { useGlobalScore } from "@domain/measure/hooks";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { UserAvatar } from "@ui/components/userAvatar";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { LogoutBottomSheet } from "@ui/screens/profile/logoutBottomSheet";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useCallback, useRef } from "react";
import styled from "styled-components/native";

export const ProfileScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();

	const { score } = useGlobalScore();

	// const scoreQuality = globalScore ? getScoreQuality(globalScore, 80, 90) : null;

	const goToProfileInformation = useCallback(() => {
		navigate(Routes.ProfileInformation);
	}, []);

	const logoutBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	return (
		<ScrollScreen
			style={{ justifyContent: "flex-start", alignItems: "center" }}
			contentContainerStyle={{ paddingTop: 20 }}
		>
			<UserAvatar />
			<ResponsiveCenterView>
				<GlobalScoreCard score={score} />
				{/* <ScoreCard gap={16} align="center" justify="center">
					<ScoreView value={globalScore ?? undefined} color={colors.primary} />
					<View>
						<SecondaryText>{format("profile.global_score.label")}</SecondaryText>
						{scoreQuality && (
							<TitleText style={{ color: colors.primary }}>{formatScoreQuality(scoreQuality)}</TitleText>
						)}
					</View>
				</ScoreCard> */}
			</ResponsiveCenterView>
			<InfoListHeader>{format("profile.list_header.profile")}</InfoListHeader>
			<InfoListItem name={format("profile.list.profile_information")} hasDisclosure action={goToProfileInformation} />
			<SeparatedItem
				name={format("profile.logout")}
				action={() => logoutBottomSheetRef.current?.present()}
				emphasize={true}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={logoutBottomSheetRef}>
				<LogoutBottomSheet onClose={() => logoutBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
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
