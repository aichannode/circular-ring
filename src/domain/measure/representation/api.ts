import { ISODay, ISOMonth, Tuple } from "@domain/common/type";
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

export interface ActivityDetail {
	value?: number;
	score?: number;
	controlState?: ActivityControlState;
}

export interface Contributor {
	value?: number;
	thresholdLow: number;
	thresholdHigh: number;
	percent?: number;
	controlState: ScoreQuality;
}

export interface DailyData<T> {
	data: Points;
	controlState: DataControlState;
	constant: T;
}

export type DailyHr = DailyData<{
	hr: number;
	hrMin: number;
	hrMax: number;
	reference: number;
}>;

export type DailySpo2 = DailyData<{
	average: number;
	reference: number;
}>;
export type DailyBr = DailyData<{
	average: number;
	reference: number;
}>;

export type DailyHrv = DailyData<{
	average: number;
	reference: number;
}>;
export type DailyHRNight = DailyData<{
	hr: number;
	hrMin: number;
	hrMax: number;
	reference: number;
}>;
export interface DailyHrvTrend {
	data: Points;
}

export interface DailyHrTrend {
	data: Points;
}

export interface Point {
	/** timestamp */
	x: number;
	/** bpm */
	y: number;
}
export type Points = Point[];
export interface Score<T = number> {
	/** isoday*/
	date: ISODay;
	/** value */
	value: T;
}

export interface Range7<T, U = number> {
	series: [
		Score<U> | undefined,
		Score<U> | undefined,
		Score<U> | undefined,
		Score<U> | undefined,
		Score<U> | undefined,
		Score<U> | undefined,
		Score<U> | undefined
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

export type TemperatureVariation7D = Range7<{
	average: number;
}>;

export type RestingHeartRate7D = Range7<{
	average: number;
	reference: number;
}>;

export type CalorieBurned7D = Range7<{
	average: number;
	baseline: number;
	total: number;
}>;

export type Steps7D = Range7<{
	average: number;
	baseline: number;
	total: number;
}>;

export type HRS7D = Range7<
	{
		totalAverage: number;
		realAverage: number;
		recommendation: number;
	},
	[number, number]
>;

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
	high?: number;
	medium?: number;
	low?: number;
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

export interface ActivityData30D {
	high?: number;
	medium?: number;
	low?: number;
	date: ISOMonth;
}

export interface ActivityAll {
	controlState: DataControlState;
	activityMetrics: Array<ActivityData30D>;
	constant: {
		highDuration?: number;
		mediumDuration?: number;
		lowDuration?: number;
	};
}
