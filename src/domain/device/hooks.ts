import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useSetupState = () => useObservable(useServices().deviceService.setupState);
export const useAutoConnectState = () => useObservable(useServices().deviceService.autoConnectState);
export const useAccountLinked = () => {
	const { ringService, fakeDeviceService } = useServices();
	const userRings = useObservable(ringService.userRings);
	const faked = useObservable(fakeDeviceService.fakeDeviceEnabled);
	return userRings.length > 0 || faked;
};

export const useDeviceStored = () => useObservable(useServices().deviceService.favoriteDevice);
export const useScannedDevices = () => useObservable(useServices().deviceService.scannedDevices);
