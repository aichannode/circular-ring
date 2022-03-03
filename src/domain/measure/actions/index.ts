import { Present } from "@core/model";
import moment from "moment";
import { Proposal } from "../common/type";
import { MetricType } from "../metric";
import {
	DailyActivitiesMetrics,
	dailyActivitiesMetrics,
	dailyActivitiesMetricsGoals,
	DailyActivitiesMetricsGoals,
	dailyActivityIntensityMetrics,
	DailyActivityIntensityMetrics,
	DailyEnergyScoreGaugeCalibrationMetrics,
	dailyEnergyScoreGaugeCalibrationMetrics,
	DailyEnergyScoreMetrics,
	dailyEnergyScoreMetrics,
	DailyEnergyScoreMetricsGaugeSize,
	dailyEnergyScoreMetricsGaugeSize,
	dailySleepScoreContributorsGaugeCalibrationMetrics,
	DailySleepScoreContributorsGaugeCalibrationMetrics,
	dailySleepScoreContributorsMetrics,
	DailySleepScoreContributorsMetrics,
	dailySleepScoreContributorsMetricsGaugeSize,
	DailySleepScoreContributorsMetricsGaugeSize,
	dailySleepScoreMetrics,
	dailySleepStageDuration,
	DailySleepStageDuration,
	SleepStagesMetrics,
	sleepStagesMetrics,
} from "../representation/lib/type";
import { MeasureApi } from "./lib/measureApi";

export function createActions(measureApi: MeasureApi, present: Present<Proposal>) {
	return {
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
			]).then(function ([timeline, duration]) {
				present([
					{
						type: "setDailyActivityIntensityMetrics",
						payload: {
							isoDate: isoDay,
							range: {
								timeline,
								fixedValues: duration,
							},
						},
					},
				]);
			});
		},
		async setDailyActivitiesMetrics(isoDay: string = moment().toISOString()) {
			const data = await measureApi.fetchLastDailyMeasures<DailyActivitiesMetrics | DailyActivitiesMetricsGoals>(
				[...dailyActivitiesMetrics, ...dailyActivitiesMetricsGoals],
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
				DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics
			>(
				[...dailyEnergyScoreMetrics, ...dailyEnergyScoreMetricsGaugeSize, ...dailyEnergyScoreGaugeCalibrationMetrics],
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
				| DailySleepScoreContributorsMetrics
				| DailySleepScoreContributorsMetricsGaugeSize
				| DailySleepScoreContributorsGaugeCalibrationMetrics
			>(
				[
					...dailySleepScoreContributorsMetrics,
					...dailySleepScoreContributorsMetricsGaugeSize,
					...dailySleepScoreContributorsGaugeCalibrationMetrics,
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
								timeline,
								fixedValues: duration,
							},
						},
					},
				]);
			});
		},
	};
}
