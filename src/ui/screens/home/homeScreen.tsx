import { DEFAULT_LOG_DIR } from "@betomorrow/logging-native";
import { useRepresentations } from "@core/representation";
import { apiService, useServices } from "@core/services";
import { useFetchCircles } from "@domain/circles/hooks";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { useSetupState } from "@domain/device/hooks";
import { useNotifications, useRecommendations } from "@domain/feed/hooks";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";
import { useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton } from "@ui/components/buttons";
import Fade from "@ui/components/fade";
import { Spinner } from "@ui/components/spinner";
import { IfAdmin } from "@ui/containers/IfAdmin";
import { CirclesBanner } from "@ui/screens/home/circlesBanner";
import { Notification } from "@ui/screens/home/feedEntities/Notification";
import { NoRingBanner } from "@ui/screens/home/NoRingBanner";
import { QuickAccess } from "@ui/screens/home/quickAccess/quickAccess";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Platform, RefreshControl, Text, View } from "react-native";
import fs from "react-native-fs";
import Mailer, { Attachment } from "react-native-mail";
import styled from "styled-components/native";
import { DataModeBottomSheet } from "./dataModeBottomSheet";
import RecommendationWrapper from "./feedEntities/RecommendationWrapper";
import { SyncBanner } from "./syncBanner";
import { UpdateBanner } from "./updateBanner";

const BANNER_TO_LOAD_ON_END = 2;

export const HomeScreen: React.FC = () => {
	const { userService, feedService, bluetoothService, bleDeviceService, appStateService, ringManagementService } =
		useServices();
	const [hideQuickaccess, setHideQuickaccess] = useState(true);
	const syncState = useSyncState();
	const previousScrollViewY = useRef(0);
	const setupState = useSetupState();
	const dataRateBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const {
		measure: {
			hooks: { useResetMeasureModel },
		},
		calendar: {
			hooks: { useResetCalendarModel },
		},
	} = useRepresentations();
	useFetchCircles();

	useEffect(() => {
		if (appStateService.showDataRatePopup.get()) {
			dataRateBottomSheet?.current?.present();
			appStateService.showDataRatePopup.set(false);
		}
		if (setupState === DeviceSetupState.DISABLED) {
			bluetoothService.enable();
			bleDeviceService.checkSettings();
		}
		if (setupState === DeviceSetupState.LOCATION_DISABLED && Platform.OS === "android") {
			bleDeviceService.requestLocation();
		}
		appStateService.hasReachedHomeScreen.set(true);
	}, []);

	const sendLogsByEmail = async () => {
		const reader = await fs.readDir(DEFAULT_LOG_DIR);
		const attachements: Attachment[] = reader.map((file) => ({
			file,
			path: file.path,
			type: "text",
			name: file.name,
		}));
		Mailer.mail(
			{
				subject: "Logs",
				recipients: ["estebanleclet@gmail.com"],
				body: `<b>${moment().format("YYYY dd hh:mm:ss")}</b>`,
				isHTML: true,
				attachments: attachements,
				ccRecipients: ["estebanleclet+circular@gmail.com"],
			},
			(error, event) => {
				Alert.alert(
					error ?? "",
					event,
					[
						{ text: "Ok", onPress: () => console.log("OK: Email Error Response") },
						{ text: "Cancel", onPress: () => console.log("CANCEL: Email Error Response") },
					],
					{ cancelable: true }
				);
			}
		);
	};

	const resetCache = () => {
		apiService.reset();
		useResetMeasureModel();
		useResetCalendarModel();
	};

	const forceRefresh = useCallback(async () => {
		await ringManagementService.syncData();
		await feedService.fetchAll();
	}, [syncState]);

	const notifications = useNotifications();
	const { loading, result: recommendations } = useRecommendations();
	const remainingDays = useUserCalibrationRemainingDays();

	console.log(process.env);
	const data = [];
	data.push(<SyncBanner onRetry={ringManagementService.syncData} />);
	data.push(<NoRingBanner />);
	data.push(<UpdateBanner />);
	data.push(
		<View style={{ paddingHorizontal: 6 }}>
			<IfAdmin>
				<PrimaryButton style={{ marginVertical: 8 }} onPress={() => sendLogsByEmail()}>
					SEND LOGS BY EMAIL
				</PrimaryButton>
				<PrimaryButton style={{ marginVertical: 8 }} onPress={() => bleDeviceService.write("RWF1S15")}>
					GENERATE RING DATA
				</PrimaryButton>
				<PrimaryButton onPress={feedService._DEBUG_resetAnswers}>RESET ANSWERS</PrimaryButton>
				<PrimaryButton onPress={() => resetCache()}>CLEAR MEASURE AND CACHE</PrimaryButton>
				<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
					<PrimaryButton
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							//@ts-ignore
							userService.user?.set?.({
								...userService.user.get(),
								calibrationRemainingDays: remainingDays - 2,
							});
						}}
					>
						calibDay - 1
					</PrimaryButton>
					<Text style={{ margin: 10, fontWeight: "bold" }}>remainingDays : {remainingDays}</Text>
					<PrimaryButton
						onPress={() => {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							//@ts-ignore
							userService.user?.set?.({
								...userService.user.get(),
								calibrationRemainingDays: remainingDays + 2,
							});
						}}
					>
						calibDay + 1
					</PrimaryButton>
				</View>
				<PrimaryButton
					onPress={() => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						dataRateBottomSheet?.current?.present();
						appStateService.showDataRatePopup.set(true);
					}}
				>
					SHOW DATA RATE POPUP
				</PrimaryButton>
			</IfAdmin>
			{notifications[0] && (
				<Fade isVisible isAnimatedOnMount>
					<Notification notification={notifications[0]} />
				</Fade>
			)}
		</View>
	);

	Object.keys(recommendations).map((date, key) => {
		data.push(<RecommendationWrapper loading={loading} key={date} date={date} recommendations={recommendations} />);
	});
	data.push(<SpinnerContainer>{loading && <Spinner size={20}></Spinner>}</SpinnerContainer>);

	const quickAccessAnim = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		if (hideQuickaccess) {
			Animated.timing(quickAccessAnim, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(quickAccessAnim, {
				toValue: -60,
				duration: 100,
				useNativeDriver: true,
			}).start();
		}
	}, [hideQuickaccess]);

	return (
		<Container>
			<CirclesBanner />
			<Animated.View
				style={{
					zIndex: 10,
					transform: [{ translateY: quickAccessAnim }],
				}}
			>
				<QuickAccess />
			</Animated.View>
			<Animated.FlatList
				refreshControl={
					<RefreshControl enabled={syncState === SyncState.NONE} refreshing={false} onRefresh={() => forceRefresh()} />
				}
				data={data}
				style={{
					flex: 1,
					marginTop: -60,
					paddingTop: 60,
					zIndex: 0,
					flexGrow: 1,
				}}
				renderItem={(item) => {
					return item.item;
				}}
				onScroll={({ nativeEvent }) => {
					const positionY = nativeEvent.contentOffset.y;
					const isAtEnd = positionY + nativeEvent.layoutMeasurement.height > nativeEvent.contentSize.height;
					if ((positionY - previousScrollViewY.current <= 0 || positionY < 50) && !isAtEnd) {
						setHideQuickaccess(true);
					} else if (positionY - previousScrollViewY.current > 0 && positionY > 50) {
						setHideQuickaccess(false);
					}
					previousScrollViewY.current = positionY;
				}}
				onEndReached={() => {
					if (!loading) appStateService.recommendationsCount.update((state) => state + BANNER_TO_LOAD_ON_END);
				}}
				refreshing={loading}
				progressViewOffset={100}
			/>
			<CircularBottomSheet snapPoints={[580]} ref={dataRateBottomSheet}>
				<DataModeBottomSheet onClose={() => dataRateBottomSheet.current?.close()}></DataModeBottomSheet>
			</CircularBottomSheet>
		</Container>
	);
};

const SpinnerContainer = styled.View`
	height: 100px;
	padding: 10px;
`;

const Container = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
`;
