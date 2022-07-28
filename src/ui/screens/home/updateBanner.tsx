import { useServices } from "@core/services";
import { DeviceConnectionState } from "@domain/device/bleDeviceService";
import { UserRing } from "@domain/ring/ring";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { Banner } from "@ui/screens/home/components/Banner";
import { useObservable } from "micro-observables";
import React, { useEffect, useState } from "react";
import { Linking, Platform, StyleProp, View, ViewStyle } from "react-native";
import { WordingKey } from "src/wordings";

// import { version } from "../../../../package.json";

interface UpdateBannerProps {
	style?: StyleProp<ViewStyle>;
}

const appStoreUrl = "itms-apps://apps.apple.com/us/app/circular-ring/id1583942047";
const playStoreUrl = "https://play.google.com/store/apps/details?id=com.circular.circular";

export const UpdateBanner: React.FC<UpdateBannerProps> = () => {
	const [isAppUpdated /*, setIsAppUpdated*/] = useState<boolean>(true);
	const [isFirmwareUptodate, setIsFirmwareUpdated] = useState<boolean>(true);
	const { appStateService, ringApi, bleDeviceService } = useServices();
	// DEV TESTS const lastAppVersion = "0.1.0-alpha.7"; TODO Fetch the lastAppVersion with the backend
	const lastFirmwareVersion = useObservable(ringApi.firmwareVersion);
	const userRings = useObservable(appStateService.userRings);
	const displayBanner = useObservable(appStateService.showUpdateBanner)?.display;
	const currentRing: UserRing = userRings.filter((ring) => ring.connected)[0];
	const connectionState = useObservable(bleDeviceService.connectionState);

	const { navigate } = useRoutesNavigation();
	useEffect(() => {
		ringApi.getLatestFirmware();
	}, []);
	useEffect(() => {
		const version = appStateService.showUpdateBanner.get()?.firmwareVersion;
		if (lastFirmwareVersion && lastFirmwareVersion != version) {
			appStateService.showUpdateBanner.set({ firmwareVersion: lastFirmwareVersion, display: true });
		}
		if (currentRing && lastFirmwareVersion) setIsFirmwareUpdated(currentRing.firmware === lastFirmwareVersion);
	}, [lastFirmwareVersion, currentRing?.firmware]);

	const openPlatformURL = () => {
		if (Platform.OS === "ios") Linking.canOpenURL(appStoreUrl).then(() => Linking.openURL(appStoreUrl));
		else Linking.canOpenURL(playStoreUrl).then(() => Linking.openURL(playStoreUrl));
	};

	if (!displayBanner || isFirmwareUptodate || connectionState !== DeviceConnectionState.CONNECTED) return <View />;

	const img = !isAppUpdated ? require("@assets/images/updateApp.png") : require("@assets/images/updateFirmware.png");
	const title: WordingKey = ("banner." + (!isAppUpdated ? "app" : "firmware") + "_update.title") as WordingKey;
	const description: WordingKey = ("banner." +
		(!isAppUpdated ? "app" : "firmware") +
		"_update.description") as WordingKey;
	const onPress: () => void = !isAppUpdated ? openPlatformURL : () => navigate(Routes.RingFirmwareUpdate);

	return (
		<Banner
			img={img}
			title={title}
			description={description}
			onPress={onPress}
			onClose={() =>
				appStateService.showUpdateBanner.set({ firmwareVersion: lastFirmwareVersion ?? "", display: false })
			}
		/>
	);
};
