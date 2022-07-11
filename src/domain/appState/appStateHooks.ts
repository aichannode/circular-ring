import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useQuickAccess = () => useObservable(useServices().appStateService.quickAccess);
export const useSleepMode = () => useObservable(useServices().appStateService.isInSleepMode);
export const useCircles = () => useObservable(useServices().appStateService.userCircles);
export const useDefaultCircles = () => useObservable(useServices().appStateService.defaultCircles);
export const useWaitForRingRegistration = () => useObservable(useServices().appStateService.waitForRingRegistration);
