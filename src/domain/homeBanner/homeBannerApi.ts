import { ApiService } from "@core/api/apiService";
import { BannerAction, HomeBanner, IconType } from "./homeBanner";

const homeBannerBaseUrl = "/banners";
export class HomeBannerApi {
	constructor(private readonly apiService: ApiService) {}

	async getBanners(from: Date) {
		const res = await this.apiService.get<{ data: HomeBanner[] }>(`${homeBannerBaseUrl}/me`, { params: { from } });
		// return res.data.data;

		const fakeres: HomeBanner[] = [
			{
				id: -5,
				title: "Lorem ipsum",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
				icon: "",
				iconType: IconType.LOCAL,
				priority: 0,
				targetUserId: "",
				clientActions: [{ type: BannerAction.OPEN_WEB, data: "https://google.fr" }],
			},
		];
		return fakeres;
	}
}
