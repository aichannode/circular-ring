import { Storage } from "@core/storage";
import { HomeBanner, StoredBanner } from "./homeBanner";

const homeBannerStorageKey = "@homeBanner";

export class HomeBannerStorage {
	save(banner: HomeBanner) {
		return Storage.save<StoredBanner>(homeBannerStorageKey, { ...banner, stored: new Date() });
	}

	async load(): Promise<StoredBanner | null> {
		const banner = await Storage.load<StoredBannerDto>(homeBannerStorageKey);
		return banner && { ...banner, stored: new Date(banner.stored) };
	}

	clear() {
		return Storage.remove(homeBannerStorageKey);
	}
}

interface StoredBannerDto extends HomeBanner {
	stored: string;
}
