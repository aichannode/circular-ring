import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const usePairingState = () => useObservable(useServices().deviceService.bondState);
export const useDevices = () => useObservable(useServices().deviceService.devices);
