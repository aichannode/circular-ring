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
	return 4 * 60; // 4 hours of activity
}

export function useDailyActivityDetails(
	isoDay?: string
): RangeDetails<DailyActivityDetailsMetrics | DailyActivityGoals | DailyEnergyScoreMetrics> {
	// TOTO implement
	return {
		[MetricType.UserDailySteps]: 1800,
		[MetricType.UserDailyWalkingEquivalency]: 1.1,
		[MetricType.UserDailyAwakeHrMax]: 87,
		[MetricType.UserDailyStepsGoalMin]: 3000,
		[MetricType.UserDailyStepsGoalMax]: 10000,
		[MetricType.UserDailyWalkingEquivalencyGoalMin]: 1000,
		[MetricType.UserDailyWalkingEquivalencyGoalMax]: 10000,
		[MetricType.UserWeeklyCardioPointsGoalMax]: 100,
		[MetricType.UserWeeklyCardioPointsGoalMin]: 0,
		[MetricType.UserDailyCardioPointsGoalMax]: 100,
		[MetricType.UserDailyCardioPointsGoalMin]: 0,
		[MetricType.UserDailySleepQualityScore]: 73,
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
		}, {
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		}, {
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(50, "minutes").toISOString(),
		}, {
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		}, {
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(30, "minutes").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		}, {
			type: SleepStage.AWAKE,
			start: cursor.toISOString(),
			end: cursor.add(45, "minutes").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(10, "minutes").toISOString(),
		}, {
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(90, "minutes").toISOString(),
		}, {
			type: SleepStage.REM,
			start: cursor.toISOString(),
			end: cursor.add(30, "minutes").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(20, "minutes").toISOString(),
		}, {
			type: SleepStage.DEEP,
			start: cursor.toISOString(),
			end: cursor.add(15, "minutes").toISOString(),
		}, {
			type: SleepStage.LIGHT,
			start: cursor.toISOString(),
			end: cursor.add(120, "minutes").toISOString(),
		}
		
	];
}

export function useSleepDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return 645 * 60 * 1000;
}

export function useDailySleepDetails(
	isoDay?: string
): RangeDetails<DailySleepDetailsMetrics | DailySleepDetailsGaugeMetrics> {
	// TOTO implement
	return {
		[MetricType.UserDailyAwakeStageDuration]: 45,
		[MetricType.UserDailyRealSleepDuration]: 330,
		[MetricType.UserDailyPercREMStage]: 22,
		[MetricType.UserDailyPercDeepStage]: 18,
		[MetricType.UserDailyTranquility]: 50,
		[MetricType.UserDailyCircadianRhythm]: 60,
		[MetricType.UserDailyTimeToFallAsleep]: 60,
		[MetricType.UserDailySleepDebt]: 158,
		[MetricType.UserDailyPercAwakeStageDuration]: 10,
		[MetricType.UserDailyPercRealSleep]: 51,
		[MetricType.UserDailyPercREMStageScore]: 22,
		[MetricType.UserDailyPercdeepStageScore]: 18,
		[MetricType.UserDailyPercTimeTtoFallAsleep]: 10,
		[MetricType.UserDailyPercSleepDebt]: 60,
	};
}

export function useDailyEnergyScore(isoDay?: string): number | undefined {
	// TOTO implement
	return 55;
}

export function useDailySleepQualityScore(isoDay?: string): number | undefined {
	// TOTO implement
	return 47;
}

export function useDailyGlobalScore(isoDay?: string): number | undefined {
	// TOTO implement
	return 60;
}
