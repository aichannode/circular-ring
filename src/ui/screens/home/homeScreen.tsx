import { useServices } from "@core/services";
import { useNotifications, useRecommendations } from "@domain/feed/hooks";
import { colors } from "@ui/styles/colors";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, View, FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { CirclesBanner } from "@ui/screens/home/circlesBanner";
import { QuickAccess } from "@ui/screens/home/quickAccess/quickAccess";
import { Notification } from "@ui/screens/home/feedEntities/Notification";
import { useSetupState } from "@domain/device/hooks";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { MetaDataText } from "@ui/components/text";
import { Recommendation } from "@ui/screens/home/feedEntities/Recommendation";
import { PrimaryButton } from "@ui/components/buttons";
import { IfAdmin } from "@ui/containers/IfAdmin";
import moment from "moment";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import Fade from "@ui/components/fade";
import { Spinner } from "@ui/components/spinner";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";

const BANNER_TO_LOAD_ON_END = 2;

export const HomeScreen: React.FC = () => {
	const { feedService, bluetoothService, bleDeviceService, appStateService, ringManagementService } = useServices();
	const [forceRefreshing, setForceRefreshing] = useState(false);
	const syncState = useSyncState();

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

	const forceRefresh = useCallback(async () => {
		if (appStateService.isInSleepMode.get()) return;
		if (syncState !== SyncState.NONE) {
			return;
		}
		setForceRefreshing(true);
		await ringManagementService.syncData();
		await feedService.fetchAll();
		setForceRefreshing(false);
	}, [syncState]);

	const userSettings = useUserSettings();
	const { format } = useI18n();
	const notifications = useNotifications();
	const { loading, result: recommendations } = useRecommendations();

	const data = [];
	data.push(<QuickAccess />);
	data.push(
		<View style={{ paddingHorizontal: 6 }}>
			<IfAdmin>
				<PrimaryButton onPress={feedService._DEBUG_reset}>RESET</PrimaryButton>
			</IfAdmin>
			{notifications[0] && (
				<Fade isVisible isAnimatedOnMount>
					<Notification notification={notifications[0]} />
				</Fade>
			)}
		</View>
	);
	Object.keys(recommendations).map((date, key) => {
		data.push(
			<View style={{ paddingHorizontal: 6 }} key={date}>
				{date !== "today" && (
					<View style={{ alignItems: "center", marginTop: 15 }}>
						<Separator />
						<MetaDataText style={{ paddingHorizontal: 8, fontSize: 8, backgroundColor: colors.lightgray }}>
							{date === "yesterday"
								? format("global.yesterday").toUpperCase()
								: moment(date).format(userSettings?.dateFormat)}
						</MetaDataText>
					</View>
				)}
				{recommendations[date].map((banner) => {
					return <Recommendation key={banner.id} recommendation={banner} style={{ margin: 10 }} />;
				})}
			</View>
		);
	});
	data.push(<SpinnerContainer>{loading && <Spinner size={20}></Spinner>}</SpinnerContainer>);

	return (
		<Container>
			<CirclesBanner />
			<FlatList
				refreshControl={
					<RefreshControl
						enabled={syncState === SyncState.NONE}
						refreshing={forceRefreshing}
						onRefresh={() => forceRefresh()}
					/>
				}
				data={data}
				style={{ flex: 1 }}
				renderItem={(item) => {
					return item.item;
				}}
				onEndReached={(end) => {
					if (!loading) appStateService.recommendationsCount.update((state) => state + BANNER_TO_LOAD_ON_END);
				}}
				refreshing={loading}
				progressViewOffset={100}
			/>
		</Container>
	);
};

const SpinnerContainer = styled.View`
	height: 40px;
	padding: 10px;
`;

const Container = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
`;

const Separator = styled.View`
	height: 1px;
	position: absolute;
	left: 20px;
	top: 5px;
	right: 20px;
	background-color: ${colors.gray};
`;
