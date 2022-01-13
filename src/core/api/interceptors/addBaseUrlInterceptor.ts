import { Interceptor } from "@core/api/interceptors/interceptor";
import { AxiosRequestConfig } from "axios";
import Config from "react-native-config";

/**
 * Interceptor which add the API url.
 * We can inject a flag to tell the interceptor that we need the back office url.
 */
export const addBaseUrlInterceptor: Interceptor<AxiosRequestConfig & { _useBackOffice?: true }> = {
	onFulfilled: (config) => ({
		...config,
		url: config._useBackOffice
			? `${Config.API_BACKOFFICE_BASE_URL}${config.url}`
			: `${Config.API_BASE_URL}${config.url}`,
	}),
};
