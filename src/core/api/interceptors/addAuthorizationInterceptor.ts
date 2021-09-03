import { Interceptor } from "@core/api/interceptors/interceptor";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import { AxiosRequestConfig } from "axios";

export const addAuthorizationInterceptor: (circularAuthService: CircularAuthService) => Interceptor<AxiosRequestConfig> = (
  authenticationService,
) => ({
  onFulfilled: async (config) => {
    const token = await authenticationService.getToken();
    return {
      ...config,
      headers: token ? { ...config.headers, Authorization: `Bearer ${token}` } : config.headers,
    };
  },
});
