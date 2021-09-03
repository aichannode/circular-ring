import { CircularAuthService } from "@domain/auth/circularAuthService";
import { User } from "@domain/user/user";
import { observable } from "micro-observables";

export class UserService {
	private _user = observable<User | undefined>(undefined);

	readonly user = this._user.readOnly();

	constructor(private readonly circularAuthService: CircularAuthService) {}

	async loginWithEmail(email: string, password: string): Promise<void> {
		try {
			await this.circularAuthService.loginWithEmail(email, password);
			this.retrieveUser();
		} catch (e) {
			// TODO : handle error correctly
		}
	}

	logout() {
		this.circularAuthService.logout();
		this._user.set(undefined);
	}

	private retrieveUser() {
		// TODO
	}
}
