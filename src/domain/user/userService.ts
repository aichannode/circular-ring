import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
import { CircularAuthService } from "@domain/auth/circularAuthService";
import { User, UserImpl } from "@domain/user/user";
import { UserDto } from "@domain/user/userDto";
import { UserStorage } from "@domain/user/userStorage";
import { observable } from "micro-observables";

export class UserService {
	private readonly logger = getLogger("UserService");

	private _user = observable<User | null>(null);
	readonly user = this._user.readOnly();

	constructor(
		private readonly circularAuthService: CircularAuthService,
		private readonly apiService: ApiService,
		private readonly userStorage: UserStorage
	) {}

	async init() {
		this._user.set(await this.userStorage.load());
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		await this.circularAuthService.loginWithEmail(email, password);
		await this.retrieveUser();
	}

	async logout() {
		await this.circularAuthService.logout();
		this._user.set(null);
		await this.userStorage.remove();
	}

	private async retrieveUser() {
		try {
			const result = await this.apiService.get<UserDto>("/user");
			const userDto = result.data;
			this._user.set(new UserImpl(userDto));
		} catch (error) {
			this.logger.warn("Get user failed: " + JSON.stringify(error));
			await this.logout();
			throw error;
		}
	}
}
