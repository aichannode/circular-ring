import { Logger } from "@betomorrow/logging-core";
import { addAuthorizationInterceptor } from "@core/api/interceptors/addAuthorizationInterceptor";
import { addBaseUrlInterceptor } from "@core/api/interceptors/addBaseUrlInterceptor";
import { addRequestInterceptor, addResponseInterceptor } from "@core/api/interceptors/interceptor";
import { logResponseInterceptor } from "@core/api/interceptors/logResponseInterceptor";
import { getLogger } from "@core/logger/logger";
import { AuthService } from "@domain/auth/authService";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { serializeArrayParametersInterceptor } from "./interceptors/serializeArrayParametersInterceptor";

function timer(ms: number) {
	return new Promise((res) => setTimeout(res, ms));
}

type CacheOptions = Partial<{
	ttl: number;
}>;

// TODO implements auto clean stale data
// TODO implements persistence
interface IStore<K, V> {
	set(key: K, value: V, options?: CacheOptions): void;
	get(key: K): Promise<V | undefined>;
}

class CacheManager implements IStore<string, string> {
	private store: Map<string, CacheOptions & { createdAt: number; value: string }> = new Map();
	set(key: string, value: string, options?: CacheOptions) {
		this.store.set(key, { value, createdAt: Date.now(), ttl: options?.ttl });
	}
	async get(key: string): Promise<string | undefined> {
		const cacheEntry = await this.store.get(key);
		// No cached data
		if (!cacheEntry) {
			return undefined;
		}
		// Data is stale, purge
		if (cacheEntry.ttl && Date.now() - cacheEntry.createdAt > cacheEntry.ttl) {
			this.store.delete(key);
			return undefined;
		}
		const cachedData = cacheEntry?.value;

		if (cachedData === "fetching") {
			if (__DEV__) {
				console.info("[CACHE]: ALREADY FETCHING", key);
			}
			await timer(2000);
			return await this.get(key);
		}
		return cachedData;
	}
}

export class ApiService {
	private logger: Logger = getLogger("ApiService");
	private readonly instance: AxiosInstance;

	private _authService: AuthService | undefined = undefined;

	cacheManager: CacheManager;

	private async getWithCache<T>(cachedId: string, fetch: () => Promise<T>, useForceRefresh = false): Promise<T> {
		const cachedData = await this.cacheManager.get(cachedId);
		if (cachedData && !useForceRefresh) {
			const data = JSON.parse(cachedData);
			return data as T;
		} else {
			this.cacheManager.set(cachedId, "fetching", { ttl: 10 * 1000 });
			const result = await fetch();
			this.cacheManager.set(cachedId, JSON.stringify(result), {
				ttl: 15 * 60 * 1000, // 15 mins cache
			});
			return result;
		}
	}
	constructor() {
		this.cacheManager = new CacheManager();
		this.instance = axios.create();
		this.instance.defaults.headers = { "x-api-version": "1.0" };
		addRequestInterceptor(this.instance, addBaseUrlInterceptor);
		addRequestInterceptor(this.instance, serializeArrayParametersInterceptor);
		addResponseInterceptor(this.instance, logResponseInterceptor(this.logger));
	}

	init(authService: AuthService) {
		if (!this._authService) {
			this._authService = authService;
			addRequestInterceptor(this.instance, addAuthorizationInterceptor(this._authService));
		} else {
			this.logger.warn("Trying to initialize service twice");
		}
	}

	get<T = unknown, R = AxiosResponse<T>>(
		url: string,
		config?: AxiosRequestConfig & { useForceRefresh?: boolean }
	): Promise<R> {
		this.logger.debug("[GET] " + url);
		const cacheId = url + JSON.stringify(config?.params);
		return this.getWithCache(cacheId, () => this.instance.get(url, config), config?.useForceRefresh);
	}

	post<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
		this.logger.debug("[POST] " + url + " -- Data " + JSON.stringify(data));
		return this.instance.post(url, data, config);
	}

	put<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
		this.logger.debug("[PUT] " + url + " -- Data " + JSON.stringify(data));
		return this.instance.put(url, data, config);
	}

	patch<T = unknown, R = AxiosResponse<T>>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
		this.logger.debug("[PATCH] " + url + " -- Data " + JSON.stringify(data));
		return this.instance.patch(url, data, config);
	}

	delete<T = unknown, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
		this.logger.debug("[DELETE] " + url);
		return this.instance.delete(url, config);
	}
}
