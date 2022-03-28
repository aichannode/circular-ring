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
 * Metrics grouped by usage for the representation
 */

export const dailyHRConstantMetrics = [
	MetricType.UserDailyAwakeHRMax,
	MetricType.UserDailyAwakeHRMin,
	MetricType.UserDailyAwakeHRAverage,
	MetricType.UserDailyAwakeHRReference,
] as const;
export type DailyHRConstantMetrics = typeof dailyHRConstantMetrics[number];

export const dailyHRTimeSeriesMetrics = [MetricType.UserHR] as const;
export type DailyHRTimeSeriesMetrics = typeof dailyHRTimeSeriesMetrics[number];

/**
 * Score flasks
 */
export const dailySleepScoreMetrics = [
	MetricType.UserDailySleepScore,
	MetricType.UserDailySleepScoreGoalMin,
	MetricType.UserDailySleepScoreGoalMax,
] as const;
export type DailySleepScoreMetrics = typeof dailySleepScoreMetrics[number];

export const dailyWakeUpScoreMetrics = [
	MetricType.UserDailyWakeUpScore,
	MetricType.UserDailyWakeUpScoreGoalMin,
	MetricType.UserDailyWakeUpScoreGoalMax,
] as const;
export type DailyWakeUpScoreMetrics = typeof dailyWakeUpScoreMetrics[number];

/**
 * Score contributors
 */

export const contributorBodyRecovery = [
	MetricType.UserDailyBodyRecovery,
	MetricType.UserDailyBodyRecoveryGoalMin,
	MetricType.UserDailyBodyRecoveryGoalMax,
] as const;
export type ContributorBodyRecovery = typeof contributorBodyRecovery[number];

export const contributorWakeUpScore = [
	MetricType.UserDailyWakeUpScore,
	MetricType.UserDailyWakeUpScoreGoalMin,
	MetricType.UserDailyWakeUpScoreGoalMax,
] as const;
export type ContributorWakeUpScore = typeof contributorWakeUpScore[number];

export const contributorBRScore = [
	MetricType.UserDailyAsleepBR,
	MetricType.UserDailyScoreBR,
	MetricType.UserDailyScoreBRGoalMin,
	MetricType.UserDailyScoreBRGoalMax,
] as const;
export type ContributorBRScore = typeof contributorBRScore[number];

export const contributorSPO2 = [
	MetricType.UserDailyAsleepSPO2,
	MetricType.UserDailyScoreSPO2,
	MetricType.UserDailyScoreSPO2GoalMin,
	MetricType.UserDailyScoreSPO2GoalMax,
] as const;
export type ContributorSPO2 = typeof contributorSPO2[number];

export const contributorHRV = [
	MetricType.UserDailyAsleepHRV,
	MetricType.UserDailyScoreHRV,
	MetricType.UserDailyScoreHRVGoalMin,
	MetricType.UserDailyScoreHRVGoalMax,
] as const;
export type ContributorHRV = typeof contributorHRV[number];

export const contributorRHR = [
	MetricType.UserDailyRHR,
	MetricType.UserDailyScoreRHR,
	MetricType.UserDailyScoreRHRGoalMin,
	MetricType.UserDailyScoreRHRGoalMax,
] as const;
export type ContributorRHR = typeof contributorRHR[number];

export const contributorVarTemperature = [
	MetricType.UserDailySleepVarTemperature,
	MetricType.UserDailySleepScoreVarTemperature,
	MetricType.UserDailySleepScoreVarTemperatureGoalMin,
	MetricType.UserDailySleepScoreVarTemperatureGoalMax,
] as const;
export type ContributorVarTemperature = typeof contributorVarTemperature[number];

export const contributorSleepQuality = [
	MetricType.User2DaysSleepScore,
	MetricType.UserDailySleepScore,
	MetricType.UserDailySleepScoreGoalMin,
	MetricType.UserDailySleepScoreGoalMax,
] as const;
export type ContributorSleepQuality = typeof contributorSleepQuality[number];

export const contributorSleepBalance = [
	MetricType.UserDailySleepBalance,
	MetricType.UserDailySleepBalanceGoalMin,
	MetricType.UserDailySleepBalanceGoalMax,
] as const;
export type ContributorSleepBalance = typeof contributorSleepBalance[number];

export const contributorActivityVolume = [
	MetricType.UserDailyActivityVolume,
	MetricType.UserDailyActivityVolumeGoalMin,
	MetricType.UserDailyActivityVolumeGoalMax,
] as const;
export type ContributorActivityVolume = typeof contributorActivityVolume[number];

export const contributorAwakeDuration = [
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyPercAwakeStage,
] as const;
export type ContributorAwakeDuration = typeof contributorAwakeDuration[number];

export const contributorRealSleepDuration = [
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyPercRealSleep,
] as const;
export type ContributorRealSleepDuration = typeof contributorRealSleepDuration[number];

export const contributorDailyTranquility = [
	MetricType.UserDailyTranquility,
	MetricType.UserDailyTranquilityGoalMin,
	MetricType.UserDailyTranquilityGoalMax,
] as const;
export type ContributorDailyTranquility = typeof contributorDailyTranquility[number];

export const contributorCircadianRhythm = [
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyCircadianRhythmGoalMin,
	MetricType.UserDailyCircadianRhythmGoalMax,
] as const;
export type ContributorCircadianRhythm = typeof contributorCircadianRhythm[number];

export const contributorREMDuration = [
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercREMStageScore,
	MetricType.UserDailyPercREMStageScoreGoalMin,
	MetricType.UserDailyPercREMStageScoreGoalMax,
] as const;
export type ContributorREMDuration = typeof contributorREMDuration[number];

export const contributorDeepSleepuration = [
	MetricType.UserDailyPercDeepStage,
	MetricType.UserDailyPercDeepStageScoreGoalMin,
	MetricType.UserDailyPercDeepStageScoreGoalMax,
] as const;
export type ContributorDeepSleepuration = typeof contributorDeepSleepuration[number];

export const contributorTimeToFallAsleep = [
	MetricType.UserDailyCoreTimeToFallAsleep,
	MetricType.UserDailyCorePercTimeToFallAsleep,
	MetricType.UserDailyCorePercTimeToFallAsleepGoalMin,
	MetricType.UserDailyCorePercTimeToFallAsleepGoalMax,
] as const;
export type ContributorTimeToFallAsleep = typeof contributorTimeToFallAsleep[number];

export const contributorSleepDebt = [
	MetricType.UserDailySleepDebt,
	MetricType.UserDailyPercSleepDebt,
	MetricType.UserDailyPercSleepDebtGoalMin,
	MetricType.UserDailyPercSleepDebtGoalMax,
] as const;
export type ContributorSleepDebt = typeof contributorSleepDebt[number];

/**
 * Activity intensity
 */
export const dailyActivityIntensityMetrics = [
	MetricType.UserDataActivityIntensity,
	MetricType.UserDailySportBegin,
	MetricType.UserDailySportEnd,
] as const;
export type DailyActivityIntensityMetrics = typeof dailyActivityIntensityMetrics[number];

/**
 * Activities metrics
 */
export const stepsTaken = [
	MetricType.UserDailySteps,
	MetricType.UserDailyStepsGoalMin,
	MetricType.UserDailyStepsGoalMax,
] as const;
export type StepsTaken = typeof stepsTaken[number];

export const walkingEquivalency = [
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyWalkingEquivalencyGoalMin,
	MetricType.UserDailyWalkingEquivalencyGoalMax,
] as const;
export type WalkingEquivalency = typeof walkingEquivalency[number];

export const caloriesBurned = [MetricType.UserDailyCaloriesBurned, MetricType.UserDailyCaloriesBurnedGoal] as const;
export type CaloriesBurned = typeof caloriesBurned[number];

export const cardioPoints = [
	MetricType.UserDailyCardioPoints,
	MetricType.UserDailyCardioPointsGoalMin,
	MetricType.UserDailyCardioPointsGoalMax,
] as const;
export type CardioPoints = typeof cardioPoints[number];

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
	MetricType.UserDailyCoreTimeToFallAsleep,
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

/**
 * List of score contributors and activities
 */

export const activityScoreContributors = [
	MetricType.UserDailyBodyRecovery,
	MetricType.UserDailyWakeUpScore,
	MetricType.UserDailyScoreBR,
	MetricType.UserDailyScoreSPO2,
	MetricType.UserDailyScoreHRV,
	MetricType.UserDailyScoreRHR,
	MetricType.UserDailySleepScoreVarTemperature,
	MetricType.UserDailySleepScore,
	MetricType.UserDailySleepBalance,
	MetricType.UserDailyActivityVolume,
] as const;
export type ActivityScoreContributors = typeof activityScoreContributors[number];

export const activities = [
	MetricType.UserDailySteps,
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyCaloriesBurned,
	MetricType.UserDailyCardioPoints,
	MetricType.UserDailyVO2Max,
	MetricType.UserDailyAwakeHRMax,
] as const;
export type Activities = typeof activities[number];

export const sleepScoreContributors = [
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyPercREMStageScore,
	MetricType.UserDailyPercDeepStage,
	MetricType.UserDailyCoreTimeToFallAsleep,
	MetricType.UserDailySleepDebt,
] as const;
export type SleepScoreContributors = typeof sleepScoreContributors[number];
