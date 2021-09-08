import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
import { AccessToken } from "@domain/auth/accessToken";
import { AccessTokenStorage } from "@domain/auth/accessTokenStorage";

const SEC_TO_MILLISEC = 1000;
const REFRESH_TOKEN_MARGIN = 60 * 10 * SEC_TO_MILLISEC; // 10 min

export class CircularAuthService {
	private readonly logger = getLogger("CircularAuthService");

	private _accessToken: AccessToken | null = null;
	private _accessTokenDate: number | null = null;

	constructor(private readonly apiService: ApiService, private readonly accessTokenStorage: AccessTokenStorage) {}

	async init() {
		this.apiService.init(this);
		const tokenData = await this.accessTokenStorage.load();
		this._accessToken = tokenData[0];
		this._accessTokenDate = tokenData[1];
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		try {
			this.logger.debug("Authenticating");
			const result = await this.apiService.post<AccessToken>("/auth/login", { email, password });
			this.logger.debug("Did authenticate > register token");
			await this.registerToken(result.data);
			this.logger.debug("Did register token");
		} catch (error) {
			this.logger.warn("Login failed: " + JSON.stringify(error));
			throw error;
		}
	}

	async getToken(): Promise<string | undefined> {
		if (this._accessToken && this._accessTokenDate) {
			if (Date.now() > this._accessTokenDate + this._accessToken.expires_in * SEC_TO_MILLISEC - REFRESH_TOKEN_MARGIN) {
				this.logger.debug("Refreshing token...");
				await this.refreshToken();
			}
			return this._accessToken.access_token;
		}
	}

	private async refreshToken(): Promise<void> {
		if (this._accessToken) {
			try {
				const result = await this.apiService.post<AccessToken>("/auth/refresh_token", {
					refreshToken: this._accessToken?.refresh_token,
				});
				await this.registerToken(result.data);
			} catch (error) {
				this.logger.warn("Refresh token failed: " + JSON.stringify(error));
			}
		}
	}

	private async registerToken(token: AccessToken) {
		this._accessToken = token;
		this._accessTokenDate = Date.now();
		await this.accessTokenStorage.save(this._accessToken, this._accessTokenDate);
	}

	async logout() {
		await this.apiService.get("/auth/logout");
		this._accessToken = null;
		this._accessTokenDate = Date.now();
		await this.accessTokenStorage.remove();
	}
}
