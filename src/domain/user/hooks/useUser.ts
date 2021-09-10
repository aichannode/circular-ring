import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useUser = () => useObservable(useServices().userService.user);
