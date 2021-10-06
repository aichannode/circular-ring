import { observable } from "micro-observables";
import { UserPreferences } from "./userPreferences";
import { UserPreferencesStorage } from "./userPreferencesStorage";

export class UserPreferencesService {
	preferences = observable<UserPreferences | null>(null);

	constructor(private readonly preferencesStorage: UserPreferencesStorage) {}

	async init() {
		const preferences = await this.preferencesStorage.load();
		this.preferences.set(preferences);
	}

	skipLiveTutorial() {
		this.preferences.update((current) => ({ ...current, skipLiveTutorial: true }));
		this.preferencesStorage.save({ skipLiveTutorial: true });
	}
}
