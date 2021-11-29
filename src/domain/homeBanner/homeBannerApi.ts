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
		await Promise.all([
			"Notification 0",
			"Notification 1",
			"Notification 2",
			"Notification 3",
			"Notification 4"
		].map(async(title) => {
			return await this.apiService.post(homeBannerBaseUrl, createRecommendation(title), {_useBackOffice: true} as any)
		}))
	}
	
	/**
	 * Mark banner as closed by the user.
	 */
	async closeBanners(bannerIds: number[]) {
		return await this.apiService.put(`${homeBannerBaseUrl}/me/closed`, { bannerIds })
	}
}
