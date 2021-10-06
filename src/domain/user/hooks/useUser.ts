import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useJustRegisteredUserEmail = () => useObservable(useServices().userService.justRegisteredUserEmail);
export const useAuthenticatedUserEmail = () => useObservable(useServices().userService.authenticatedUserEmail);
export const useUser = () => useObservable(useServices().userService.user);
export const useUserSettings = () => useObservable(useServices().userService.userSettings);
export const useUserAdvancedInfo = () => useObservable(useServices().userService.userAdvancedInfo);

export const useUserValidated = () => useObservable(useServices().userService.user)?.validated || false;
export const useUserTutorialCompleted = () => useObservable(useServices().userService.user)?.tutorialCompleted || false;
