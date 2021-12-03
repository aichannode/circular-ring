import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { FeedEntity } from "./type";
import { createRecommendation } from "./mockedData";
import { isNotification, isRecommendation } from "./business";

const feedBaseUrl = "/feed";

export class FeedApi {
	constructor(private readonly apiService: ApiService) {}

	/**
	 * Fetch the notifications
	 */
	async fetchNotifications(from: Date = new Date(moment().subtract(1, "month").toISOString())) {
		const res = await this.apiService.get<{ data: FeedEntity[] }>(`${feedBaseUrl}/me`, { params: { from } });
		return res.data.data.filter(isNotification)
	}

	/**
	 * Fetch the recommendations
	 */
	async fetchRecommendations(from: Date = new Date(moment().subtract(1, "month").toISOString())) {
		const res = await this.apiService.get<{ data: FeedEntity[] }>(`${feedBaseUrl}/me`, { params: { from } });
		return res.data.data.filter(isRecommendation)
	}

	/**
	 * Used only by QA.
	 * Creates 5 new notifications.
	 */
	async _DEBUG_insertData() {
		await Promise.all([0, 1, 2, 3, 5].map(async(id) => {
			return await this.apiService.post(feedBaseUrl, createRecommendation(id), {_useBackOffice: true} as any)
		}))
	}
	
	/**
	 * Mark notification as closed by the user.
	 */
	async closeNotification(notificationIds: number[]) {
		return await this.apiService.put(`${feedBaseUrl}/me/closed`, { bannerIds: notificationIds })
	}
}
