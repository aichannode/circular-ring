import { ApiService } from "@core/api/apiService";
import { AppStateService } from "@domain/appState/appStateService";
import { AppStateStorage } from "@domain/appState/appStateStorage";
import { CognitoAuthService } from "@domain/auth/cognito-auth/cognitoAuthService";
import { TokenPayload } from "@domain/auth/type";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { CalibrationApi } from "@domain/calibration/calibrationApi";
import { CalibrationService } from "@domain/calibration/calibrationService";
import { CircleAlarmService } from "@domain/circleAlarm/circleAlarmService";
import { CirclesApi } from "@domain/circles/circlesApi";
import { CirclesService } from "@domain/circles/circlesService";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { FavoriteDeviceStorage } from "@domain/device/favoriteDeviceStorage";
import { UserDevicesStorage } from "@domain/device/userDevicesStorage";
import { DevFakeDeviceService, EmptyFakeDeviceService } from "@domain/fake/fakeDeviceService";
import { FeedApi } from "@domain/feed/feedApi";
import { FeedService } from "@domain/feed/feedService";
import { FeedStorage } from "@domain/feed/feedStorage";
import { LeaderboardApi } from "@domain/leaderboard/leaderboardApi";
import { LeaderboardService } from "@domain/leaderboard/leaderboardService";
import { UserPreferencesService } from "@domain/preferences/userPreferencesService";
import { UserPreferencesStorage } from "@domain/preferences/userPreferencesStorage";
import { RingApi } from "@domain/ring/ringApi";
import { RingDataStorage } from "@domain/ring/ringDataStorage";
import { RingManagementService } from "@domain/ring/ringManagementService";
import { TimerService } from "@domain/timer/timerService";
import { UserApi } from "@domain/user/userApi";
import { UserService } from "@domain/user/userService";
import { UserStorage } from "@domain/user/userStorage";
import React, { createContext, useContext } from "react";
import { Config } from "react-native-config";

console.log("ENVIRONNEMENT =", Config.ENVIRONNEMENT);
const fakeDeviceService = Config.ENVIRONNEMENT === "dev" ? new DevFakeDeviceService() : new EmptyFakeDeviceService();

const appStateStorage = new AppStateStorage();
const appStateService = new AppStateService(appStateStorage);
const userStorage = new UserStorage();
const favoriteDeviceStorage = new FavoriteDeviceStorage();
const ringDataStorage = new RingDataStorage();
const userDevicesStorage = new UserDevicesStorage();

export const apiService = new ApiService();

const ringApi = new RingApi(apiService);

const cognitoAuthService = new CognitoAuthService<TokenPayload>();

const userApi = new UserApi(apiService);

const bluetoothService = new BluetoothService();
const bleDeviceService = new BleDeviceService(
	bluetoothService,
	fakeDeviceService,
	favoriteDeviceStorage,
	ringApi,
	appStateService
);
const circleAlarmService = new CircleAlarmService(bleDeviceService);
const ringManagementService = new RingManagementService(bleDeviceService, ringDataStorage, ringApi, appStateService);

const userService = new UserService(cognitoAuthService, userApi, userStorage, bleDeviceService, appStateService);
const circlesApi = new CirclesApi(apiService);
const circlesService = new CirclesService(circlesApi, appStateService);

const userPreferencesStorage = new UserPreferencesStorage();
const userPreferencesService = new UserPreferencesService(userPreferencesStorage);

const calibrationApi = new CalibrationApi(apiService);
const calibrationService = new CalibrationService(calibrationApi);

const feedStorage = new FeedStorage();
const feedApi = new FeedApi(apiService);
const feedService = new FeedService(feedStorage, feedApi, appStateService, userService);

const timerService = new TimerService(bleDeviceService);
const leaderboardApi = new LeaderboardApi(apiService);
const leaderboardService = new LeaderboardService(leaderboardApi);

export const services = {
	cognitoAuthService,
	bluetoothService,
	bleDeviceService,
	userService,
	ringManagementService,
	circleAlarmService,
	userPreferencesService,
	calibrationService,
	feedService,
	circlesService,
	fakeDeviceService,
	timerService,
	ringApi,
	userDevicesStorage,
	appStateService,
	leaderboardService,
};

export type Services = typeof services;
export const ServicesContext = createContext<Services | null>(null);
export const ServicesProvider: React.FC = ({ children }) => {
	return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
};

export function useServices(): Services {
	const services = useContext(ServicesContext);
	if (!services) {
		throw Error("ServiceContext not defined");
	}
	return services;
}

export async function initializeServices() {
	apiService.init(cognitoAuthService);
	await cognitoAuthService.init(); // must be initialized first
	return Promise.all(
		Object.values(services)
			.filter((service) => service !== cognitoAuthService)
			.map((service) => {
				if ("init" in service) {
					return service.init();
				}
			})
			.filter(Boolean)
	);
}

export async function resetServices() {
	return Promise.all(
		Object.values(services)
			.filter((service) => service !== cognitoAuthService)
			.map((service) => {
				if ("reset" in service) {
					return service.reset();
				}
			})
			.filter(Boolean)
	);
}
