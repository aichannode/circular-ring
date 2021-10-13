import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { useCallback } from "react";

export const useSetupState = () => useObservable(useServices().bleDeviceService.setupState);
export const useAutoConnectState = () => useObservable(useServices().bleDeviceService.autoConnectState);
export const useAccountLinked = () => {
	const { ringManagementService, fakeDeviceService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);
	const faked = useObservable(fakeDeviceService.fakeDeviceEnabled);
	return userRings.length > 0 || faked;
};

export const useDeviceStored = () => useObservable(useServices().bleDeviceService.favoriteDevice);
export const useScannedDevices = () => useObservable(useServices().bleDeviceService.scannedDevices);

export const useRingBattery = () => useObservable(useServices().bleDeviceService.currentRingBattery);

export function useLiveData() {
	const { bleDeviceService } = useServices();
	const { data, listening } = useObservable(bleDeviceService.currentRingLiveData);
	const start = useCallback(() => bleDeviceService.listenLiveData(), []);
	const stop = useCallback(() => bleDeviceService.stopLiveData(), []);

	return { data, listening, start, stop };
}
