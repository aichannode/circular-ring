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

		// TODO : remove once signUp implemented
		// await this.authService.signUpEmail(email, password);
	}

	async resetPassword(email: string): Promise<void> {
		await this.authService.forgotPassword(email);
	}

	async resendResetToken(email: string): Promise<void> {
		await this.authService.resendResetToken(email);
	}

	async confirmResetToken(email: string, resetToken: string): Promise<void> {
		await this.authService.confirmResetToken(email, resetToken);
	}

	async newPassword(email: string, resetToken: string, newPassword: string): Promise<void> {
		await this.authService.newPassword(email, resetToken, newPassword);
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

	async signUpWithEmail(email: string, password: string) {
		await this.authService.signUpEmail(email, password);
	}

	get currentUserEmail() {
		return /*this._currentUser.email ||*/ this.authService.userEmail;
	}
}
