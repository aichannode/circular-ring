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

export const activityIntensityMetrics = [] as const;
export type ActivityIntensityMetrics = typeof activityIntensityMetrics[number];

export const dailyActivityDetailsMetrics = [
	MetricType.UserDailySteps,
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyCaloriesBurned,
	MetricType.UserDailyCardioPoints,
	MetricType.UserDailyVO2Max,
	MetricType.UserDailyHRMax,
] as const;
export type DailyActivityDetailsMetrics = typeof dailyActivityDetailsMetrics[number];

export const dailyActivityDetailsMetricsGoals = [
	MetricType.UserDailyStepsGoalMin,
	MetricType.UserDailyStepsGoalMax,
	MetricType.UserDailyWalkingEquivalencyGoalMin,
	MetricType.UserDailyWalkingEquivalencyGoalMax,
	MetricType.UserDailyCaloriesBurnedGoalMin,
	MetricType.UserDailyCaloriesBurnedGoalMax,
	MetricType.UserDailyCardioPointsGoalMin,
	MetricType.UserDailyCardioPointsGoalMax,
] as const;
export type DailyActivityDetailsMetricsGoals = typeof dailyActivityDetailsMetricsGoals[number];

export const weeklyActivityGoals = [
	MetricType.UserWeeklyCardioPointsGoalMax,
	MetricType.UserWeeklyCardioPointsGoalMin,
] as const;
export type WeeklyActivityGoals = typeof weeklyActivityGoals[number];

export const dailyEnergyScoreMetrics = [
	MetricType.UserDailyScoreRecovery,
	MetricType.UserDailyWakeUpScore,
	MetricType.UserDailySleepBR,
	MetricType.UserDailySleepHRV,
	MetricType.UserDailyRHR,
	MetricType.UserDailySleepVarTemperature,
	MetricType.UserDailySleepScore,
	MetricType.UserDailyScoreSleepBalance,
	MetricType.UserDailyScoreActivityVolume,
] as const;
export type DailyEnergyScoreMetrics = typeof dailyEnergyScoreMetrics[number];

export const dailyEnergyScoreMetricsGaugeSize = [
	MetricType.UserDailyScoreBr,
	MetricType.UserDailyScoreHRV,
	MetricType.UserDailyScoreRHR,
	MetricType.UserDailyScoreVarTemperature,
] as const
export type DailyEnergyScoreMetricsGaugeSize = typeof dailyEnergyScoreMetricsGaugeSize[number]

export const dailyEnergyScoreGaugeCalibrationMetrics = [
	MetricType.UserDailyScoreRecoveryGoalMin,
	MetricType.UserDailyScoreRecoveryGoalMax,
	MetricType.UserDailyWakeUpScoreGoalMax,
	MetricType.UserDailyWakeUpScoreGoalMin,
	MetricType.UserDailyScoreBRGoalMax,
	MetricType.UserDailyScoreBRGoalMin,
	MetricType.UserDailyScoreHRVGoalMin,
	MetricType.UserDailyScoreHRVGoalMax,
	MetricType.UserDailyScoreRHRGoalMin,
	MetricType.UserDailyScoreRHRGoalMax,
	MetricType.UserDailyScoreVarTemperatureGoalMin,
	MetricType.UserDailyScoreVarTemperatureGoalMax,
	MetricType.UserDailySleepScoreGoalMin,
	MetricType.UserDailySleepScoreGoalMax,
	MetricType.UserDailyScoreSleepBalanceGoalMin,
	MetricType.UserDailyScoreSleepBalanceGoalMax,
	MetricType.UserDailyScoreActivityVolumeGoalMin,
	MetricType.UserDailyScoreActivityVolumeGoalMax,
] as const;
export type DailyEnergyScoreGaugeCalibrationMetrics = typeof dailyEnergyScoreGaugeCalibrationMetrics[number];

/**
 * Those metrics are used for display the value of the gauge.
 */
export const dailySleepDetailsMetrics = [
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercDeepStage,
	MetricType.UserDailyTimeToFallAsleep,
	MetricType.UserDailySleepDebt,
] as const;
export type DailySleepDetailsMetrics = typeof dailySleepDetailsMetrics[number];

export const dailySleepDetailsMetricsGaugeSize = [
	MetricType.UserDailyPercAwakeStageDuration,
	MetricType.UserDailyPercRealSleep,
	MetricType.UserDailyCorrectedPercREMStage,
	MetricType.UserDailyCorrectedPercDeepStage,
	MetricType.UserDailyPercTimeToFallAsleep,
	MetricType.UserDailyPercSleepDebt,
] as const
export type DailySleepDetailsMetricsGaugeSize = typeof dailySleepDetailsMetricsGaugeSize[number]

/**
 * Those metrics are used for the gauge calibration.
 */
export const dailySleepDetailsGaugeCalibrationMetrics = [
	MetricType.UserDailyPercRealSleepDurationGoalMin,
	MetricType.UserDailyPercRealSleepDurationGoalMax,
	MetricType.UserDailyTranquilityGoalMin,
	MetricType.UserDailyTranquilityGoalMax,
	MetricType.UserDailyCircadianRhythmGoalMin,
	MetricType.UserDailyCircadianRhythmGoalMax,
	MetricType.UserDailyPercREMStageScoreGoalMin,
	MetricType.UserDailyPercREMStageScoreGoalMax,
	MetricType.UserDailyPercDeepStageScoreGoalMin,
	MetricType.UserDailyPercDeepStageScoreGoalMax,
	MetricType.UserDailyPercTimeToFallAsleepGoalMin,
	MetricType.UserDailyPercTimeToFallAsleepGoalMax,
	MetricType.UserDailySleepDebtGoalMin,
	MetricType.UserDailySleepDebtGoalMax,
] as const;
export type DailySleepDetailsGaugeMetrics = typeof dailySleepDetailsGaugeCalibrationMetrics[number];
