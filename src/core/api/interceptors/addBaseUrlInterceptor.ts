import { Interceptor } from "@core/api/interceptors/interceptor";
import { AxiosRequestConfig } from "axios";
import Config from "react-native-config";

export const addBaseUrlInterceptor: Interceptor<AxiosRequestConfig> = {
  onFulfilled: (config) => ({
    ...config,
    url: `${Config.API_BASE_URL}${config.url}`,
  }),
};
