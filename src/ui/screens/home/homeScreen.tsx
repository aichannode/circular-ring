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
import { HomeBannerView } from "./homeBanner/homeBannerView";
import { SyncBanner } from "./syncBanner";
import { useSetupState } from "@domain/device/hooks";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { MetaDataText } from "@ui/components/text";

export const HomeScreen: React.FC = () => {
	const syncState = useSyncState();
	const { bluetoothService, bleDeviceService, ringManagementService } = useServices();
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
		ringManagementService.syncData();
	}, [syncState, setForceRefreshing]);

	useEffect(() => {
		ringManagementService.submitFirmwareVersion();
		if (syncState !== SyncState.PREPARING) {
			setForceRefreshing(false);
		}
	}, [syncState]);

	// Workaround to display all banners.
	// Will be updated with CIR-444
	// const homeBanner = useHomeBanner();
	const groupedBanners = useBanners();

	return (
		<Container>
			<CirclesBanner />
			<QuickAccess />
			<SyncBanner style={{ margin: 10 }} />

			<ScrollView
				style={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						enabled={syncState === SyncState.NONE}
						refreshing={forceRefreshing}
						onRefresh={() => forceRefresh()}
					/>
				}
			>
				{Array.from(groupedBanners.keys()).map((date) => (
					<>
						{date !== "today" && (
							<View style={{ alignItems: "center" }}>
								<Separator />
								<MetaDataText style={{ paddingHorizontal: 11, fontSize: 8, backgroundColor: colors.lightgray }}>
									{date.toUpperCase()}
								</MetaDataText>
							</View>
						)}
						{groupedBanners.get(date)?.map((banner) => (
							<HomeBannerView key={banner.id} banner={banner} style={{ margin: 10 }} />
						))}
					</>
				))}
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
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
