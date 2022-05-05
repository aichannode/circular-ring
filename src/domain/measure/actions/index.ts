import { Present } from "@core/model";
import { getCurrentLocalISODay, getLocalISODayFromUTCDate, toISOMonth } from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
import moment from "moment";
import { Proposal } from "../common/type";
import { MetricType } from "../metric";
import {
	AcitivityMetrics,
	activityIntensity7DAverageMetrics,
	ActivityIntensity7DAverageMetrics,
	activityIntensityAllAverageMetrics,
	ActivityIntensityAllAverageMetrics,
	activityIntensityMonthlyMetrics,
	ActivityIntensityMonthlyMetrics,
	activityMetrics,
	CardioPointsConstantMetrics,
	cardioPointsConstantMetrics,
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
	dailyActivityIntensityDuration,
	DailyActivityIntensityDuration,
	dailyActivityIntensityMetrics,
	DailyActivityIntensityMetrics,
	dailyBRConstantMetrics,
	DailyBRConstantMetrics,
	DailyBRTimeSeriesMetrics,
	dailyBRTimeSeriesMetrics,
	dailyHRConstantMetrics,
	DailyHRConstantMetrics,
	dailyHRNightConstantMetrics,
	DailyHRNightConstantMetrics,
	dailyHRNightTimeSeriesMetrics,
	DailyHRNightTimeSeriesMetrics,
	dailyHRTimeSeriesMetrics,
	DailyHRTimeSeriesMetrics,
	DailyHRTrendTimeSeriesMetrics,
	dailyHRTrendTimeSeriesMetrics,
	dailyHRVConstantMetrics,
	DailyHRVConstantMetrics,
	dailyHRVTimeSeriesMetrics,
	DailyHRVTimeSeriesMetrics,
	DailyHRVTrendTimeSeriesMetrics,
	dailyHRVTrendTimeSeriesMetrics,
	dailySleepScoreMetrics,
	dailySleepStageDuration,
	DailySleepStageDuration,
	dailySpo2ConstantMetrics,
	DailySpo2ConstantMetrics,
	DailySpo2TimeSeriesMetrics,
	dailySpo2TimeSeriesMetrics,
	dailyWakeUpScoreMetrics,
	Sleep7DConstantMetrics,
	sleep7DConstantMetrics,
	sleepAllConstantMetrics,
	SleepAllConstantMetrics,
	SleepMonthlyStageMetrics,
	sleepMonthlyStageMetrics,
	SleepStagesMetrics,
	sleepStagesMetrics,
} from "../representation/lib/type";
import { MeasureApi } from "./lib/measureApi";

/**
 * Actions for measure domain
 * All date are in locale timezone
 */

export function createActions(measureApi: MeasureApi, present: Present<Proposal>) {
	return {
		async pullLast7DSleepMetrics(localISODay: ISODay = getCurrentLocalISODay(), useForceRefresh?: boolean) {
			const data = await measureApi.fetchLast7DaysMeasures<Sleep7DConstantMetrics>(
				sleep7DConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "pullLast7DSleepMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async pullMonthlySleepStageMetrics(
			localISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay()),
			useForceRefresh = false
		) {
			const data = await measureApi.fetchLastMonthlyMeasures<SleepMonthlyStageMetrics>(
				sleepMonthlyStageMetrics,
				localISOMonth,
				useForceRefresh
			);
			present([
				{
					type: "pullMonthlySleepStageMetrics",
					payload: {
						localISOMonth,
						data,
					},
				},
			]);
		},
		async pullLastAllSleepConstantMetrics(
			localISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay()),
			useForceRefresh = false
		) {
			const data = await measureApi.fetchLastAllMeasures<SleepAllConstantMetrics>(
				sleepAllConstantMetrics,
				localISOMonth,
				useForceRefresh
			);
			present([
				{
					type: "pullLastAllSleepConstantMetrics",
					payload: {
						localISOMonth,
						data,
					},
				},
			]);
		},
		async setDailyHRMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRTimeSeriesMetrics>(dailyHRTimeSeriesMetrics, localISODay, useForceRefresh),
				measureApi.fetchLastDailyMeasures<DailyHRConstantMetrics>(dailyHRConstantMetrics, localISODay, useForceRefresh),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyHRMetrics",
						payload: {
							localISODay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async pullDailyHRNightMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRNightTimeSeriesMetrics>(
					dailyHRNightTimeSeriesMetrics,
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailyHRNightConstantMetrics>(
					dailyHRNightConstantMetrics,
					localISODay,
					useForceRefresh
				),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyHRNightMetrics",
						payload: {
							localISODay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async setEachDayOfMonthScore(localISOMonth: ISOMonth, useForceRefresh?: boolean) {
			const range = await measureApi.fetchMonthlyMeasures<MetricType.UserDailyGlobalScore>(
				[MetricType.UserDailyGlobalScore],
				localISOMonth,
				useForceRefresh
			);
			present(
				range.map((block) => {
					return {
						type: "setGlobalScore",
						payload: {
							localISODay: getLocalISODayFromUTCDate(block.timestamp),
							score: block.metrics[MetricType.UserDailyGlobalScore]
								? Number(block.metrics[MetricType.UserDailyGlobalScore])
								: null,
						},
					};
				})
			);
		},
		async pullDailySpo2Metrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailySpo2TimeSeriesMetrics>(
					dailySpo2TimeSeriesMetrics,
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailySpo2ConstantMetrics>(
					dailySpo2ConstantMetrics,
					localISODay,
					useForceRefresh
				),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailySpo2Metrics",
						payload: {
							localISODay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async pullDailyHRVMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRVTimeSeriesMetrics>(
					dailyHRVTimeSeriesMetrics,
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailyHRVConstantMetrics>(
					dailyHRVConstantMetrics,
					localISODay,
					useForceRefresh
				),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyHRVMetrics",

						payload: {
							localISODay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async pullDailyBRMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyBRTimeSeriesMetrics>(dailyBRTimeSeriesMetrics, localISODay, useForceRefresh),
				measureApi.fetchLastDailyMeasures<DailyBRConstantMetrics>(dailyBRConstantMetrics, localISODay, useForceRefresh),
			]).then(function ([timeSeries, constant]) {
				present([
					{
						type: "setDailyBRMetrics",

						payload: {
							localISODay,
							range: {
								timeSeries,
								constant,
							},
						},
					},
				]);
			});
		},
		async pullDailyHRVTrendMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			const timeSeries = await measureApi.fetchDailyMeasures<DailyHRVTrendTimeSeriesMetrics>(
				dailyHRVTrendTimeSeriesMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHRVTrendMetrics",
					payload: {
						localISODay,
						range: {
							timeSeries,
							constant: {},
						},
					},
				},
			]);
		},
		async pullDailyHRTrendMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			const timeSeries = await measureApi.fetchDailyMeasures<DailyHRTrendTimeSeriesMetrics>(
				dailyHRTrendTimeSeriesMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHRTrendMetrics",
					payload: {
						localISODay,
						range: {
							timeSeries,
							constant: {},
						},
					},
				},
			]);
		},
		async setDailyGlobalScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyGlobalScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setGlobalScore",
					payload: {
						localISODay,
						score: data[MetricType.UserDailyGlobalScore] ? Number(data[MetricType.UserDailyGlobalScore]) : null,
					},
				},
			]);
		},
		async setDailySleepScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(dailySleepScoreMetrics, localISODay, useForceRefresh);
			present([
				{
					type: "setSleepScore",
					payload: {
						localISODay,
						data: {
							[MetricType.UserDailySleepScore]: data[MetricType.UserDailySleepScore],
							[MetricType.UserDailySleepScoreGoalMin]: data[MetricType.UserDailySleepScoreGoalMin],
							[MetricType.UserDailySleepScoreGoalMax]: data[MetricType.UserDailySleepScoreGoalMax],
						},
					},
				},
			]);
		},
		async setDailyEnergyScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyEnergyScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyEnergyScore",
					payload: {
						localISODay,
						score: data[MetricType.UserDailyEnergyScore] ? Number(data[MetricType.UserDailyEnergyScore]) : null,
					},
				},
			]);
		},
		async setLast7DEnergyScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.User7DaysEnergyScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DEnergyScore",
					payload: {
						localISODay,
						score: data[MetricType.User7DaysEnergyScore] as number,
					},
				},
			]);
		},
		async setDailyWakeUpScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(dailyWakeUpScoreMetrics, localISODay, useForceRefresh);
			present([
				{
					type: "setDailyWakeUpScore",
					payload: {
						localISODay,
						data: {
							[MetricType.UserDailyWakeUpScore]: data[MetricType.UserDailyWakeUpScore] as number,
							[MetricType.UserDailyWakeUpScoreGoalMin]: data[MetricType.UserDailyWakeUpScoreGoalMin] as number,
							[MetricType.UserDailyWakeUpScoreGoalMax]: data[MetricType.UserDailyWakeUpScoreGoalMax] as number,
						},
					},
				},
			]);
		},
		async pullDailyCardioPoints(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyCardioPoints],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyCardioPoints",
					payload: {
						localISODay,
						cardio: data[MetricType.UserDailyCardioPoints] ? Number(data[MetricType.UserDailyCardioPoints]) : null,
					},
				},
			]);
		},
		async pullLast7DCardioPoints(localISODay: ISODay, useForceRefresh?: boolean) {
			const constant = await measureApi.fetchLastDailyMeasures<CardioPointsConstantMetrics>(
				cardioPointsConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DCardioPoints",
					payload: {
						localISODay,
						data: constant,
					},
				},
			]);
		},
		async pullDailyActivityIntensityMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyActivityIntensityMetrics>(
					dailyActivityIntensityMetrics,
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailyActivityIntensityDuration>(
					dailyActivityIntensityDuration,
					localISODay,
					useForceRefresh
				),
			]).then(function ([timeSeries, duration]) {
				present([
					{
						type: "pullDailyActivityIntensityMetrics",
						payload: {
							localISODay,
							range: {
								timeSeries,
								constant: duration,
							},
						},
					},
				]);
			});
		},
		async setMonthlyActivityIntensityMetrics(
			localISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay()),
			useForceRefresh = false
		) {
			const data = await measureApi.fetchLastMonthlyMeasures<ActivityIntensityMonthlyMetrics>(
				activityIntensityMonthlyMetrics,
				localISOMonth,
				useForceRefresh
			);
			present([
				{
					type: "setMonthlyActivityIntensityMetrics",
					payload: {
						localISOMonth,
						data,
					},
				},
			]);
		},

		async pullLast7DActivityIntensityMetrics(
			localISODay: ISODay = moment().toISOString() as ISODay,
			useForceRefresh = false
		) {
			const data = await measureApi.fetchLast7DaysMeasures<ActivityIntensity7DAverageMetrics>(
				activityIntensity7DAverageMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "pullLast7DActivityIntensityMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async pullLastAllActivityIntensityMetrics(
			localISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay()),
			useForceRefresh = false
		) {
			const data = await measureApi.fetchLastAllMeasures<ActivityIntensityAllAverageMetrics>(
				activityIntensityAllAverageMetrics,
				localISOMonth,
				useForceRefresh
			);
			present([
				{
					type: "pullLastAllActivityIntensityMetrics",
					payload: {
						localISOMonth,
						data,
					},
				},
			]);
		},
		async setDailyActivitiesMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures<AcitivityMetrics>(
				activityMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyActivitiesMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async setDailyEnergyScoreContributorsMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
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
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyEnergyScoreContributorsMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async setDailySleepScoreContributorsMetrics(isoDay: ISODay, useForceRefresh?: boolean) {
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
				isoDay,
				useForceRefresh
			);
			present([
				{
					type: "setDailySleepScoreContributorsMetrics",
					payload: {
						localISODay: isoDay,
						data,
					},
				},
			]);
		},
		/**
		 * This actions will update the model with the sleep stages and duration for
		 * the given day.
		 */
		async setDailySleepStagesMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchMeasures<SleepStagesMetrics>(
					sleepStagesMetrics,
					// Grab data from the noon before the day to make sure to get the ensleepment.
					// TODO: implement day/night worker
					moment(localISODay).startOf("day").subtract(12, "hours").toISOString(),
					moment(localISODay).endOf("day").toISOString(),
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailySleepStageDuration>(
					dailySleepStageDuration,
					localISODay,
					useForceRefresh
				),
			]).then(function ([timeline, duration]) {
				present([
					{
						type: "setDailySleepMetrics",
						payload: {
							localISODay,
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
