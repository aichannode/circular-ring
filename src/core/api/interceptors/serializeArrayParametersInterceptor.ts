import { AxiosRequestConfig } from "axios";
import queryString from "query-string";
import { Interceptor } from "./interceptor";

export const serializeArrayParametersInterceptor: Interceptor<AxiosRequestConfig> = {
	onFulfilled: (config) => ({
		...config,
		paramsSerializer: (params) => queryString.stringify(params, { arrayFormat: "none", encode: false }),
	}),
};
