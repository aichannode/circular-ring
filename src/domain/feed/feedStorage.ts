import { Storage } from "@core/storage";
import { NotificationsState, RecommendationState } from "./type";

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
	async saveNotificationsState(clientSideClosed: number[]) {
		await Storage.save<NotificationsState>(StorageKeys.NOTIFICATIONS, { clientSideClosed });
	}

	/**
	 * This upsert a new entry to the local storage for the given
	 * Recommandation
	 */
	async saveRecommendationState(state: RecommendationState) {
		await Storage.save<RecommendationState>(`${StorageKeys.RECOMMENDATIONS}/${state.id}`, state);
	}

	async load(): Promise<NotificationsState | null> {
		const infos = await Storage.load<NotificationsState>(StorageKeys.NOTIFICATIONS);
		return infos && { ...infos };
	}

	clear() {
		return Storage.remove(StorageKeys.NOTIFICATIONS);
	}
}