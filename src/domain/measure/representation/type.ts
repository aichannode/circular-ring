import { MetricType } from "../metric";
import { SleepStage, ActivityStage } from "../type";

export type StageInfos<T extends SleepStage | ActivityStage> = {
	type: T;
	/** Iso date */
	start: string;
	/** Iso date */
	end: string;
};

export type RangeDetails<M extends MetricType> = {
	[k in M]: number;
};

/**
 * Used by the representation, atomically select needed data
 */

///////////
// ACTIVITY
///////////

export const activityIntensityMetrics = [MetricType.UserDataActivityIntensity] as const;
export type ActivityIntensityMetrics = typeof activityIntensityMetrics[number];

export const dailyActivityDetailsMetrics = [
	MetricType.UserDailySteps,
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyAwakeHrMax,
] as const;
export type DailyActivityDetailsMetrics = typeof dailyActivityDetailsMetrics[number];

export const weeklyActivityGoals = [
	MetricType.UserWeeklyCardioPointsGoalMax,
	MetricType.UserWeeklyCardioPointsGoalMin,
] as const;
export type WeeklyActivityGoals = typeof weeklyActivityGoals[number];

export const dailyEnergyScoreMetrics = [MetricType.UserDailySleepQualityScore] as const;
export type DailyEnergyScoreMetrics = typeof dailyEnergyScoreMetrics[number];

// TODO check usage
export const activityScoreGaugeMetrics = [] as const;
export type ActivityScoreGaugeMetrics = typeof activityScoreGaugeMetrics[number];

////////
// SLEEP
////////

export const sleepStageMetrics = [
	MetricType.UserCoreSleepBegin,
	MetricType.UserCoreSleepEnd,
	MetricType.UserSleepstage,
	MetricType.UserSleepNapping,
] as const;
export type SleepStageMetrics = typeof sleepStageMetrics[number];

export const dailySleepDetailsMetrics = [
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercDeepStage,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyTimeToFallAsleep,
	MetricType.UserDailySleepDebt,
] as const;
export type DailySleepDetailsMetrics = typeof dailySleepDetailsMetrics[number];

export const dailySleepDetailsGaugeMetrics = [
	MetricType.UserDailyPercAwakeStageDuration,
	MetricType.UserDailyPercRealSleep,
	MetricType.UserDailyPercREMStageScore,
	MetricType.UserDailyPercdeepStageScore,
	MetricType.UserDailyPercTimeTtoFallAsleep,
	MetricType.UserDailyPercSleepDebt,
] as const;
export type DailySleepDetailsGaugeMetrics = typeof dailySleepDetailsGaugeMetrics[number];
