import { Present } from "@core/model";
import { getCurrentLocalISODay, getLocalISODayFromUTCDate, toISOMonth } from "@domain/common/business";
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
	dailyActivityIntensityDuration,
	DailyActivityIntensityDuration,
	dailyActivityIntensityMetrics,
	DailyActivityIntensityMetrics,
	dailyHRConstantMetrics,
	DailyHRConstantMetrics,
	dailyHRTimeSeriesMetrics,
	DailyHRTimeSeriesMetrics,
	dailySleepScoreMetrics,
	dailySleepStageDuration,
	DailySleepStageDuration,
	dailyWakeUpScoreMetrics,
	Sleep7DConstantMetrics,
	sleep7DConstantMetrics,
	sleepAllConstantMetrics,
	SleepAllConstantMetrics,
	SleepMonthlyStageMetrics,
	sleepMonthlyStageMetrics,
	SleepStagesMetrics,
	sleepStagesMetrics,
	stepsTaken,
	StepsTaken,
	walkingEquivalency,
	WalkingEquivalency,
} from "../representation/lib/type";
import { MeasureApi } from "./lib/measureApi";

/**
 * Actions for measure domain
 * All date are in locale timezone
 */

export function createActions(measureApi: MeasureApi, present: Present<Proposal>) {
	return {
		async pullLast7DSleepMetrics(localISODay: ISODay = getCurrentLocalISODay(), useForceRefresh = false) {
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
		async setDailyHRMetrics(localISODay: ISODay = getCurrentLocalISODay()) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyHRTimeSeriesMetrics>(dailyHRTimeSeriesMetrics, localISODay),
				measureApi.fetchLastDailyMeasures<DailyHRConstantMetrics>(dailyHRConstantMetrics, localISODay),
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
		async setEachDayOfMonthScore(localISOMonth: ISOMonth) {
			const range = await measureApi.fetchMonthlyMeasures<MetricType.UserDailyGlobalScore>(
				[MetricType.UserDailyGlobalScore],
				localISOMonth
			);
			present(
				range.map((block) => {
					return {
						type: "setGlobalScore",
						payload: {
							localISODay: getLocalISODayFromUTCDate(block.timestamp),
							score: block.metrics[MetricType.UserDailyGlobalScore]
								? Number(block.metrics[MetricType.UserDailyGlobalScore])
								: undefined,
						},
					};
				})
			);
		},
		async setDailyGlobalScore(localISODay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyGlobalScore], localISODay);
			present([
				{
					type: "setGlobalScore",
					payload: {
						localISODay,
						score: data[MetricType.UserDailyGlobalScore] ? Number(data[MetricType.UserDailyGlobalScore]) : undefined,
					},
				},
			]);
		},
		async setDailySleepScore(localISODay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures(dailySleepScoreMetrics, localISODay);
			present([
				{
					type: "setSleepScore",
					payload: {
						localISODay,
						data: {
							[MetricType.UserDailySleepScore]: data[MetricType.UserDailySleepScore] as number,
							[MetricType.UserDailySleepScoreGoalMin]: data[MetricType.UserDailySleepScoreGoalMin] as number,
							[MetricType.UserDailySleepScoreGoalMax]: data[MetricType.UserDailySleepScoreGoalMax] as number,
						},
					},
				},
			]);
		},
		async setDailyEnergyScore(localISODay: ISODay = moment().toISOString() as ISODay, useForceRefresh = false) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.UserDailyEnergyScore], localISODay);
			present([
				{
					type: "setDailyEnergyScore",
					payload: {
						localISODay,
						score: data[MetricType.UserDailyEnergyScore] ? Number(data[MetricType.UserDailyEnergyScore]) : undefined,
					},
				},
			]);
		},
		async setLast7DEnergyScore(localISODay: ISODay = getCurrentLocalISODay()) {
			const data = await measureApi.fetchLastDailyMeasures([MetricType.User7DaysEnergyScore], localISODay);
			present([
				{
					type: "setLast7DEnergyScore",
					payload: {
						localISODay,
						score: (data[MetricType.User7DaysEnergyScore] as number) ?? 0,
					},
				},
			]);
		},
		async setDailyWakeUpScore(localISODay: ISODay = moment().toISOString() as ISODay) {
			const data = await measureApi.fetchLastDailyMeasures(dailyWakeUpScoreMetrics, localISODay);
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
		async setDailyActivityIntensityMetrics(localISODay: ISODay = moment().toISOString() as ISODay) {
			Promise.all([
				measureApi.fetchDailyMeasures<DailyActivityIntensityMetrics>(dailyActivityIntensityMetrics, localISODay),
				measureApi.fetchLastDailyMeasures<DailyActivityIntensityDuration>(dailyActivityIntensityDuration, localISODay),
			]).then(function ([timeSeries, duration]) {
				present([
					{
						type: "setDailyActivityIntensityMetrics",
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
		async setDailyActivitiesMetrics(localISODay: ISODay = moment().toISOString() as ISODay) {
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
				localISODay
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
		async setDailyEnergyScoreContributorsMetrics(localISODay: ISODay = moment().toISOString() as ISODay) {
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
				localISODay
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
		async setDailySleepScoreContributorsMetrics(isoDay: ISODay = getCurrentLocalISODay()) {
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
		async setDailySleepStagesMetrics(localISODay: ISODay = moment().toISOString() as ISODay, useForceRefresh = false) {
			Promise.all([
				measureApi.fetchMeasures<SleepStagesMetrics>(
					sleepStagesMetrics,
					// Grab data from the noon before the day to make sure to get the ensleepment.
					// TODO: implement day/night worker
					moment(localISODay).startOf("day").subtract(12, "hours").toISOString(),
					moment(localISODay).endOf("day").toISOString(),
					useForceRefresh
				),
				measureApi.fetchLastDailyMeasures<DailySleepStageDuration>(dailySleepStageDuration, localISODay),
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
