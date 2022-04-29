import { useServices } from "@core/services";
import { DateFormat, HourFormat, TemperatureFormat } from "@domain/units";
import { useObservable } from "micro-observables";

export const useJustRegisteredUserEmail = () => useObservable(useServices().userService.justRegisteredUserEmail);
export const useAuthenticatedUserEmail = () => useObservable(useServices().userService.authenticatedUserEmail);
export const useUser = () => useObservable(useServices().userService.user);
export const useUserSettings = () => useObservable(useServices().userService.userSettings);
export const useIs24h = () => {
	const settings = useObservable(useServices().userService.userSettings);
	return settings?.hourFormat === HourFormat.TWENTY_FOUR;
};

export const useIsUSCS = () => {
	const settings = useObservable(useServices().userService.userSettings);
	return settings?.dateFormat === DateFormat.USCS;
};

export const useIsCelsius = () => {
	const settings = useObservable(useServices().userService.userSettings);
	return settings?.temperatureFormat === TemperatureFormat.CELSIUS;
};

export const useUserAdvancedInfo = () => useObservable(useServices().userService.userAdvancedInfo);
export const useNotificationsSettings = () => useObservable(useServices().userService.userNotificationsSettings);

export const useUserValidated = () => useObservable(useServices().userService.user)?.validated || false;
export const useUserTutorialCompleted = () => useObservable(useServices().userService.user)?.tutorialCompleted || false;

export const useUserCalibrationRemainingDays = () =>
	useObservable(useServices().userService.user)?.calibrationRemainingDays || 0;
