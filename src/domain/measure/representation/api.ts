import { ISODay, Tuple } from "@domain/common/type";
import { ActivityStage, SleepStage } from "../type";
import { StageInfos } from "./lib/type";

export type DailyActivityIntensityData = {
	stages: Array<StageInfos<ActivityStage>>;
	duration: {
		total: number;
		highActivity: number;
		mediumActivity: number;
		lowActivity: number;
	};
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

export enum ActivityControlState {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export enum DataControlState {
	READY = "READY",
	NO_DATA = "NO_DATA",
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
		hr: number;
		hrMin: number;
		hrMax: number;
		reference: number;
	};
}

export interface Line {
	/** timestamp */
	x: number;
	/** bpm */
	y: number;
}
export type Lines = Line[];
export interface Score {
	/** isoday*/
	date: ISODay;
	/** value */
	value: number;
}
export interface Scores7D {
	scores: [
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined
	];
	constant: {
		average: number;
	};
}

export interface SleepItem {
	awake: number;
	deep: number;
	rem: number;
	light: number;
}
export type SleepItems = SleepItem[];
export interface SleepStageData {
	awake: number;
	light: number;
	deep: number;
	REM: number;
	date: ISODay;
}

export interface Sleep7D {
	controlState: DataControlState;
	sleepStages: Tuple<SleepStageData, 7>;
	constant: {
		awakeDuration?: number;
		lightDuration?: number;
		deepDuration?: number;
		REMDuration?: number;
		awakePerc?: number;
		lightPerc?: number;
		deepPerc?: number;
		REMPerc?: number;
	};
}

export interface SleepAll {
	controlState: DataControlState;
	sleepStages: Array<SleepStageData>;
	constant: {
		awakeDuration?: number;
		lightDuration?: number;
		deepDuration?: number;
		REMDuration?: number;
		awakePerc?: number;
		lightPerc?: number;
		deepPerc?: number;
		REMPerc?: number;
	};
}
