import { ApiService } from "@core/api/apiService";
import { CognitoAuthService } from "@domain/auth/cognito-auth/cognitoAuthService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { CalibrationApi } from "@domain/calibration/calibrationApi";
import { CalibrationService } from "@domain/calibration/calibrationService";
import { CircleActivityApi } from "@domain/circleActivity/circleActivityApi";
import { CircleActivityService } from "@domain/circleActivity/circleActivityService";
import { DeviceService } from "@domain/device/deviceService";
import { FavoriteDeviceStorage } from "@domain/device/favoriteDeviceStorage";
import { DevFakeDeviceService, EmptyFakeDeviceService } from "@domain/fake/fakeDeviceService";
import { HomeBannerApi } from "@domain/homeBanner/homeBannerApi";
import { HomeBannerService } from "@domain/homeBanner/homeBannerService";
import { HomeBannerStorage } from "@domain/homeBanner/homeBannerStorage";
import { UserPreferencesService } from "@domain/preferences/userPreferencesService";
import { UserPreferencesStorage } from "@domain/preferences/userPreferencesStorage";
import { RingApi } from "@domain/ring/ringApi";
import { RingDataStorage } from "@domain/ring/ringDataStorage";
import { RingService } from "@domain/ring/ringService";
import { UserRingsStorage } from "@domain/ring/userRingsStorage";
import { UserApi } from "@domain/user/userApi";
import { UserService } from "@domain/user/userService";
import { UserStorage } from "@domain/user/userStorage";
import React, { createContext, useContext } from "react";
import { Config } from "react-native-config";

const fakeDeviceService = Config.ENVIRONNEMENT === "dev" ? new DevFakeDeviceService() : new EmptyFakeDeviceService();

const userStorage = new UserStorage();
const favoriteDeviceStorage = new FavoriteDeviceStorage();
const ringDataStorage = new RingDataStorage();
const userRingsStorage = new UserRingsStorage();

const apiService = new ApiService();
const circleActivityApi = new CircleActivityApi();

const ringApi = new RingApi(apiService);

const cognitoAuthService = new CognitoAuthService();

const bluetoothService = new BluetoothService();
const deviceService = new DeviceService(bluetoothService, fakeDeviceService, favoriteDeviceStorage);
const ringService = new RingService(deviceService, cognitoAuthService, userRingsStorage, ringDataStorage, ringApi);
const circleActivityService = new CircleActivityService(circleActivityApi);

const userApi = new UserApi(apiService);
const userService = new UserService(cognitoAuthService, userApi, userStorage);

const userPreferencesStorage = new UserPreferencesStorage();
const userPreferencesService = new UserPreferencesService(userPreferencesStorage);
const calibrationApi = new CalibrationApi(apiService);
const calibrationService = new CalibrationService(calibrationApi);

const homeBannerStorage = new HomeBannerStorage();
const homeBannerApi = new HomeBannerApi(apiService);
const homeBannerService = new HomeBannerService(homeBannerStorage, homeBannerApi);

export const services = {
	cognitoAuthService,
	bluetoothService,
	deviceService,
	userService,
	ringService,
	circleActivityService,
	userPreferencesService,
	calibrationService,
	homeBannerService,
	fakeDeviceService,
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
