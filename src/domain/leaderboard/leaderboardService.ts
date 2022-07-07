import { LeaderboardApi } from "./leaderboardApi";

export class LeaderboardService {
	constructor(private readonly leaderboardApi: LeaderboardApi) {}

	async getLeaderboard(after?: string, count = 50) {
		return this.leaderboardApi.fetchLeaderboard(count, after);
	}
}
