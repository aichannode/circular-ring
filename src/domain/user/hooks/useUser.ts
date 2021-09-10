import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useUser = () => useObservable(useServices().userService.user);
export const useUserEmail = () => useObservable(useServices().userService.currentUserEmail);
