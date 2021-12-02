import { useServices } from "@core/services";
import { useBanners } from "@domain/homeBanner/hooks";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";
import { colors } from "@ui/styles/colors";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Platform, View } from "react-native";
import styled from "styled-components/native";
import { CirclesBanner } from "./circlesBanner";
import { QuickAccess } from "./quickAccess/quickAccess";
import { NotificationBanner } from "./banners/Notification";
import { SyncBanner } from "./syncBanner";
import { useSetupState } from "@domain/device/hooks";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { MetaDataText } from "@ui/components/text";
import { ActivityBanner } from "./banners/Activity";
import { PrimaryButton } from "@ui/components/buttons";
import { IfAdmin } from "@ui/containers/IfAdmin";
import moment from "moment";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import Fade from "@ui/components/fade";

export const HomeScreen: React.FC = () => {
	const syncState = useSyncState();
	const { homeBannerService, bluetoothService, bleDeviceService, ringManagementService } = useServices();
	const [forceRefreshing, setForceRefreshing] = useState(false);
	
	const setupState = useSetupState();

	useEffect(() => {
		if (setupState === DeviceSetupState.DISABLED) {
			bluetoothService.enable();
			bleDeviceService.checkSettings();
		}
		if (setupState === DeviceSetupState.LOCATION_DISABLED && Platform.OS === "android") {
			bleDeviceService.requestLocation();
		}
	}, []);

	const forceRefresh = useCallback(() => {
		if (syncState !== SyncState.NONE) {
			return;
		}
		setForceRefreshing(true);
		console.log("One SYNC", )
		ringManagementService.syncData();
		ringManagementService.submitFirmwareVersion();
	}, [syncState, setForceRefreshing]);

	const userSettings = useUserSettings();
	const { format } = useI18n()
	const groupedBanners = useBanners();

	return (
		<Container>
			<CirclesBanner />
			<QuickAccess />
			<SyncBanner style={{ margin: 10 }} />
			<IfAdmin>
				<PrimaryButton onPress={homeBannerService._DEBUG_reset}>RESET</PrimaryButton>
			</IfAdmin>
			<ScrollView
				style={{ flex: 1, paddingHorizontal: 6 }}
				refreshControl={
					<RefreshControl
						enabled={syncState === SyncState.NONE}
						refreshing={forceRefreshing}
						onRefresh={() => forceRefresh()}
					/>
				}
			>
				{groupedBanners.notifications[0] && (
					<Fade
						key={groupedBanners.notifications[0].id} 
						isVisible
						isAnimatedOnMount
					>
						<NotificationBanner banner={groupedBanners.notifications[0]} />
					</Fade>
				)}
				{Object.keys(groupedBanners.activities).map((date) => (
					<>
						{date !== "today" && (
							<View style={{alignItems: "center", marginTop: 15}}>
								<Separator/>
								<MetaDataText style={{paddingHorizontal: 8, fontSize: 8, backgroundColor: colors.lightgray}}>{date === "yesterday"
									? format("global.yesterday").toUpperCase()
									: moment(date).format(userSettings?.dateFormat)
								}</MetaDataText>
							</View>
						)}
						{groupedBanners.activities[date].map((banner) => (
							<ActivityBanner key={banner.id} banner={banner} style={{ margin: 10 }} />
						))}
					</>
				))}
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	margin-top: 15px;
	background-color: ${colors.lightgray};
`;

const Separator = styled.View`
	height: 1px;
	position: absolute;
	left: 20;
	top: 5;
	right: 20;
	background-color: ${colors.gray};
`;
