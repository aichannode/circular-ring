import { delay } from "@core/utils";
import { CircleActivityData } from "@domain/circleActivity/circleActivityData";

export class CircleActivityApi {
	async getDailyMetrics(): Promise<CircleActivityData> {
		await delay(1000);
		return {
			// dailyMetrics: {
			// 	stepsTaken: 9200,
			// 	stepsTakenGoal: 10000,
			// 	walkingEquivalency: 5.4,
			// 	walkingEquivalencyGoal: 6.0,
			// 	caloriesBurned: 1010,
			// 	activeMinutes: 157,
			// 	activeMinutesGoal: 200,
			// 	maxOxygenConsumption: 35,
			// 	maxHR: 123,
			// },
			activityDetails: {
				recovery: 0.8,
				wakeUpScore: 0.96,
				hrVariabilityScore: 0.91,
				hrVariability: 68,
				restingHRScore: 0.7,
				restingHR: 62,
				respiratoryRateScore: 0.8,
				respiratoryRate: 75,
				sleepQuality: 0.83,
				sleepBalance: 0.95,
				activityVolume: 0.91,
			},
		};
	}
}
