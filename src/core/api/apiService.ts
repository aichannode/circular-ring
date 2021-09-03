import { Logger } from "@betomorrow/logging-core";
import { addAuthorizationInterceptor } from "@core/api/interceptors/addAuthorizationInterceptor";
import { addBaseUrlInterceptor } from "@core/api/interceptors/addBaseUrlInterceptor";
import { addRequestInterceptor, addResponseInterceptor } from "@core/api/interceptors/interceptor";
import { logResponseInterceptor } from "@core/api/interceptors/logResponseInterceptor";
import { getLogger } from "@core/logger/logger";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class ApiService {
	private logger: Logger = getLogger("ApiService");
	private readonly instance: AxiosInstance;

	private _authService: CircularAuthService | undefined = undefined;

	constructor() {
		this.instance = axios.create();
		this.instance.defaults.headers = { "x-api-version": "1.0" };
		addRequestInterceptor(this.instance, addBaseUrlInterceptor);
		addResponseInterceptor(this.instance, logResponseInterceptor(this.logger));
	}

	init(circularAuthService: CircularAuthService) {
		if (!this._authService) {
			this._authService = circularAuthService;
			addRequestInterceptor(this.instance, addAuthorizationInterceptor(this._authService));
		} else {
			this.logger.warn("Trying to initialize service twice");
		}
	}

	get<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this.instance.get(url, config);
	}

	post<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
		return this.instance.post(url, data, config);
	}

	delete<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		return this.instance.delete(url, config);
	}
}
