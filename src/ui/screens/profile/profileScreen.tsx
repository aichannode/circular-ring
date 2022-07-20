import { useRepresentations } from "@core/representation";
import { useServices } from "@core/services";
import { getCurrentLocalISODay, isDefined } from "@domain/common/business";
import { useUser, useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { getInitMode, updateMode } from "@ui/business";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ResponsiveCenterView } from "@ui/components/layout";
import { GlobalScoreCard } from "@ui/components/measure/globalScoreCard";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { UserAvatar } from "@ui/components/userAvatar";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ChangePasswordBottomSheet } from "@ui/screens/profile/changePasswordBottomSheet";
import { LogoutBottomSheet } from "@ui/screens/profile/logoutBottomSheet";
import { useObservable } from "micro-observables";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { StreakBadge } from "./StreakBadgeComponenent";

export const ProfileScreen = observer(function ProfileScreen() {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const { cognitoAuthService } = useServices();
	const user = useUser();

	const authUser = useObservable(cognitoAuthService.user);
	const {
		measure: {
			hooks: { useHasCompleteCoreSleep, useUserRankAndStreak },
		},
	} = useRepresentations();

	const { bestStreak } = useUserRankAndStreak();

	const dailyScore = useRepresentations().measure.hooks.useDailyGlobalScore(getCurrentLocalISODay());
	const [isConnectedByEmail, setIsConnectedByEmail] = useState(false);

	const hasCompleteCoreSleep = useHasCompleteCoreSleep(getCurrentLocalISODay());
	const nbRemainingDays = useUserCalibrationRemainingDays();
	// XXX: https://circularing.atlassian.net/browse/CIR-93
	const screenMode = getInitMode(nbRemainingDays, hasCompleteCoreSleep);

	const goToProfileInformation = useCallback(() => {
		navigate(Routes.ProfileInformation);
	}, []);

	const goToProfileChangePassword = useCallback(() => {
		navigate(Routes.ChangePassword);
	}, []);

	useEffect(() => {
		//currentPasswordRef.current?.focus();
		cognitoAuthService
			.isConnectedByEmail()
			.then(setIsConnectedByEmail)
			.catch(() => setIsConnectedByEmail(false));
	}, []);

	const logoutBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const changePasswordBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	return (
		<ScrollScreen
			style={{ justifyContent: "flex-start", alignItems: "center" }}
			contentContainerStyle={{ paddingTop: 20 }}
		>
			<UserAvatar />
			<ResponsiveCenterView>
				<StreakBadge
					streak={bestStreak ?? 0}
					leaderboardRank={
						user?.leaderboardRank === "TOP100" ? `${user?.leaderboardPosition}` : user?.leaderboardRank ?? "-"
					}
				></StreakBadge>
				<GlobalScoreCard
					score={dailyScore}
					mode={updateMode(screenMode, !isDefined(dailyScore) || isNaN(dailyScore))}
				/>
			</ResponsiveCenterView>
			<InfoListHeader>{format("profile.list_header.profile")}</InfoListHeader>
			<InfoListItem name={format("profile.list.profile_information")} hasDisclosure action={goToProfileInformation} />
			<InfoListItem
				name={format("profile.changePassword")}
				hasDisclosure
				action={isConnectedByEmail ? goToProfileChangePassword : () => changePasswordBottomSheetRef.current?.present()}
			/>

			<InfoListHeader>{format("settings.security")}</InfoListHeader>
			<InfoListItem name={format("settings.logged_in")} value={authUser?.getIdToken().decodePayload().email ?? ""} />
			{/* <InfoListItem name={format("settings.2fa")} /> */}
			<SeparatedItem
				name={format("profile.logout")}
				action={() => logoutBottomSheetRef.current?.present()}
				emphasize={true}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={logoutBottomSheetRef}>
				<LogoutBottomSheet onClose={() => logoutBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[340]} ref={changePasswordBottomSheetRef}>
				<ChangePasswordBottomSheet onClose={() => changePasswordBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</ScrollScreen>
	);
});

const SeparatedItem = styled(InfoListItem)`
	margin-top: 20px;
`;
