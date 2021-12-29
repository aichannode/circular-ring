import { useServices } from "@core/services";
import { useDailyGlobalScore } from "@domain/measure/representation/hooks";
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

export const ProfileScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const { cognitoAuthService } = useServices();

	const dailyScore = useDailyGlobalScore();
	const [isConnectedByEmail, setIsConnectedByEmail] = useState(false);

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
				<GlobalScoreCard score={dailyScore} />
			</ResponsiveCenterView>
			<InfoListHeader>{format("profile.list_header.profile")}</InfoListHeader>
			<InfoListItem name={format("profile.list.profile_information")} hasDisclosure action={goToProfileInformation} />
			<InfoListItem
				name={format("profile.changePassword")}
				hasDisclosure
				action={isConnectedByEmail ? goToProfileChangePassword : () => changePasswordBottomSheetRef.current?.present()}
			/>
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
};

const SeparatedItem = styled(InfoListItem)`
	margin-top: 20px;
`;
