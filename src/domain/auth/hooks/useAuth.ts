import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

export const useAuth = () => !!useObservable(useServices().cognitoAuthService.authToken);
