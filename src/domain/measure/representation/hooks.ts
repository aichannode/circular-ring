import moment from "moment";
import { DailyActivityGoals, MetricType } from "../metric";
import { ActivityStage, SleepStage } from "../type";
import {
	DailyActivityDetailsMetrics,
	DailyEnergyScoreMetrics,
	DailySleepDetailsGaugeMetrics,
	DailySleepDetailsMetrics,
	RangeDetails,
	StageInfos,
} from "./type";

export function useDailyActivityIntensity(isoDay?: string): Array<StageInfos<ActivityStage>> {
	// TODO implement
	// esteban
	return [];
}

export function useDailyActivityDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return;
}

export function useDailyActivityDetails(
	isoDay?: string
): RangeDetails<DailyActivityDetailsMetrics | DailyActivityGoals | DailyEnergyScoreMetrics> {
	// TOTO implement
	return {
		[MetricType.UserDailySteps]: 1000,
		[MetricType.UserDailyWalkingEquivalency]: 1,
		[MetricType.UserDailyAwakeHrMax]: 145,
		[MetricType.UserDailyStepsGoalMin]: 0,
		[MetricType.UserDailyStepsGoalMax]: 0,
		[MetricType.UserDailyWalkingEquivalencyGoalMin]: 0,
		[MetricType.UserDailyWalkingEquivalencyGoalMax]: 0,
		[MetricType.UserWeeklyCardioPointsGoalMax]: 0,
		[MetricType.UserWeeklyCardioPointsGoalMin]: 0,
		[MetricType.UserDailyCardioPointsGoalMax]: 0,
		[MetricType.UserDailyCardioPointsGoalMin]: 0,
		[MetricType.UserDailySleepQualityScore]: 0,
	};
}

export function useDailySleepStages(isoDay?: string): Array<StageInfos<SleepStage>> {
	// TOTO implement

	// Mock data for the night
	const cursor = moment().subtract(1, "day").hour(22).minutes(0);

	/**
	 * Spec for stages
	 * - stages array is always between user.core.sleep.begin and user.core.sleep.end
	 */
	return [
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(20, "minutes").toISOString(),
		},
		{
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		},
		{
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(50, "minutes").toISOString(),
		},
		{
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		},
		{
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(30, "minutes").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		},
		{
			type: SleepStage.AWAKE,
			start: cursor.toISOString(),
			end: cursor.add(45, "minutes").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		},
		{
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(90, "minutes").toISOString(),
		},
		{
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(30, "minutes").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(20, "minutes").toISOString(),
		},
		{
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(15, "minutes").toISOString(),
		},
		{
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(120, "minutes").toISOString(),
		},
	];
}

export function useSleepDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return;
}

export function useDailySleepDetails(
	isoDay?: string
): RangeDetails<DailySleepDetailsMetrics | DailySleepDetailsGaugeMetrics> {
	// TOTO implement
	return {
		[MetricType.UserDailyAwakeStageDuration]: 8,
		[MetricType.UserDailyRealSleepDuration]: 362,
		[MetricType.UserDailyPercREMStage]: 0,
		[MetricType.UserDailyPercDeepStage]: 0,
		[MetricType.UserDailyTranquility]: 0,
		[MetricType.UserDailyCircadianRhythm]: 0,
		[MetricType.UserDailyTimeToFallAsleep]: 0,
		[MetricType.UserDailySleepDebt]: 0,
		[MetricType.UserDailyPercAwakeStageDuration]: 0,
		[MetricType.UserDailyPercRealSleep]: 50,
		[MetricType.UserDailyPercREMStageScore]: 0,
		[MetricType.UserDailyPercdeepStageScore]: 0,
		[MetricType.UserDailyPercTimeTtoFallAsleep]: 0,
		[MetricType.UserDailyPercSleepDebt]: 0,
	};
}

export function useDailyEnergyScore(isoDay?: string): number | undefined {
	// TOTO implement
	return 88;
}

export function useDailySleepQualityScore(isoDay?: string): number | undefined {
	// TOTO implement
	return;
}

export function useDailyGlobalScore(isoDay?: string): number | undefined {
	// TOTO implement
	return;
}
