import { Storage } from "@core/storage";
import { ReadBannerInfo as ReadBannerInfo } from "./type";

const homeBannerStorageKey = "@homeBanners";

/**
 * Simple storage for notification banner closed state.
 */
export class FeedStorage {
	async save(clientSideClosed: number[]) {
		await Storage.save<ReadBannerInfo>(homeBannerStorageKey, { clientSideClosed });
	}

	async load(): Promise<ReadBannerInfo | null> {
		const infos = await Storage.load<ReadBannerInfo>(homeBannerStorageKey);
		return infos && { ...infos };
	}

	clear() {
		return Storage.remove(homeBannerStorageKey);
	}
}