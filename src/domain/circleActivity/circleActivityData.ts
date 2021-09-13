export interface CircleActivityData {
	// dailyMetrics: {
	// 	stepsTaken: number;
	// 	stepsTakenGoal: number;
	// 	walkingEquivalency: number;
	// 	walkingEquivalencyGoal: number;
	// 	caloriesBurned: number;
	// 	activeMinutes: number;
	// 	activeMinutesGoal: number;
	// 	maxOxygenConsumption: number;
	// 	maxHR: number;
	// };
	activityDetails: {
		recovery: number;
		wakeUpScore: number;
		hrVariabilityScore: number;
		hrVariability: number;
		restingHRScore: number;
		restingHR: number;
		respiratoryRateScore: number;
		respiratoryRate: number;
		sleepQuality: number;
		sleepBalance: number;
		activityVolume: number;
	};
}

export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative";

export enum ScoreQuality {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export function getScoreQuality(score: number, goodThreshold: number, optimalThreshold: number) {
	return score > optimalThreshold
		? ScoreQuality.OPTIMAL
		: score > goodThreshold
		? ScoreQuality.GOOD
		: ScoreQuality.POOR;
}
