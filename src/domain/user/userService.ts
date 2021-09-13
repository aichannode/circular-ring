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
		this._user.set(await this.userStorage.loadUser());
	}

	async loginWithEmail(email: string, password: string): Promise<void> {
		this.logger.debug("Calling authService");
		try {
			await this.authService.loginEmail(email, password);
			// await this.retrieveUser();
		} catch (error) {
			if ((error as { code: string }).code === "UserNotConfirmedException") {
				await this.userStorage.saveJustRegisteredUser(email, password);
			}
			throw error;
		}
	}

	get currentUserEmail() {
		return this.authService.userEmail;
	}

	async logout() {
		await this.authService.logout();
		this._user.set(null);
		await this.userStorage.removeUser();
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

	/** Sign Up process **/

	async signUpWithEmail(email: string, password: string) {
		await this.authService.signUpEmail(email, password);
		await this.userStorage.saveJustRegisteredUser(email, password);
	}

	async resendSignUpCode() {
		await this.authService.resendSignUpValidationCode();
	}

	async validateSignUp(code: string) {
		const justRegistered = await this.userStorage.loadJustRegisteredUser();
		if (justRegistered) {
			await this.authService.validateSignUpConfirmationCode(code, justRegistered.email);
			await this.loginWithEmail(justRegistered.email, justRegistered.password);
			await this.userStorage.removeJustRegisteredUser();
		} else {
			throw Error("Cannot retrieve JustRegistered user credentials");
		}
	}
}
