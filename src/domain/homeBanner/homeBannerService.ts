import { Observable, observable } from "micro-observables";
import { HomeBanner, ReadBannersInfo } from "./homeBanner";
import { HomeBannerApi } from "./homeBannerApi";
import { HomeBannerStorage } from "./homeBannerStorage";

export class HomeBannerService {
	private _banners = observable<HomeBanner[]>([]);
	private _readBannersInfos = observable<ReadBannersInfo>({ bannerIds: [] });

	visibleBanner: Observable<HomeBanner | null>;

	constructor(private readonly homeBannerStorage: HomeBannerStorage, private readonly homeBannerApi: HomeBannerApi) {
		this.visibleBanner = Observable.select(
			[this._banners, this._readBannersInfos],
			(banners, { bannerIds }) => banners.find((banner) => bannerIds.indexOf(banner.id) < 0) ?? null
		);
	}

	async fetchBanners() {
		const infos = this._readBannersInfos.get();
		const banners = await this.homeBannerApi.getBanners(infos.lastRead ?? new Date());
		this._banners.set(banners);
	}

	async init() {
		const infos = await this.homeBannerStorage.load();
		if (infos) {
			this._readBannersInfos.set(infos);
		}
	}

	async dismiss(banner: HomeBanner) {
		const currentInfos = this._readBannersInfos.get();
		const newInfos = {
			bannerIds: [...currentInfos.bannerIds, banner.id],
			lastRead: new Date(),
		};
		this._readBannersInfos.set(newInfos);
		await this.homeBannerStorage.save(newInfos);
	}
}
