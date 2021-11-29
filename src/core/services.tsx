import { ApiService } from "@core/api/apiService";
import { CognitoAuthService } from "@domain/auth/cognito-auth/cognitoAuthService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { CalendarApi } from "@domain/calendar/calendarApi";
import { CalendarService } from "@domain/calendar/calendarService";
import { CalibrationApi } from "@domain/calibration/calibrationApi";
import { CalibrationService } from "@domain/calibration/calibrationService";
import { CircleAlarmService } from "@domain/circleAlarm/circleAlarmService";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { FavoriteDeviceStorage } from "@domain/device/favoriteDeviceStorage";
import { DevFakeDeviceService, EmptyFakeDeviceService } from "@domain/fake/fakeDeviceService";
import { HomeBannerApi } from "@domain/homeBanner/homeBannerApi";
import { HomeBannerService } from "@domain/homeBanner/homeBannerService";
import { NotificationStorage } from "@domain/homeBanner/notificationStorage";
import { MeasureApi } from "@domain/measure/measureApi";
import { MeasureService } from "@domain/measure/measureService";
import { UserPreferencesService } from "@domain/preferences/userPreferencesService";
import { UserPreferencesStorage } from "@domain/preferences/userPreferencesStorage";
import { RingApi } from "@domain/ring/ringApi";
import { RingDataStorage } from "@domain/ring/ringDataStorage";
import { RingManagementService } from "@domain/ring/ringManagementService";
import { UserRingsStorage } from "@domain/ring/userRingsStorage";
import { UserApi } from "@domain/user/userApi";
import { UserService } from "@domain/user/userService";
import { UserStorage } from "@domain/user/userStorage";
import { UserQuickAccess } from "@domain/quickaccess/quickAccessService";
import React, { createContext, useContext } from "react";
import { Config } from "react-native-config";
import { QuickAccessStorage } from "@domain/quickaccess/quickAccessStorage";
import { TimerService } from "@domain/timer/timerService";
import { TokenPayload } from "@domain/auth/type";

const fakeDeviceService = Config.ENVIRONNEMENT === "dev" ? new DevFakeDeviceService() : new EmptyFakeDeviceService();

const userStorage = new UserStorage();
const favoriteDeviceStorage = new FavoriteDeviceStorage();
const ringDataStorage = new RingDataStorage();
const userRingsStorage = new UserRingsStorage();

const apiService = new ApiService();

const ringApi = new RingApi(apiService);

const cognitoAuthService = new CognitoAuthService<TokenPayload>();

const userApi = new UserApi(apiService);
const userService = new UserService(cognitoAuthService, userApi, userStorage);

const bluetoothService = new BluetoothService();
const bleDeviceService = new BleDeviceService(
	bluetoothService,
	fakeDeviceService,
	favoriteDeviceStorage,
	userService,
	ringApi
);
const circleAlarmService = new CircleAlarmService(bleDeviceService);
const ringManagementService = new RingManagementService(
	userService,
	bleDeviceService,
	userRingsStorage,
	ringDataStorage,
	ringApi
);

const measureApi = new MeasureApi(apiService);
const measureService = new MeasureService(measureApi);

const userPreferencesStorage = new UserPreferencesStorage();
const userPreferencesService = new UserPreferencesService(userPreferencesStorage);

const quickAccessStorage = new QuickAccessStorage();
const userQuickAccess = new UserQuickAccess(quickAccessStorage);

const calibrationApi = new CalibrationApi(apiService);
const calibrationService = new CalibrationService(calibrationApi);

const homeBannerStorage = new NotificationStorage();
const homeBannerApi = new HomeBannerApi(apiService);
const homeBannerService = new HomeBannerService(homeBannerStorage, homeBannerApi);

const calendarApi = new CalendarApi(apiService);
const calendarService = new CalendarService(calendarApi, userService);
const timerService = new TimerService(bleDeviceService);

export const services = {
	cognitoAuthService,
	bluetoothService,
	bleDeviceService,
	userService,
	ringManagementService,
	measureService,
	circleAlarmService,
	userPreferencesService,
	calibrationService,
	homeBannerService,
	fakeDeviceService,
	calendarService,
	userQuickAccess,
	timerService,
	ringApi,
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
