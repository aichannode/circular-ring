import { DEFAULT_LOG_DIR } from "@betomorrow/logging-native";
import { useRepresentations } from "@core/representation";
import { apiService, useServices } from "@core/services";
import { useFetchCircles } from "@domain/circles/hooks";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { useSetupState } from "@domain/device/hooks";
import { useNotifications, useRecommendations } from "@domain/feed/hooks";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";
import { DateFormat } from "@domain/units";
import { useUserCalibrationRemainingDays, useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import Fade from "@ui/components/fade";
import { Spinner } from "@ui/components/spinner";
import { MetaDataText } from "@ui/components/text";
import { IfAdmin } from "@ui/containers/IfAdmin";
import { useI18n } from "@ui/i18n";
import { CirclesBanner } from "@ui/screens/home/circlesBanner";
import { Notification } from "@ui/screens/home/feedEntities/Notification";
import { Recommendation } from "@ui/screens/home/feedEntities/Recommendation";
import { QuickAccess } from "@ui/screens/home/quickAccess/quickAccess";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Platform, RefreshControl, View } from "react-native";
import fs from "react-native-fs";
import Mailer, { Attachment } from "react-native-mail";
import styled from "styled-components/native";
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
		console.log("DEFAULT_LOG_DIR", DEFAULT_LOG_DIR);
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

	const userSettings = useUserSettings();
	const { format } = useI18n();
	const notifications = useNotifications();
	const { loading, result: recommendations } = useRecommendations();
	const remainingDays = useUserCalibrationRemainingDays();

	const recommendationsAnim = useRef(new Animated.Value(0)).current;
	const animation = Animated.timing(recommendationsAnim, {
		toValue: 200,
		duration: 1500,
		useNativeDriver: true,
	});

	useEffect(() => {
		if (!loading) animation.start();
		else animation.stop();
	}, [recommendationsAnim]);

	const data = [];
	data.push(<SyncBanner onRetry={ringManagementService.syncData} />);
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
				<PrimaryButton
					onPress={() => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						userService.user?.set?.({
							...userService.user.get(),
							calibrationRemainingDays: 12,
						});
					}}
				>
					ADD {remainingDays}
				</PrimaryButton>
			</IfAdmin>
			{notifications[0] && (
				<Fade isVisible isAnimatedOnMount>
					<Notification notification={notifications[0]} />
				</Fade>
			)}
		</View>
	);
	Object.keys(recommendations).map((date) => {
		const dateFormat = userSettings?.dateFormat === DateFormat.SI ? "DD/MM/YYYY" : "MM/DD/YYYY";
		data.push(
			<Animated.View
				style={{
					top: -200,
					flex: 1,
					transform: [{ translateY: recommendationsAnim }],
				}}
			>
				<Fade isVisible isAnimatedOnMount duration={1000}>
					<View style={{ paddingHorizontal: 6 }} key={date}>
						{date !== "today" && (
							<View style={{ alignItems: "center", marginTop: 15 }}>
								<Separator />
								<MetaDataText style={{ paddingHorizontal: 8, fontSize: 8, backgroundColor: colors.lightgray }}>
									{date === "yesterday" ? format("global.yesterday").toUpperCase() : moment(date).format(dateFormat)}
								</MetaDataText>
							</View>
						)}
						{recommendations[date].map((banner) => {
							return <Recommendation key={banner.id} recommendation={banner} style={{ margin: 10 }} />;
						})}
					</View>
				</Fade>
			</Animated.View>
		);
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

const Separator = styled.View`
	height: 1px;
	position: absolute;
	left: 20px;
	top: 5px;
	right: 20px;
	background-color: ${colors.gray};
`;
