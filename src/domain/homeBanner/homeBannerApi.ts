import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { HomeBanner } from "./homeBanner";
import { createRecommendation } from "./mockedData";

const homeBannerBaseUrl = "/banners";

export class HomeBannerApi {
	constructor(private readonly apiService: ApiService) {}

	/**
	 * Fetch the banners
	 */
	async getBanners(from: Date = new Date(moment().subtract(1, "month").toISOString())) {
		const res = await this.apiService.get<{ data: HomeBanner[] }>(`${homeBannerBaseUrl}/me`, { params: { from } });
		return res.data.data
	}

	/**
	 * Used only by QA.
	 * Creates 5 new home banners.
	 */
	async _DEBUG_insertData() {
		await Promise.all([0, 1, 2, 3, 5].map(async(id) => {
			return await this.apiService.post(homeBannerBaseUrl, createRecommendation(id), {_useBackOffice: true} as any)
		}))
	}
	
	/**
	 * Mark banner as closed by the user.
	 */
	async closeBanners(bannerIds: number[]) {
		return await this.apiService.put(`${homeBannerBaseUrl}/me/closed`, { bannerIds })
	}
}
