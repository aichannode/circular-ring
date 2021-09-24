import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useSetupState = () => useObservable(useServices().deviceService.setupState);
export const useAutoConnectState = () => useObservable(useServices().deviceService.autoConnectState);
export const useAccountLinked = () => !!useObservable(useServices().ringService.userRing);
// useObservable(useServices().deviceService.setupState) === DeviceSetupState.FINISHED; // TODO Will probably change once we get users
export const useDeviceStored = () => !!useObservable(useServices().deviceService.favoriteDevice);
export const useScannedDevices = () => useObservable(useServices().deviceService.scannedDevices);
