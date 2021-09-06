import { ApiService } from "@core/api/apiService";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { UserService } from "@domain/user/userService";
import { createContext, useContext } from "react";
import React from "react";
import { DeviceService } from "@domain/device/deviceService";

const apiService = new ApiService();

const bluetoothService = new BluetoothService();
const deviceService = new DeviceService(bluetoothService);

const circularAuthService = new CircularAuthService(apiService);
circularAuthService.init();

const userService = new UserService(circularAuthService, apiService);

export const services = {
	bluetoothService,
	deviceService,
	userService,
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
