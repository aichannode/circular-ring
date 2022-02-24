import { MetricType } from "../../metric";
import { ActivityStage, SleepStage } from "../../type";

export type StageInfos<T extends SleepStage | ActivityStage> = {
	level: T;
	/** Iso date */
	start: string;
	/** Iso date */
	end: string;
};

/**
 * Used by the representation, atomically select needed data
 */

export const dailyActivityIntensityMetrics = [
	MetricType.UserDataActivityIntensity,
	MetricType.UserDailySportBegin,
	MetricType.UserDailySportEnd,
	MetricType.UserDailyActivityTotal,
] as const;
export type DailyActivityIntensityMetrics = typeof dailyActivityIntensityMetrics[number];

export const dailyActivitiesMetrics = [
	MetricType.UserDailySteps,
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyCaloriesBurned,
	MetricType.UserDailyCardioPoints,
	MetricType.UserDailyVO2Max,
	MetricType.UserDailyHRMax,
] as const;
export type DailyActivitiesMetrics = typeof dailyActivitiesMetrics[number];

export const dailyActivitiesMetricsGoals = [
	MetricType.UserDailyStepsGoalMin,
	MetricType.UserDailyStepsGoalMax,
	MetricType.UserDailyWalkingEquivalencyGoalMin,
	MetricType.UserDailyWalkingEquivalencyGoalMax,
	MetricType.UserDailyCaloriesBurnedGoalMin,
	MetricType.UserDailyCaloriesBurnedGoalMax,
	MetricType.UserDailyCardioPointsGoalMin,
	MetricType.UserDailyCardioPointsGoalMax,
] as const;
export type DailyActivitiesMetricsGoals = typeof dailyActivitiesMetricsGoals[number];

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
] as const;
export type DailyEnergyScoreMetricsGaugeSize = typeof dailyEnergyScoreMetricsGaugeSize[number];

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
export const dailySleepScoreContributorsMetrics = [
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercDeepStage,
	MetricType.UserTimeToFallASleep,
	MetricType.UserDailySleepDebt,
] as const;
export type DailySleepScoreContributorsMetrics = typeof dailySleepScoreContributorsMetrics[number];

export const dailySleepScoreContributorsMetricsGaugeSize = [
	MetricType.UserDailyPercAwakeStage,
	MetricType.UserDailyPercRealSleep,
	MetricType.UserDailyCorrectedPercREMStage,
	MetricType.UserDailyCorrectedPercDeepStage,
	MetricType.UserDailyPercSleepDebt,
] as const;
export type DailySleepScoreContributorsMetricsGaugeSize = typeof dailySleepScoreContributorsMetricsGaugeSize[number];

/**
 * Those metrics are used for the gauge calibration.
 */
export const dailySleepScoreContributorsGaugeCalibrationMetrics = [
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
export type DailySleepScoreContributorsGaugeCalibrationMetrics =
	typeof dailySleepScoreContributorsGaugeCalibrationMetrics[number];

/**
 * Those metrics are used for the stages circle and hypnogram.
 * They represents the different sleep stages (core sleep and naps)
 * along a time slice.
 */
export const sleepStagesMetrics = [MetricType.UserSleepStage, MetricType.UserNapSleepBegin, MetricType.UserNapSleepEnd];
export type SleepStagesMetrics = typeof sleepStagesMetrics[number];

/**
 * This is a set of metrics used accross multiple components.
 * They are computed metrics. That means that there value is
 * the last known value for a time slice.
 */
export const dailySleepStageDuration = [
	MetricType.UserCoreSleepBegin,
	MetricType.UserCoreSleepEnd,
	MetricType.UserTimeToFallASleep,
	MetricType.UserDailyTotalSleepDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyREMStageDuration,
	MetricType.UserDailyLightStageDuration,
	MetricType.UserDailyDeepStageDuration,
	MetricType.UserDailyPercRealSleep,
	MetricType.UserDailyPercAwakeStage,
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercLightStage,
	MetricType.UserDailyPercDeepStage,
] as const;
export type DailySleepStageDuration = typeof dailySleepStageDuration[number];
