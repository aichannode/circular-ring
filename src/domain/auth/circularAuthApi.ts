import { ApiService } from "@core/api/apiService";
import { AccessToken } from "@domain/auth/accessToken";

export class CircularAuthApi {
	constructor(private readonly apiService: ApiService) {}

	async singUpWithEmail(email: string, password: string) {
		// const result = await this.apiService.post("/auth/signup", {});
	}

	async loginEmail(email: string, password: string): Promise<AccessToken> {
		const result = await this.apiService.post<AccessToken>("/auth/login", { email, password });
		return result.data;
	}

	async refreshToken(refreshToken: string): Promise<AccessToken> {
		const result = await this.apiService.post<AccessToken>("/auth/refresh-token", { refreshToken });
		return result.data;
	}

	async logout(): Promise<void> {
		return await this.apiService.get("/auth/logout");
	}
}
