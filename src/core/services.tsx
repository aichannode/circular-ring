import { ApiService } from "@core/api/apiService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { CognitoAuthService } from "@domain/auth/cognito-auth/cognitoAuthService";
import { UserService } from "@domain/user/userService";
import { UserStorage } from "@domain/user/userStorage";
import { createContext, useContext } from "react";
import React from "react";
import { DeviceService } from "@domain/device/deviceService";
import { FavoriteDeviceStorage } from "@domain/device/favoriteDeviceStorage";
import { RingService } from "@domain/ring/ringService";
import { RingDataStorage } from "@domain/ring/ringDataStorage";
import { RingApi } from "@domain/ring/ringApi";
import { CircleActivityApi } from "@domain/circleActivity/circleActivityApi";
import { CircleActivityService } from "@domain/circleActivity/circleActivityService";
import { UserPreferencesStorage } from "@domain/preferences/userPreferencesStorage";
import { UserPreferencesService } from "@domain/preferences/userPreferencesService";

const userStorage = new UserStorage();
const favoriteDeviceStorage = new FavoriteDeviceStorage();
const ringDataStorage = new RingDataStorage();

const apiService = new ApiService();
const circleActivityApi = new CircleActivityApi();

const ringApi = new RingApi(apiService);

const bluetoothService = new BluetoothService();
const deviceService = new DeviceService(bluetoothService, favoriteDeviceStorage);
const ringService = new RingService(deviceService, ringDataStorage, ringApi);
const circleActivityService = new CircleActivityService(circleActivityApi);

const cognitoAuthService = new CognitoAuthService();

// const userApi = new UserApi(apiService);
// const userService = new UserService(circularAuthService, /*userApi, */ userStorage);
const userService = new UserService(cognitoAuthService, /*userApi, */ userStorage);

const userPreferencesStorage = new UserPreferencesStorage();
const userPreferencesService = new UserPreferencesService(userPreferencesStorage);

export const services = {
	cognitoAuthService,
	bluetoothService,
	deviceService,
	userService,
	ringService,
	circleActivityService,
	userPreferencesService,
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

export function initializeServices() {
	apiService.init(cognitoAuthService);
	return Promise.all(
		Object.values(services)
			.map((service) => {
				if ("init" in service) {
					return service.init();
				}
			})
			.filter(Boolean)
	);
}
