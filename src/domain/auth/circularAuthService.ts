import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
import { AccessToken } from "@domain/auth/accessToken";

export class CircularAuthService {
	private readonly logger = getLogger("CircularAuthService");

	private _accessToken: AccessToken | undefined = undefined;

	constructor(private readonly apiService: ApiService) {}

	init() {
		this.apiService.init(this);
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		try {
			const result = await this.apiService.post<AccessToken>("/v1/auth/login", { email, password });
			this._accessToken = result.data;
			this.logger.debug("Login Succeeded (token: " + this._accessToken + ")");
		} catch (error) {
			this.logger.warn("Login failed: " + error);
			throw error;
		}
	}

	async getToken(): Promise<string | undefined> {
		return this._accessToken?.access_token;
	}

	logout() {
		this._accessToken = undefined;
	}
}
