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
	CalorieBurnedConstantMetrics,
	calorieBurnedConstantMetrics,
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
	DailyHRSConstantMetrics,
	dailyHRSConstantMetrics,
	DailyHRSMetrics,
	dailyHRSMetrics,
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
	DailyPhaseBeforeWakeUpMetrics,
	dailyPhaseBeforeWakeUpMetrics,
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
	SleepStagesBeginEnd,
	sleepStagesBeginEnd,
	SleepStagesMetrics,
	sleepStagesMetrics,
	stepsConstantMetrics,
	StepsConstantMetrics,
	TemperatureVariationConstantMetrics,
	temperatureVariationConstantMetrics,
} from "../representation/lib/type";
import { MeasureApi } from "./lib/measureApi";

/**
 * Actions for measure domain
 * All date are in locale timezone
 */

/**
 * null values converted to -1
 */

export function createActions(measureApi: MeasureApi, present: Present<Proposal>) {
	const lifetimeDate = "2000-01-01";
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
				measureApi.fetchLastDailyMeasures<MetricType.UserDailyAwakeHRReference>(
					[MetricType.UserDailyAwakeHRReference],
					lifetimeDate,
					true
				),
			]).then(function ([timeSeries, constant, reference]) {
				constant[MetricType.UserDailyAwakeHRReference] = reference[MetricType.UserDailyAwakeHRReference];
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
				measureApi.fetchLastDailyMeasures<MetricType.UserDailySleepHR>(
					[MetricType.UserDailySleepHR],
					lifetimeDate,
					true
				),
			]).then(function ([timeSeries, constant, reference]) {
				constant[MetricType.UserDailySleepHR] = reference[MetricType.UserDailySleepHR];
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
				measureApi.fetchLastDailyMeasures<MetricType.UserDailyAsleepSPO2Reference>(
					[MetricType.UserDailyAsleepSPO2Reference],
					lifetimeDate,
					true
				),
			]).then(function ([timeSeries, constant, reference]) {
				constant[MetricType.UserDailyAsleepSPO2Reference] = reference[MetricType.UserDailyAsleepSPO2Reference];
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
		async setMonthlySpo2Constants(localISODay: ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchLastDailyMeasures([MetricType.User30DaysAverageSpo2], localISODay, useForceRefresh),
				measureApi.fetchLastDailyMeasures([MetricType.UserDailyAsleepSPO2Reference], lifetimeDate, useForceRefresh),
			]).then(function ([average, reference]) {
				present([
					{
						type: "setMonthlySpo2Constants",
						payload: {
							localISODay,
							constant: {
								[MetricType.User30DaysAverageSpo2]: average[MetricType.User30DaysAverageSpo2],
								[MetricType.UserDailyAsleepSPO2Reference]: reference[MetricType.UserDailyAsleepSPO2Reference],
							},
						},
					},
				]);
			});
		},
		async setMonthlyHrNightConstants(localISODay: ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchLastDailyMeasures(
					[MetricType.UserMonthlyHrAverage, MetricType.UserMonthlyHrMin, MetricType.UserMonthlyHrMax],
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures([MetricType.UserDailySleepHR], lifetimeDate, useForceRefresh),
			]).then(function ([constant, reference]) {
				present([
					{
						type: "setMonthlyHrNightConstants",
						payload: {
							localISODay,
							constant: {
								[MetricType.UserMonthlyHrAverage]: constant[MetricType.UserMonthlyHrAverage],
								[MetricType.UserMonthlyHrMin]: constant[MetricType.UserMonthlyHrMin],
								[MetricType.UserMonthlyHrMax]: constant[MetricType.UserMonthlyHrMax],
								[MetricType.UserDailySleepHR]: reference[MetricType.UserDailySleepHR],
							},
						},
					},
				]);
			});
		},
		async setMonthlyTemperatureVariationConstants(localISODay: ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchLastDailyMeasures([MetricType.UserMonthlyTemperatureAverage], localISODay, useForceRefresh),
			]).then(function ([constant]) {
				present([
					{
						type: "setMonthlyTemperatureVariationConstants",
						payload: {
							localISODay,
							constant: {
								[MetricType.UserMonthlyTemperatureAverage]: constant[MetricType.UserMonthlyTemperatureAverage],
							},
						},
					},
				]);
			});
		},
		async setMonthlyHRVConstants(localISODay: ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchLastDailyMeasures([MetricType.UserMonthlyHRVAverage], localISODay, useForceRefresh),
				measureApi.fetchLastDailyMeasures([MetricType.UserDailyReferenceHRV], lifetimeDate, useForceRefresh),
			]).then(function ([constant, reference]) {
				present([
					{
						type: "setMonthlyHRVConstants",
						payload: {
							localISODay,
							constant: {
								[MetricType.UserMonthlyHRVAverage]: constant[MetricType.UserMonthlyHRVAverage],
								[MetricType.UserDailyReferenceHRV]: reference[MetricType.UserDailyReferenceHRV],
							},
						},
					},
				]);
			});
		},
		async setMonthlyHrConstants(localISODay: ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchLastDailyMeasures(
					[MetricType.UserAwakeMonthlyHR, MetricType.UserAwakeMonthlyHRMin, MetricType.UserAwakeMonthlyHRMax],
					localISODay,
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures([MetricType.UserDailyAwakeHRReference], lifetimeDate, useForceRefresh),
			]).then(function ([constant, reference]) {
				present([
					{
						type: "setMonthlyHrConstants",
						payload: {
							localISODay,
							constant: {
								[MetricType.UserAwakeMonthlyHR]: constant[MetricType.UserAwakeMonthlyHR],
								[MetricType.UserDailyAwakeHRReference]: reference[MetricType.UserDailyAwakeHRReference],
								[MetricType.UserAwakeMonthlyHRMin]: constant[MetricType.UserAwakeMonthlyHRMin],
								[MetricType.UserAwakeMonthlyHRMax]: constant[MetricType.UserAwakeMonthlyHRMax],
							},
						},
					},
				]);
			});
		},

		async setDailySpo2(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailySPO2], localISODay, useForceRefresh);
			present([
				{
					type: "setDailySpo2",
					payload: {
						localISODay,
						data: data[MetricType.UserDailySPO2] ? Number(data[MetricType.UserDailySPO2]) : -1,
					},
				},
			]);
		},

		async setDailyHr(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyAwakeHRAverage],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHr",
					payload: {
						localISODay,
						data: data[MetricType.UserDailyAwakeHRAverage] ? Number(data[MetricType.UserDailyAwakeHRAverage]) : -1,
					},
				},
			]);
		},
		async setDailyHrNight(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserHR], localISODay, useForceRefresh);
			present([
				{
					type: "setDailyHrNight",
					payload: {
						localISODay,
						data: data[MetricType.UserHR] ? Number(data[MetricType.UserHR]) : -1,
					},
				},
			]);
		},

		async setDailyHRV(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyAsleepHRV],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHRV",
					payload: {
						localISODay,
						data: data[MetricType.UserDailyAsleepHRV] ? Number(data[MetricType.UserDailyAsleepHRV]) : -1,
					},
				},
			]);
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
				measureApi.fetchLastDailyMeasures<MetricType.UserDailyAsleepBRReference>(
					[MetricType.UserDailyAsleepBRReference],
					lifetimeDate,
					true
				),
			]).then(function ([timeSeries, constant, reference]) {
				constant[MetricType.UserDailyAsleepBRReference] = reference[MetricType.UserDailyAsleepBRReference];
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
		async setDailyRestingHeartRate(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyRHR], localISODay, useForceRefresh);
			present([
				{
					type: "setDailyRestingHeartRate",
					payload: {
						localISODay,
						data: data[MetricType.UserDailyRHR] ? Number(data[MetricType.UserDailyRHR]) : -1,
					},
				},
			]);
		},
		async setLast7DRestingHeartRate(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchLastDailyMeasures([MetricType.User7DaysAverageRHR], localISODay, useForceRefresh),
				measureApi.fetchLastDailyMeasures([MetricType.User7DaysReferenceRHR], lifetimeDate, useForceRefresh),
			]).then(function ([data, reference]) {
				present([
					{
						type: "setLast7DRestingHeartRate",
						payload: {
							localISODay,
							constant: {
								[MetricType.User7DaysAverageRHR]: data[MetricType.User7DaysAverageRHR],
								[MetricType.User7DaysReferenceRHR]: reference[MetricType.User7DaysReferenceRHR],
							},
						},
					},
				]);
			});
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
						score: data[MetricType.UserDailyEnergyScore] ? Number(data[MetricType.UserDailyEnergyScore]) : -1,
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
		async setLast30DSpo2(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.User30DaysSpo2], localISODay, useForceRefresh);
			present([
				{
					type: "setLast30DSpo2",
					payload: {
						localISODay,
						score: data[MetricType.User30DaysSpo2] as number,
					},
				},
			]);
		},
		async setDailySleepQualityScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailySleepScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailySleepScore",
					payload: {
						localISODay,
						score: data[MetricType.UserDailySleepScore] ? Number(data[MetricType.UserDailySleepScore]) : -1,
					},
				},
			]);
		},
		async setLast7DSleepScore(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.User7DaysSleepScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DSleepScore",
					payload: {
						localISODay,
						score: data[MetricType.User7DaysSleepScore] as number,
					},
				},
			]);
		},
		async setDailyPhaseBeforeWakeUp(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures<DailyPhaseBeforeWakeUpMetrics>(
				dailyPhaseBeforeWakeUpMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyPhaseBeforeWakeUp",
					payload: {
						localISODay,
						data,
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
						cardio: data[MetricType.UserDailyCardioPoints] ? Number(data[MetricType.UserDailyCardioPoints]) : -1,
					},
				},
			]);
		},
		async pullDailyCalorieBurned(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyCaloriesBurned],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyCalorieBurned",
					payload: {
						localISODay,
						calorie: data[MetricType.UserDailyCaloriesBurned] ? Number(data[MetricType.UserDailyCaloriesBurned]) : -1,
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
		async pullDailyTemperatureVariation(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures(
				[MetricType.UserDailyTemperatureScore],
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyTemperatureVariation",
					payload: {
						localISODay,
						//for temprature, we have negatif values so here for null values we change it to -1000
						temperature: data[MetricType.UserDailyTemperatureScore]
							? Number(data[MetricType.UserDailyTemperatureScore])
							: -1000,
					},
				},
			]);
		},
		async pullLast7DTemperatureVariation(localISODay: ISODay, useForceRefresh?: boolean) {
			const constant = await measureApi.fetchLastDailyMeasures<TemperatureVariationConstantMetrics>(
				temperatureVariationConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DTemperatureVariation",
					payload: {
						localISODay,
						data: constant,
					},
				},
			]);
		},
		async pullLast7DCalorieBurned(localISODay: ISODay, useForceRefresh?: boolean) {
			const constant = await measureApi.fetchLastDailyMeasures<CalorieBurnedConstantMetrics>(
				calorieBurnedConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DCalorieBurned",
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
		async pullDailySteps(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailySteps], localISODay, useForceRefresh);
			present([
				{
					type: "setDailyStepsMetrics",
					payload: {
						localISODay,
						data: data[MetricType.UserDailySteps] ? Number(data[MetricType.UserDailySteps]) : -1,
					},
				},
			]);
		},
		async pullLast7DSteps(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures<StepsConstantMetrics>(
				stepsConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setLast7DStepsConstants",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async pullDailyHRSMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures<DailyHRSMetrics>(
				dailyHRSMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHRSMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
		},
		async pullDailyHRSConstantMetrics(localISODay: ISODay, useForceRefresh?: boolean) {
			const data = await measureApi.fetchLastDailyMeasures<DailyHRSConstantMetrics>(
				dailyHRSConstantMetrics,
				localISODay,
				useForceRefresh
			);
			present([
				{
					type: "setDailyHRSConstantMetrics",
					payload: {
						localISODay,
						data,
					},
				},
			]);
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
		async setCoreSleep(localISODay: ISODay, useForceRefresh?: boolean) {
			Promise.all([
				measureApi.fetchMeasures<SleepStagesBeginEnd>(
					sleepStagesBeginEnd,
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
						type: "setCoreSleep",
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
