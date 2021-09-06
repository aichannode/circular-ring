import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { DeviceSetupState } from "./deviceService";

export const useSetupState = () => useObservable(useServices().deviceService.setupState);
export const useAccountLinked = () =>
	useObservable(useServices().deviceService.setupState) === DeviceSetupState.FINISHED; // TODO Will probably change once we get users
export const useScannedDevices = () => useObservable(useServices().deviceService.scannedDevices);
