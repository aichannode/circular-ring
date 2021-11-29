import { Storage } from "@core/storage";
import { ReadNotificationInfo as ReadNotificationInfo } from "./homeBanner";

const homeBannerStorageKey = "@homeBanners";

/**
 * Simple storage for notification banner closed state.
 */
export class NotificationStorage {
	async save(clientSideClosed: number[]) {
		await Storage.save<ReadNotificationInfo>(homeBannerStorageKey, { clientSideClosed });
	}

	async load(): Promise<ReadNotificationInfo | null> {
		const infos = await Storage.load<ReadNotificationInfo>(homeBannerStorageKey);
		return infos && { ...infos };
	}

	clear() {
		return Storage.remove(homeBannerStorageKey);
	}
}