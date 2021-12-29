import { DailyActivityGoals, MetricType } from "../metric";
import { ActivityStage, SleepStage } from "../type";
import { DailyActivityDetailsMetrics, DailyEnergyScoreMetrics, DailySleepDetailsGaugeMetrics, DailySleepDetailsMetrics, RangeDetails, StageInfos } from "./type";

export function useDailyActivityIntensity(isoDay?: string): Array<StageInfos<ActivityStage>> {
	// TODO implement
	return []
}

export function useDailyActivityDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return
}

export function useDailyActivityDetails(isoDay?: string): RangeDetails<
	| DailyActivityDetailsMetrics
	| DailyActivityGoals
	| DailyEnergyScoreMetrics
> {
	// TOTO implement
	return {
		[MetricType.UserDailySteps]: 0,
		[MetricType.UserDailyWalkingEquivalency]: 0,
		[MetricType.UserDailyAwakeHrMax]: 0,
		[MetricType.UserDailyStepsGoalMin]: 0,
		[MetricType.UserDailyStepsGoalMax]: 0,
		[MetricType.UserDailyWalkingEquivalencyGoalMin]: 0,
		[MetricType.UserDailyWalkingEquivalencyGoalMax]: 0,
		[MetricType.UserWeeklyCardioPointsGoalMax]: 0,
		[MetricType.UserWeeklyCardioPointsGoalMin]: 0,
		[MetricType.UserDailyCardioPointsGoalMax]: 0,
		[MetricType.UserDailyCardioPointsGoalMin]: 0,
		[MetricType.UserDailySleepQualityScore]: 0,
	}
}

export function useDailySleepStages(isoDay?: string): Array<StageInfos<SleepStage>> {
	// TOTO implement
	return []
}

export function useSleepDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return
}

export function useDailySleepDetails(isoDay?: string): RangeDetails<DailySleepDetailsMetrics | DailySleepDetailsGaugeMetrics> {
	// TOTO implement
	return {
		[MetricType.UserDailyAwakeStageDuration]: 0,
		[MetricType.UserDailyRealSleepDuration]: 0,
		[MetricType.UserDailyPercREMStage]: 0,
		[MetricType.UserDailyPercDeepStage]: 0,
		[MetricType.UserDailyTranquility]: 0,
		[MetricType.UserDailyCircadianRhythm]: 0,
		[MetricType.UserDailyTimeToFallAsleep]: 0,
		[MetricType.UserDailySleepDebt]: 0,
		[MetricType.UserDailyPercAwakeStageDuration]: 0,
		[MetricType.UserDailyPercRealSleep]: 0,
		[MetricType.UserDailyPercREMStageScore]: 0,
		[MetricType.UserDailyPercdeepStageScore]: 0,
		[MetricType.UserDailyPercTimeTtoFallAsleep]: 0,
		[MetricType.UserDailyPercSleepDebt]: 0,
	}
}

export function useDailyEnergyScore(isoDay?: string): number | undefined {
	// TOTO implement
	return
}

export function useDailySleepQualityScore(isoDay?: string): number | undefined {
	// TOTO implement
	return
}

export function useDailyGlobalScore(isoDay?: string): number | undefined {
	// TOTO implement
	return
}