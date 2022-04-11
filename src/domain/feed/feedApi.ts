import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { isNotification, isRecommendation } from "./business";
import { createTemplates } from "./mockedData";
import { FeedEntity, FeedEntityStyle, FeedEntityType } from "./type";

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
		return res.data.data.filter(isRecommendation);
	}

	async _DEBUG_resetAnswer(userId?: string) {
		return await this.apiService.post(`${feedBaseUrl}/reset/answers`, { userId }, { _useBackOffice: true } as any);
	}

	async _DEBUG_resetFeed() {
		await this.apiService.post(`${feedBaseUrl}/templates/reset`, undefined, { _useBackOffice: true } as any);
		await this.apiService.post(`${feedBaseUrl}/reset`, undefined, { _useBackOffice: true } as any);
		const templates = await Promise.all(
			createTemplates().map((template) =>
				this.apiService.post<{
					id: number;
					type: FeedEntityType;
					style: FeedEntityStyle;
					title: string;
				}>(`${feedBaseUrl}/templates`, template, { _useBackOffice: true } as any)
			)
		);
		await Promise.all(
			templates.map(({ data: { id, type, style, title } }, i) => {
				this.apiService.post(
					`${feedBaseUrl}`,
					{
						templateId: id,
						components: [],
						type,
						startDate: moment()
							.subtract(i + 1, "day")
							.startOf("day")
							.toISOString(),
						style,
						title,
						priority: 1,
						endDate: moment().add(100, "years").toISOString(),
						actions: [],
					},
					{ _useBackOffice: true } as any
				);
			})
		);
		this.fetchRecommendations(10);
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
