export enum DailyPhase {
	SLEEP = "Sleep",
	LYING = "Lying",
	AWAKE = "Awake",
	NAP = "Nap",
	DISTURBANCE = "Disturbance",
}
export interface DailyPhaseInfo {
	phase: DailyPhase;
	start: Date;
	end: Date;
}

export interface SleepDurationInfos {
	dailyPhaseInfos: DailyPhaseInfo[];
	totalSleepDuration: number;
}
