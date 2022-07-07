import { ApiService } from "@core/api/apiService";

const leaderboardUrl = "/leaderboard";

export class LeaderboardApi {
	constructor(private readonly apiService: ApiService) {}

	async fetchLeaderboard(count: number, after?: string) {
		return (await this.apiService.get(`${leaderboardUrl}`, { params: { after, count } })).data;
	}
}
