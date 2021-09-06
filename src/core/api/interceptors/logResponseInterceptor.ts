import { Logger } from "@betomorrow/logging-core";
import { AxiosResponse } from "axios";
import { Interceptor } from "./interceptor";
import { AxiosError } from "axios";

export function isAxiosError(error: unknown): error is AxiosError {
	return (error as AxiosError).isAxiosError;
}

export const logResponseInterceptor: (logger: Logger) => Interceptor<AxiosResponse> = (logger) => ({
	onRejected: (error) => {
		if (isAxiosError(error)) {
			logger.debug(
				"Error",
				error.response?.status,
				error.config.method,
				error.config.url,
				error.response?.data.requestId,
				error.config.data,
				JSON.stringify(error.response?.data)
			);
			return Promise.reject(error.response?.data);
		}
		return Promise.reject(error);
	},
});
