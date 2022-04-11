import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface Interceptor<V> {
	onFulfilled?: (value: V) => V | Promise<V>;
	onRejected?: (error: unknown) => unknown;
}

export function addRequestInterceptor(
	axiosInstance: AxiosInstance,
	interceptor: Interceptor<AxiosRequestConfig>
): number {
	return axiosInstance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected);
}

export function addResponseInterceptor(axiosInstance: AxiosInstance, interceptor: Interceptor<AxiosResponse>): number {
	return axiosInstance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
}
