import { BluetoothService } from "@domain/bluetooth/bluetoothService";
import { createContext, useContext } from "react";
import React from "react";

const bluetoothService = new BluetoothService();

export const services = {
	bluetoothService,
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
