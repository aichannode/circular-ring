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
	controlState: DataControlState;
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
export interface DailySpo2 {
	lines: Lines;
	constant: {
		average: number;
		reference: number;
	};
	controlState: DataControlState;
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

export interface Range7<T> {
	series: [
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined,
		Score | undefined
	];
	controlState: DataControlState;
	constant: T;
}

export type Scores7D = Range7<{
	average: number;
}>;

export type Cardio7D = Range7<{
	average: number;
	baseline: number;
	total: number;
}>;

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

export interface ActivityData {
	high: number;
	medium: number;
	low: number;
	date: ISODay;
}
export interface Activity7D {
	controlState: DataControlState;
	activityMetrics: Tuple<ActivityData, 7>;
	constant: {
		highDuration?: number;
		mediumDuration?: number;
		lowDuration?: number;
	};
}
