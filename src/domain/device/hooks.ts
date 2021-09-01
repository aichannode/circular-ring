import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const usePairingState = () => useObservable(useServices().deviceService.pairingState);
export const useDevices = () => useObservable(useServices().deviceService.devices);
