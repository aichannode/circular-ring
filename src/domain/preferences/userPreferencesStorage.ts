import { Storage } from "@core/storage";
import { UserPreferences } from "./userPreferences";

const userPreferencesStorageKey = "@userPreferences";

export class UserPreferencesStorage {
	save(preferences: UserPreferences) {
		return Storage.save<UserPreferences>(userPreferencesStorageKey, preferences);
	}

	load() {
		return Storage.load<UserPreferences>(userPreferencesStorageKey);
	}
}
