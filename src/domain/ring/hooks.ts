import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useRingBattery = () => useObservable(useServices().ringService.ringBattery);
export const useSyncState = () => useObservable(useServices().ringService.syncState);
