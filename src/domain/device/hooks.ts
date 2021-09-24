import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useSetupState = () => useObservable(useServices().deviceService.setupState);
export const useAutoConnectState = () => useObservable(useServices().deviceService.autoConnectState);
export const useAccountLinked = () => {
	const { ringService, fakeDeviceService } = useServices();
	const userRing = useObservable(ringService.userRing);
	const faked = useObservable(fakeDeviceService.fakeDeviceEnabled);
	return !!userRing || faked;
};

export const useDeviceStored = () => useObservable(useServices().deviceService.favoriteDevice);
export const useScannedDevices = () => useObservable(useServices().deviceService.scannedDevices);
