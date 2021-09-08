import { ApiService } from "@core/api/apiService";
import { AccessTokenStorage } from "@domain/auth/accessTokenStorage";
import { CircularAuthApi } from "@domain/auth/circularAuthApi";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { UserApi } from "@domain/user/userApi";
import { UserService } from "@domain/user/userService";
import { UserStorage } from "@domain/user/userStorage";
import { createContext, useContext } from "react";
import React from "react";
import { DeviceService } from "@domain/device/deviceService";
import { FavoriteDeviceStorage } from "@domain/device/favoriteDeviceStorage";
import { RingService } from "@domain/ring/ringService";

const accessTokenStorage = new AccessTokenStorage();
const userStorage = new UserStorage();
const favoriteDeviceStorage = new FavoriteDeviceStorage();

const apiService = new ApiService();

const bluetoothService = new BluetoothService();
const deviceService = new DeviceService(bluetoothService, favoriteDeviceStorage);
const ringService = new RingService(deviceService);

const circularAuthApi = new CircularAuthApi(apiService);
const circularAuthService = new CircularAuthService(circularAuthApi, accessTokenStorage);
const userApi = new UserApi(apiService);
const userService = new UserService(circularAuthService, userApi, userStorage);

export const services = {
	bluetoothService,
	deviceService,
	userService,
	ringService,
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
	apiService.init(circularAuthService);
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
