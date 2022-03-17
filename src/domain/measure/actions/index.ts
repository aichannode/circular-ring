import { Present } from "@core/model";
import { getLocalISODayFromUTCDate } from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
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
		async setDailyHRMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRTimeSeriesMetrics>(dailyHRTimeSeriesMetrics, isoDay),
				measureApi.fetchLastDailyMeasures<DailyHRConstantMetrics>(dailyHRConstantMetrics, isoDay),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyHRMetrics",
						payload: {
							isoDay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async setEachDayOfMonthScore(isoMonth: ISOMonth) {
			const range = await measureApi.fetchMonthlyMeasures<MetricType.UserDailyGlobalScore>(
				[MetricType.UserDailyGlobalScore],
				isoMonth
			);
			present(
				range.map((block) => {
					return {
						type: "setGlobalScore",
						payload: {
							isoDay: getLocalISODayFromUTCDate(block.timestamp),
							score: block.metrics[MetricType.UserDailyGlobalScore]
								? Number(block.metrics[MetricType.UserDailyGlobalScore])
								: undefined,
						},
					};
				})
			);
		},
		async setDailyGlobalScore(isoDay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyGlobalScore], isoDay);
			present([
				{
					type: "setGlobalScore",
					payload: {
						isoDay,
						score: data[MetricType.UserDailyGlobalScore] ? Number(data[MetricType.UserDailyGlobalScore]) : undefined,
					},
				},
			]);
		},
		async setDailySleepScore(isoDay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures(dailySleepScoreMetrics, isoDay);
			present([
				{
					type: "setSleepScore",
					payload: {
						isoDay,
						data: {
							[MetricType.UserDailySleepScore]: data[MetricType.UserDailySleepScore] as number,
							[MetricType.UserDailySleepScoreGoalMin]: data[MetricType.UserDailySleepScoreGoalMin] as number,
							[MetricType.UserDailySleepScoreGoalMax]: data[MetricType.UserDailySleepScoreGoalMax] as number,
						},
					},
				},
			]);
		},
		async setDailyEnergyScore(isoDay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyEnergyScore], isoDay);
			present([
				{
					type: "setDailyEnergyScore",
					payload: {
						isoDay,
						score: data[MetricType.UserDailyEnergyScore] ? Number(data[MetricType.UserDailyEnergyScore]) : undefined,
					},
				},
			]);
		},
		async setDailyActivityIntensityMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
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
							isoDay,
							range: {
								timeSeries,
								constant: duration,
							},
						},
					},
				]);
			});
		},
		async setDailyActivitiesMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
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
						isoDay,
						data,
					},
				},
			]);
		},
		async setDailyEnergyScoreContributorsMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
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
						isoDay,
						data,
					},
				},
			]);
		},
		async setDailySleepScoreContributorsMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
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
						isoDay,
						data,
					},
				},
			]);
		},
		/**
		 * This actions will update the model with the sleep stages and duration for
		 * the given day.
		 */
		async setDailySleepStagesMetrics(isoDay: ISODay = moment().toISOString() as ISODay) {
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
							isoDay,
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
