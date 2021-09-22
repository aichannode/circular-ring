import { Storage } from "@core/storage";
import { User } from "@domain/user/user";
import { UserSettings } from "@domain/user/userSettings";

const userStorageKey = "@user";
const justRegisteredUserStorageKey = "@justRegisteredUser";
const userSettingsStorageKey = "@userSettings";

export class UserStorage {
	/** User **/

	saveUser(user: User) {
		return Storage.save<User>(userStorageKey, user);
	}

	loadUser() {
		return Storage.load<User>(userStorageKey);
	}

	removeUser() {
		return Storage.remove(userStorageKey);
	}

	/** Just Registered User **/

	saveJustRegisteredUser(email: string, password: string) {
		return Storage.save<{ email: string; password: string }>(justRegisteredUserStorageKey, { email, password });
	}

	loadJustRegisteredUser() {
		return Storage.load<{ email: string; password: string }>(justRegisteredUserStorageKey);
	}

	removeJustRegisteredUser() {
		return Storage.remove(justRegisteredUserStorageKey);
	}

	/** User settings **/

	saveUserSettings(userSettings: UserSettings) {
		return Storage.save<UserSettings>(userSettingsStorageKey, userSettings);
	}

	loadUserSettings() {
		return Storage.load<UserSettings>(userSettingsStorageKey);
	}

	removeUserSettings() {
		return Storage.remove(userSettingsStorageKey);
	}
}
