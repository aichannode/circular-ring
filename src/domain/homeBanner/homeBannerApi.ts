import { ApiService } from "@core/api/apiService";
import { HomeBanner } from "./homeBanner";

const homeBannerBaseUrl = "/banners";
export class HomeBannerApi {
	constructor(private readonly apiService: ApiService) {}

	async getBanners(from: Date) {
		const res = await this.apiService.get<{ data: HomeBanner[] }>(`${homeBannerBaseUrl}/me`, { params: { from } });
		return res.data.data;
	}
}
