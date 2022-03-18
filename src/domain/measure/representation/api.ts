import { ActivityStage, SleepStage } from "../type";
import { StageInfos } from "./lib/type";

export type DailyActivityIntensityData = {
	stages: Array<StageInfos<ActivityStage>>;
	duration: number;
	sportSessionDates: Array<[string | undefined, string | undefined]>;
};
export type DailySleepData = {
	stages: Array<StageInfos<SleepStage>>;
	totalMinutesSleepDuration: number;
	coreSleepTiming?: [string, string];
	napTimings: Array<[string, string]>;
	timeToFallASleep?: number;
	sleepStagesDuration: Partial<{
		[SleepStage.AWAKE]: { duration: number; percent: number };
		[SleepStage.REM]: { duration: number; percent: number };
		[SleepStage.LIGHT]: { duration: number; percent: number };
		[SleepStage.DEEP]: { duration: number; percent: number };
	}>;
};

export enum ScoreQuality {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export interface Contributor {
	value: number;
	thresholdLow: number;
	thresholdHigh: number;
	percent: number;
	controlState: ScoreQuality;
}

export interface DailyHr {
	lines: Lines;
	constant: {
		hr: any;
		hrMin: any;
		hrMax: any;
	};
}

export interface Line {
	/** timestamp */
	x: number;
	/** bpm */
	y: number;
}
export type Lines = Line[];
