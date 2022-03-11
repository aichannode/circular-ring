import { Present } from "@core/model";
import moment from "moment";
import { Proposal } from "../common/type";
import { MetricType } from "../metric";
import {
	caloriesBurned,
	CaloriesBurned,
	ContributorActivityVolume,
	contributorActivityVolume,
	ContributorAwakeDuration,
	contributorAwakeDuration,
	ContributorBodyRecovery,
	contributorBodyRecovery,
	ContributorBRScore,
	contributorBRScore,
	ContributorCircadianRhythm,
	contributorCircadianRhythm,
	ContributorDailyTranquility,
	contributorDailyTranquility,
	ContributorDeepSleepuration,
	contributorDeepSleepuration,
	ContributorHRV,
	contributorHRV,
	ContributorRealSleepDuration,
	contributorRealSleepDuration,
	ContributorREMDuration,
	contributorREMDuration,
	ContributorRHR,
	contributorRHR,
	ContributorSleepBalance,
	contributorSleepBalance,
	ContributorSleepDebt,
	contributorSleepDebt,
	ContributorSleepQuality,
	contributorSleepQuality,
	ContributorSPO2,
	contributorSPO2,
	ContributorTimeToFallAsleep,
	contributorTimeToFallAsleep,
	ContributorVarTemperature,
	contributorVarTemperature,
	ContributorWakeUpScore,
	contributorWakeUpScore,
	dailyActivityIntensityMetrics,
	DailyActivityIntensityMetrics,
	dailyHRConstantMetrics,
	DailyHRConstantMetrics,
	dailyHRTimeSeriesMetrics,
	DailyHRTimeSeriesMetrics,
	dailySleepScoreMetrics,
	dailySleepStageDuration,
	DailySleepStageDuration,
	SleepStagesMetrics,
	sleepStagesMetrics,
	stepsTaken,
	StepsTaken,
	walkingEquivalency,
	WalkingEquivalency,
} from "../representation/lib/type";
import { MeasureApi } from "./lib/measureApi";

export function createActions(measureApi: MeasureApi, present: Present<Proposal>) {
	return {
		async setDailyHRMetrics(isoDay: string = moment().toISOString()) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRTimeSeriesMetrics>(dailyHRTimeSeriesMetrics, isoDay),
				measureApi.fetchLastDailyMeasures<DailyHRConstantMetrics>(dailyHRConstantMetrics, isoDay),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyHRMetrics",
						payload: {
							isoDate: isoDay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async setEachDayOfMonthScore(isoDate: string) {
			const range = await measureApi.fetchMonthlyMeasures<MetricType.UserDailyGlobalScore>(
				[MetricType.UserDailyGlobalScore],
				isoDate
			);
			present(
				range.map((block) => ({
					type: "setGlobalScore",
					payload: {
						isoDate: block.timestamp,
						score: block.metrics[MetricType.UserDailyGlobalScore]
							? Number(block.metrics[MetricType.UserDailyGlobalScore])
							: undefined,
					},
				}))
			);
		},
		async setDailyGlobalScore(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyGlobalScore], isoDay);
			present([
				{
					type: "setGlobalScore",
					payload: {
						isoDate: isoDay,
						score: data[MetricType.UserDailyGlobalScore] ? Number(data[MetricType.UserDailyGlobalScore]) : undefined,
					},
				},
			]);
		},
		async setDailySleepScore(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures(dailySleepScoreMetrics, isoDay);
			present([
				{
					type: "setSleepScore",
					payload: {
						isoDate: isoDay,
						data: {
							[MetricType.UserDailySleepScore]: data[MetricType.UserDailySleepScore] as number,
							[MetricType.UserDailySleepScoreGoalMin]: data[MetricType.UserDailySleepScoreGoalMin] as number,
							[MetricType.UserDailySleepScoreGoalMax]: data[MetricType.UserDailySleepScoreGoalMax] as number,
						},
					},
				},
			]);
		},
		async setDailyEnergyScore(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyEnergyScore], isoDay);
			present([
				{
					type: "setDailyEnergyScore",
					payload: {
						isoDate: isoDay,
						score: data[MetricType.UserDailyEnergyScore] ? Number(data[MetricType.UserDailyEnergyScore]) : undefined,
					},
				},
			]);
		},
		async setDailyActivityIntensityMetrics(isoDay: string = moment().toISOString()) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyActivityIntensityMetrics>(dailyActivityIntensityMetrics, isoDay),
				measureApi.fetchLastDailyMeasures<MetricType.UserDailyActivityTotal>(
					[MetricType.UserDailyActivityTotal],
					isoDay
				),
			]).then(function ([timeSeries, duration]) {
				present([
					{
						type: "setDailyActivityIntensityMetrics",
						payload: {
							isoDate: isoDay,
							range: {
								timeSeries,
								constant: duration,
							},
						},
					},
				]);
			});
		},
		async setDailyActivitiesMetrics(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures<
				StepsTaken | WalkingEquivalency | CaloriesBurned | MetricType.UserDailyVO2Max | MetricType.UserDailyAwakeHRMax
			>(
				[
					...stepsTaken,
					...walkingEquivalency,
					...caloriesBurned,
					MetricType.UserDailyVO2Max,
					MetricType.UserDailyAwakeHRMax,
				],
				isoDay
			);
			present([
				{
					type: "setDailyActivitiesMetrics",
					payload: {
						isoDate: isoDay,
						data,
					},
				},
			]);
		},
		async setDailyEnergyScoreContributorsMetrics(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures<
				| ContributorBodyRecovery
				| ContributorWakeUpScore
				| ContributorBRScore
				| ContributorSPO2
				| ContributorHRV
				| ContributorRHR
				| ContributorVarTemperature
				| ContributorSleepQuality
				| ContributorSleepBalance
				| ContributorActivityVolume
			>(
				[
					...contributorBodyRecovery,
					...contributorWakeUpScore,
					...contributorBRScore,
					...contributorSPO2,
					...contributorHRV,
					...contributorRHR,
					...contributorVarTemperature,
					...contributorSleepQuality,
					...contributorSleepBalance,
					...contributorActivityVolume,
				],
				isoDay
			);
			present([
				{
					type: "setDailyEnergyScoreContributorsMetrics",
					payload: {
						isoDate: isoDay,
						data,
					},
				},
			]);
		},
		async setDailySleepScoreContributorsMetrics(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures<
				| ContributorAwakeDuration
				| ContributorRealSleepDuration
				| ContributorDailyTranquility
				| ContributorCircadianRhythm
				| ContributorREMDuration
				| ContributorDeepSleepuration
				| ContributorTimeToFallAsleep
				| ContributorSleepDebt
			>(
				[
					...contributorAwakeDuration,
					...contributorRealSleepDuration,
					...contributorDailyTranquility,
					...contributorCircadianRhythm,
					...contributorREMDuration,
					...contributorDeepSleepuration,
					...contributorTimeToFallAsleep,
					...contributorSleepDebt,
				],
				isoDay
			);
			present([
				{
					type: "setDailySleepScoreContributorsMetrics",
					payload: {
						isoDate: isoDay,
						data,
					},
				},
			]);
		},
		/**
		 * This actions will update the model with the sleep stages and duration for
		 * the given day.
		 */
		async setDailySleepStagesMetrics(isoDay: string = moment().toISOString()) {
			Promise.all([
				measureApi.fetchMeasures<SleepStagesMetrics>(
					sleepStagesMetrics,
					// Grab data from the noon before the day to make sure to get the ensleepment.
					// TODO: implement day/night worker
					moment(isoDay).startOf("day").subtract(12, "hours").toISOString(),
					moment(isoDay).endOf("day").toISOString()
				),
				measureApi.fetchLastDailyMeasures<DailySleepStageDuration>(dailySleepStageDuration, isoDay),
			]).then(function ([timeline, duration]) {
				present([
					{
						type: "setDailySleepMetrics",
						payload: {
							isoDate: isoDay,
							range: {
								timeSeries: timeline,
								constant: duration,
							},
						},
					},
				]);
			});
		},
	};
}
