import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
import { AccessToken } from "@domain/auth/accessToken";

const SEC_TO_MILLISEC = 1000;
const REFRESH_TOKEN_MARGIN = 60 * 10 * SEC_TO_MILLISEC; // 10 min

export class CircularAuthService {
	private readonly logger = getLogger("CircularAuthService");

	private _accessToken: AccessToken | undefined = undefined;
	private _accessTokenDate: number | undefined = undefined;

	constructor(private readonly apiService: ApiService) {}

	init() {
		this.apiService.init(this);
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		try {
			const result = await this.apiService.post<AccessToken>("/auth/login", { email, password });
			this._accessToken = result.data;
			this._accessTokenDate = Date.now();
			this.logger.debug("Login Succeeded (token: " + this._accessToken + ")");
		} catch (error) {
			this.logger.warn("Login failed: " + error);
			throw error;
		}
	}

	async getToken(): Promise<string | undefined> {
		if (this._accessToken && this._accessTokenDate) {
			if (Date.now() > this._accessTokenDate + this._accessToken.expires_in * SEC_TO_MILLISEC - REFRESH_TOKEN_MARGIN) {
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
				this._accessToken = result.data;
				this._accessTokenDate = Date.now();
			} catch (error) {
				this.logger.warn("Refresh token failed: " + error);
			}
		}
	}

	logout() {
		this._accessToken = undefined;
	}
}
