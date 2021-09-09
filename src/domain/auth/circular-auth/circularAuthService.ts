import { getLogger } from "@core/logger/logger";
import { AuthService } from "@domain/auth/authService";
import { AccessToken } from "@domain/auth/circular-auth/accessToken";
import { AccessTokenStorage } from "@domain/auth/circular-auth/accessTokenStorage";
import { CircularAuthApi } from "@domain/auth/circular-auth/circularAuthApi";
import { observable } from "micro-observables";

const SEC_TO_MILLISEC = 1000;
const REFRESH_TOKEN_MARGIN = 60 * 10 * SEC_TO_MILLISEC; // 10 min

export class CircularAuthService implements AuthService {
	private readonly logger = getLogger("CircularAuthService");

	private _accessToken = observable<AccessToken | null>(null);
	private _accessTokenDate: number | null = null;

	accessToken = this._accessToken.readOnly();

	constructor(private readonly authApi: CircularAuthApi, private readonly accessTokenStorage: AccessTokenStorage) {}

	signUpEmail(email: string, password: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async init() {
		const tokenData = await this.accessTokenStorage.load();
		this._accessToken.set(tokenData[0]);
		this._accessTokenDate = tokenData[1];
	}

	async loginEmail(email: string, password: string): Promise<void> {
		try {
			const token = await this.authApi.loginEmail(email, password);
			await this.registerToken(token);
		} catch (error) {
			this.logger.warn("Login failed: " + JSON.stringify(error));
			throw error;
		}
	}

	async getToken(): Promise<string | undefined> {
		const token = this._accessToken.get();
		if (token && this._accessTokenDate) {
			if (Date.now() > this._accessTokenDate + token.expires_in * SEC_TO_MILLISEC - REFRESH_TOKEN_MARGIN) {
				this.logger.debug("Refreshing token...");
				await this.refreshToken();
			}
			return this._accessToken.get()?.access_token;
		}
	}

	private async refreshToken(): Promise<void> {
		const currentToken = this._accessToken.get();
		if (currentToken) {
			try {
				const newToken = await this.authApi.refreshToken(currentToken.refresh_token);
				await this.registerToken(newToken);
			} catch (error) {
				this.logger.warn("Refresh token failed: " + JSON.stringify(error));
			}
		}
	}

	private async registerToken(token: AccessToken) {
		this._accessToken.set(token);
		this._accessTokenDate = Date.now();
		await this.accessTokenStorage.save(token, this._accessTokenDate);
	}

	async logout() {
		await this.authApi.logout();
		this._accessToken.set(null);
		this._accessTokenDate = null;
		await this.accessTokenStorage.remove();
	}
}
