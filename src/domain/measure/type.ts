export enum DailySleepPhase {
	SLEEP = "Sleep",
	LYING = "Lying",
	AWAKE = "Awake",
	NAP = "Nap",
	DISTURBANCE = "Disturbance",
}
export enum DailyActivityPhase {
	SEDENTARY = "user.non.active.activity",
	LOW = "user.low.intensity.activity",
	MEDIUM = "user.medium.intensity.activity",
	HIGH = "user.high.intensity.activity",
}
export interface DailyPhaseInfo<T extends DailySleepPhase | DailyActivityPhase> {
	phase: T;
	start: Date;
	end: Date;
}

export interface DurationInfos<T extends DailySleepPhase | DailyActivityPhase = any> {
	dailyPhaseInfos: DailyPhaseInfo<T>[];
	totalDuration: number;
}