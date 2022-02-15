import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { isNotification, isRecommendation } from "./business";
import { FeedEntity } from "./type";

const feedBaseUrl = "/feed";
const interactionsBaseUrl = "/interactions";

export class FeedApi {
	constructor(private readonly apiService: ApiService) {}

	/**
	 * Fetch the notifications
	 */
	async fetchNotifications(from: Date = new Date(moment().subtract(1, "month").toISOString())) {
		const res = await this.apiService.get<{ data: FeedEntity[] }>(`${feedBaseUrl}/me`, { params: { from } });
		return res.data.data.filter(isNotification);
	}

	/**
	 * Fetch the recommendations
	 */
	async fetchRecommendations(count = 10, from: Date = new Date(moment().subtract(10, "month").toISOString())) {
		const res = await this.apiService.get<{ data: FeedEntity[] }>(`${feedBaseUrl}/me`, { params: { from, count } });
		const recommendations = res.data.data.filter(isRecommendation);
		return recommendations;
	}

	async _DEBUG_resetAnswer(userId?: string) {
		return await this.apiService.post(`${feedBaseUrl}/reset/answers`, { userId }, { _useBackOffice: true } as any);
	}

	/**
	 * Mark notification as closed by the user.
	 */
	async closeNotification(notificationIds: number[]) {
		return await this.apiService.put(`${feedBaseUrl}/me/closed`, { bannerIds: notificationIds });
	}

	/**
	 * Answer to a Kira question which uses a Select user input.
	 */
	async answerQuestion(selections: number[]) {
		return await this.apiService.post(`${interactionsBaseUrl}/selections`, { selections });
	}
}
