import { Interceptor } from "@core/api/interceptors/interceptor";
import { AuthService } from "@domain/auth/authService";
import { AxiosRequestConfig } from "axios";

export const addAuthorizationInterceptor: (authService: AuthService) => Interceptor<AxiosRequestConfig> = (
	authenticationService
) => ({
	onFulfilled: async (config) => {
		const token = await authenticationService.getToken();
		return {
			...config,
			headers: token ? { ...config.headers, Authorization: `Bearer ${token}` } : config.headers,
		};
	},
});
