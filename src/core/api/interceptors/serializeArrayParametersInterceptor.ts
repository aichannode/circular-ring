import { AxiosRequestConfig } from "axios";
import queryString from "query-string";
import { Interceptor } from "./interceptor";

export const serializeArrayParametersInterceptor: Interceptor<AxiosRequestConfig> = {
	onFulfilled: (config) => {
		return {
			...config,
			paramsSerializer: (params) => queryString.stringify(params, { arrayFormat: "none" }),
		};
	},
};
