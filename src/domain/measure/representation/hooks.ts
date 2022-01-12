import moment from "moment";
import { MetricType } from "../metric";
import { ActivityStage, SleepStage } from "../type";
import {
	DailyActivityDetailsMetrics,
	DailyActivityDetailsMetricsGoals,
	DailyEnergyScoreGaugeCalibrationMetrics,
	DailyEnergyScoreMetrics,
	DailyEnergyScoreMetricsGaugeSize,
	DailySleepDetailsGaugeMetrics,
	DailySleepDetailsMetrics,
	DailySleepDetailsMetricsGaugeSize,
	RangeDetails,
	StageInfos,
} from "./type";

export function useDailyActivityIntensity(isoDay?: string): Array<StageInfos<ActivityStage>> {
	// TODO implement
	// esteban
	const cursor = moment().hour(8).minutes(30);

	return [
		{
			type: ActivityStage.LOW,
			start: cursor.toISOString(),
			end: cursor.add(6, "hours").toISOString(),
		},
		{
			type: ActivityStage.MEDIUM,
			start: cursor.toISOString(),
			end: cursor.add(1, "hours").toISOString(),
		},
		{
			type: ActivityStage.HIGH,
			start: cursor.toISOString(),
			end: cursor.add(1, "hour").toISOString(),
		},
		{
			type: ActivityStage.MEDIUM,
			start: cursor.toISOString(),
			end: cursor.add(1, "hours").toISOString(),
		},
		{
			type: ActivityStage.LOW,
			start: cursor.toISOString(),
			end: cursor.add(5, "hours").toISOString(),
		},
		// {
		// 	type: ActivityStage.LOW,
		// 	start: cursor.toISOString(),
		// 	end: cursor.add(8, "hours").toISOString(),
		// },
		// {
		// 	type: ActivityStage.LOW,
		// 	start: cursor.toISOString(),
		// 	end: cursor.add(30, "minutes").toISOString(),
		// },
	];
}

export function useDailyActivityDuration(isoDay?: string): number | undefined {
	// TOTO implement
	return 1 * 60; // 4 hours of activity
}

export function useDailyMetrics(
	isoDay?: string
): RangeDetails<DailyActivityDetailsMetrics | DailyActivityDetailsMetricsGoals> {
	return {
		[MetricType.UserDailySteps]: 9200,
		[MetricType.UserDailyWalkingEquivalency]: 5.4,
		[MetricType.UserDailyCaloriesBurned]: 1010,
		[MetricType.UserDailyCardioPoints]: 157,
		[MetricType.UserDailyVO2Max]: 35,
		[MetricType.UserDailyHRMax]: 123,
		// Goals
		[MetricType.UserDailyStepsGoalMin]: 4500,
		[MetricType.UserDailyStepsGoalMax]: 8000,
		[MetricType.UserDailyWalkingEquivalencyGoalMin]: 3150,
        [MetricType.UserDailyWalkingEquivalencyGoalMax]: 5600,
        [MetricType.UserDailyCaloriesBurnedGoalMin]: 1561.34,
        [MetricType.UserDailyCaloriesBurnedGoalMax]: 2023.36,
		[MetricType.UserDailyCardioPointsGoalMin]: 75 / 7,
		[MetricType.UserDailyCardioPointsGoalMax]: 150 / 7,
	}
}

export function useDailyEnergyScoreDetails(
	isoDay?: string
): RangeDetails<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics> {
	// TOTO implement
	return {
		// Those metrics are used to display the gauge label
		[MetricType.UserDailyScoreRecovery]: 0.83,
        [MetricType.UserDailyWakeUpScore]: 0.96,
        [MetricType.UserDailySleepBR]: 14.3,
        [MetricType.UserDailyScoreBr]: 0.85,
        [MetricType.UserDailySleepHRV]: 68,
        [MetricType.UserDailyScoreHRV]: 0.93,
        [MetricType.UserDailyRHR]: 62,
        [MetricType.UserDailyScoreRHR]: 0.78,
        [MetricType.UserDailySleepVarTemperature]: 0.5,
        [MetricType.UserDailyScoreVarTemperature]: 0.87,
        [MetricType.UserDailySleepScore]: 0.83,
        [MetricType.UserDailyScoreSleepBalance]: 0.98,
        [MetricType.UserDailyScoreActivityVolume]: 0.93,

		// Those metrics are used for the gauge calibration
		[MetricType.UserDailyScoreRecoveryGoalMax]: .8,
		[MetricType.UserDailyScoreRecoveryGoalMin]: .9,
		[MetricType.UserDailyWakeUpScoreGoalMin]: .8,
		[MetricType.UserDailyWakeUpScoreGoalMax]: .9,
		[MetricType.UserDailyScoreBRGoalMin]: .8,
		[MetricType.UserDailyScoreBRGoalMax]: .9,
		[MetricType.UserDailyScoreHRVGoalMin]: .8,
		[MetricType.UserDailyScoreHRVGoalMax]: .9,
		[MetricType.UserDailyScoreRHRGoalMin]: .8,
		[MetricType.UserDailyScoreRHRGoalMax]: .9,
		[MetricType.UserDailyScoreVarTemperatureGoalMin]: .8,
		[MetricType.UserDailyScoreVarTemperatureGoalMax]: .9,
		[MetricType.UserDailySleepScoreGoalMin]: .8,
		[MetricType.UserDailySleepScoreGoalMax]: .9,
		[MetricType.UserDailyScoreSleepBalanceGoalMin]: .8,
		[MetricType.UserDailyScoreSleepBalanceGoalMax]: .9,
		[MetricType.UserDailyScoreActivityVolumeGoalMin]: .8,
		[MetricType.UserDailyScoreActivityVolumeGoalMax]: .9,
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
	return 10 * 60 + 30;
}

export function useDailySleepDetails(
	isoDay?: string
): RangeDetails<DailySleepDetailsMetrics | DailySleepDetailsMetricsGaugeSize | DailySleepDetailsGaugeMetrics> {
	// TOTO implement
	return {
        // Those metrics are used to display the gauge label
        [MetricType.UserDailyTranquility]: 0.83,
        [MetricType.UserDailyCircadianRhythm]: 0.89,
        [MetricType.UserDailyAwakeStageDuration]: 45,
        [MetricType.UserDailyPercAwakeStageDuration]: 0.08,
        [MetricType.UserDailyRealSleepDuration]: 514,
        [MetricType.UserDailyPercRealSleep]: 0.92,
        [MetricType.UserDailyPercREMStage]: 0.23,
        [MetricType.UserDailyCorrectedPercREMStage]: 0.94,
        [MetricType.UserDailyPercDeepStage]: 0.09,
        [MetricType.UserDailyCorrectedPercDeepStage]: 0.74,
        [MetricType.UserDailyTimeToFallAsleep]: 22,
        [MetricType.UserDailyPercTimeToFallAsleep]: 0.93,
        [MetricType.UserDailySleepDebt]: -11,
        [MetricType.UserDailyPercSleepDebt]: 0.98,
        // Those metrics are used for the gauge calibration
        [MetricType.UserDailyPercRealSleepDurationGoalMin]: 0.8,
        [MetricType.UserDailyPercRealSleepDurationGoalMax]: 0.9,
        [MetricType.UserDailyTranquilityGoalMin]: 0.8,
        [MetricType.UserDailyTranquilityGoalMax]: 0.9,
        [MetricType.UserDailyCircadianRhythmGoalMin]: .8,
        [MetricType.UserDailyCircadianRhythmGoalMax]: .9,
        [MetricType.UserDailyPercREMStageScoreGoalMin]: 0.8,
        [MetricType.UserDailyPercREMStageScoreGoalMax]: 0.9,
        [MetricType.UserDailyPercDeepStageScoreGoalMin]: .8,
        [MetricType.UserDailyPercDeepStageScoreGoalMax]: .9,
        [MetricType.UserDailyPercTimeToFallAsleepGoalMin]: 0.8,
        [MetricType.UserDailyPercTimeToFallAsleepGoalMax]: 0.9,
        [MetricType.UserDailySleepDebtGoalMin]: 0.8,
        [MetricType.UserDailySleepDebtGoalMax]: 0.9,
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
