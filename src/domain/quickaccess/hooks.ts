import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useQuickAccess = () => useObservable(useServices().userQuickAccessService.quickaccess);
