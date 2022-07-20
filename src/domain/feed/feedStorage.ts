import { Storage } from "@core/storage";
import { NotificationsState, UserInputState, UserInputStates } from "./type";

enum StorageKeys {
	NOTIFICATIONS = "@feed/notifications",
	RECOMMENDATIONS = "@feed/recommendations",
}

/**
 * Simple storage for feed optimistic UI
 * This class is aware of the different business entities
 * for facilitate the implementation.
 */
export class FeedStorage {
	async removeById(id: number) {
		await Storage.removeWithId(StorageKeys.RECOMMENDATIONS, id);
	}
	async saveNotificationsState(clientSideClosed: number[]) {
		await Storage.save<NotificationsState>(StorageKeys.NOTIFICATIONS, { clientSideClosed });
	}

	/**
	 * This upsert a new entry to the local storage for the given
	 * Recommandation
	 */
	async saveRecommendationState(state: UserInputState) {
		await Storage.saveWithId<UserInputState>(StorageKeys.RECOMMENDATIONS, state.id, state);
	}

	/**
	 * This returns a Recommendation state
	 */
	async getRecommendationState(id: string) {
		return Storage.loadWithId<UserInputState>(StorageKeys.RECOMMENDATIONS, id);
	}

	/**
	 * Returns all Recommendation states
	 */
	async loadRecommendationsState() {
		const data = await Storage.getAllIdsForKey(StorageKeys.RECOMMENDATIONS);
		const recos = await Promise.all(
			// Aggregate all stored recommandations
			data.map((id) => Storage.loadWithId<UserInputState>(StorageKeys.RECOMMENDATIONS, id))
		);
		return recos.filter(Boolean) as UserInputStates;
	}

	async loadNotificationsState(): Promise<NotificationsState | null> {
		const state = await Storage.load<NotificationsState>(StorageKeys.NOTIFICATIONS);
		return state && { ...state };
	}

	clear() {
		return Storage.remove(StorageKeys.NOTIFICATIONS);
	}
}
