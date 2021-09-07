import { getLogger } from "@core/logger/logger";
import { AuthService } from "@domain/auth/authService";
import { User } from "@domain/user/user";
import { UserStorage } from "@domain/user/userStorage";
import { observable } from "micro-observables";

export class UserService {
	private readonly logger = getLogger("UserService");

	private _user = observable<User | null>(null);
	readonly user = this._user.readOnly();

	constructor(
		private readonly authService: AuthService,
		// private readonly userApi: UserApi,
		private readonly userStorage: UserStorage
	) {}

	async init() {
		this._user.set(await this.userStorage.load());
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		this.logger.debug("Calling authService");
		await this.authService.loginEmail(email, password);
		// await this.retrieveUser();

		// await this.authService.signUpEmail(email, password);
	}

	async resetPassword(email: string): Promise<void> {
		const isEmailValid = await this.circularAuthService.checkEmail(email);
		if (isEmailValid) {
			await this.circularAuthService.resetPassword(email);
		}
	}

	async logout() {
		await this.authService.logout();
		this._user.set(null);
	}

	// private async retrieveUser() {
	// 	try {
	// 		const user = await this.userApi.getUser();
	// 		this._user.set(user);
	// 	} catch (error) {
	// 		this.logger.warn("Get user failed: " + JSON.stringify(error));
	// 		await this.logout();
	// 		throw error;
	// 	}
	// }
}
