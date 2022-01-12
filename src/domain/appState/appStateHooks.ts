import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useQuickAccess = () => useObservable(useServices().appStateService.quickaccess);
export const useSleepMode = () => useObservable(useServices().appStateService.isInSleepMode);
