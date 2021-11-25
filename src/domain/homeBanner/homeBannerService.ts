import { Observable, observable } from "micro-observables";
import { HomeBanner } from "./homeBanner";
import { HomeBannerApi } from "./homeBannerApi";

export class HomeBannerService {
	private _banners = observable<HomeBanner[]>([]);

	// Workaround to display all banners.
	// Will be updated with CIR-444
	banners: Observable<HomeBanner[]>

	constructor(private readonly homeBannerApi: HomeBannerApi) {
		this.banners = this._banners;
	}

	async fetchBanners() {
		this._banners.set(await this.homeBannerApi.getBanners());
	}
}
