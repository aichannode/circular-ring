import { Storage } from "@core/storage";
import { AdvancedInfo } from "@domain/user/advancedInfo";
import { User } from "@domain/user/user";
import { UserSettings } from "@domain/user/userSettings";
import { UserNotificationsSettings } from "./userNotificationsSettings";

const userStorageKey = "@user";
const justRegisteredUserStorageKey = "@justRegisteredUser";
const userSettingsStorageKey = "@userSettings";
const userAdvancedInfoStorageKey = "@userAdvancedInfo";
const userNotificationsSettingsStorageKey = "@userNotificationsSettings";

export class UserStorage {
	/** User **/

	saveUser(user: User) {
		return Storage.save<User>(userStorageKey, user);
	}

	async loadUser(): Promise<User | null> {
		const dto = await Storage.load<UserStorageDto>(userStorageKey);
		return !!dto ? { ...dto, bornDate: new Date(dto.bornDate), createdAt: new Date(dto.createdAt) } : null;
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

	/** User Notifications settings **/

	saveUserNotificationsSettings(userNotificationsSettings: UserNotificationsSettings) {
		return Storage.save<UserNotificationsSettings>(userNotificationsSettingsStorageKey, userNotificationsSettings);
	}

	loadUserNotificationsSettings() {
		return Storage.load<UserNotificationsSettings>(userNotificationsSettingsStorageKey);
	}

	removeUserNotificationsSettings() {
		return Storage.remove(userNotificationsSettingsStorageKey);
	}

	/** User Advanced Info **/

	saveUserAdvancedInfo(advancedInfo: AdvancedInfo) {
		return Storage.save<AdvancedInfo>(userAdvancedInfoStorageKey, advancedInfo);
	}

	loadUserAdvancedInfo() {
		return Storage.load<AdvancedInfo>(userAdvancedInfoStorageKey);
	}

	removeUserAdvancedInfo() {
		return Storage.remove(userAdvancedInfoStorageKey);
	}
}

interface UserStorageDto extends Omit<User, "bornDate" | "createdAt"> {
	bornDate: string;
	createdAt: string;
}
