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

  constructor(private readonly authService: CircularAuthService) {
    this.instance = axios.create();
    this.instance.defaults.headers = { "x-api-version": "1.0" };
    addRequestInterceptor(this.instance, addBaseUrlInterceptor);
    addRequestInterceptor(this.instance, addAuthorizationInterceptor(this.authService));
    addResponseInterceptor(this.instance, logResponseInterceptor(this.logger));
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
