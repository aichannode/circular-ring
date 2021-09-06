import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import { User, UserImpl } from "@domain/user/user";
import { UserDto } from "@domain/user/userDto";
import { observable } from "micro-observables";

export class UserService {
	private readonly logger = getLogger("UserService");

	private _user = observable<User | undefined>(undefined);
	readonly user = this._user.readOnly();

	constructor(private readonly circularAuthService: CircularAuthService, private readonly apiService: ApiService) {}

	async loginWithEmail(email: string, password: string): Promise<void> {
		await this.circularAuthService.loginWithEmail(email, password);
		await this.retrieveUser();
	}

	logout() {
		this.circularAuthService.logout();
		this._user.set(undefined);
	}

	private async retrieveUser() {
		try {
			const result = await this.apiService.get<UserDto>("/user/profile");
			const userDto = result.data;
			this._user.set(new UserImpl(userDto));
		} catch (error) {
			this.logger.warn("Get user failed: " + JSON.stringify(error));
			throw error;
		}
	}
}
