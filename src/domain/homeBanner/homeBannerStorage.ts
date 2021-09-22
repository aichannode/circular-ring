import { Storage } from "@core/storage";
import { ReadBannersInfo } from "./homeBanner";

const homeBannerStorageKey = "@homeBanners";

export class HomeBannerStorage {
	async save(infos: ReadBannersInfo) {
		await Storage.save<ReadBannersInfo>(homeBannerStorageKey, { ...infos, lastRead: new Date() });
	}

	async load(): Promise<ReadBannersInfo | null> {
		const infos = await Storage.load<ReadBannersInfoDto>(homeBannerStorageKey);
		return infos && { ...infos, lastRead: new Date(infos.lastRead) };
	}

	clear() {
		return Storage.remove(homeBannerStorageKey);
	}
}

interface ReadBannersInfoDto extends Omit<ReadBannersInfo, "lastRead"> {
	lastRead: string;
}
