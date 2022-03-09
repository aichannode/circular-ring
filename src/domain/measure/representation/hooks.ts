import { ApiService } from "@core/api/apiService";
import { action } from "mobx";
import moment from "moment";
import { useEffect } from "react";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { getKeyFromDate } from "../common/business";
import { Metrics, MetricType } from "../metric";
import { MeasureModel } from "../model/measureModel";
import { DailyActivityIntensityData, DailySleepData } from "./api";
import { canDisplay, getScoreControlStates } from "./business";
import { createSleepStagesGetter, getActivityPhases, useDailyHeavyComputationData } from "./lib/business";
import {
	DailyActivitiesMetrics,
	DailyActivitiesMetricsGoals,
	DailyEnergyScoreGaugeCalibrationMetrics,
	DailyEnergyScoreMetrics,
	DailyEnergyScoreMetricsGaugeSize,
	DailySleepScoreContributorsGaugeCalibrationMetrics,
	DailySleepScoreContributorsMetrics,
	DailySleepScoreContributorsMetricsGaugeSize,
} from "./lib/type";

export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);
	return {
		actions,
		hooks: {
			useDailyActivityIntensity({
				isoDay = moment().toISOString(),
				setData,
			}: {
				isoDay?: string;
				setData: (data: DailyActivityIntensityData) => void;
			}) {
				const modelField = model.dailyActivityIntensityMetrics;
				const fetchData = () => actions.setDailyActivityIntensityMetrics(isoDay);
				useDailyHeavyComputationData(isoDay, modelField, setData, getActivityPhases, fetchData);
			},
			useDailyActivities(isoDay?: string): Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivitiesMetrics(isoDay);
					}),
					[isoDay]
				);
				return model.dailyActivitiesMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailyEnergyScoreContributors(
				isoDay?: string
			): Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(isoDay);
					}),
					[isoDay]
				);
				return model.dailyEnergyScoreContributorsMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailySleepStages({
				isoDay = moment().toISOString(),
				setData,
			}: {
				isoDay?: string;
				setData: (data: DailySleepData) => void;
			}) {
				const modelField = model.dailySleepMetrics;
				const fetchData = () => actions.setDailySleepStagesMetrics(isoDay);
				useDailyHeavyComputationData(isoDay, modelField, setData, createSleepStagesGetter(isoDay), fetchData);
			},
			useDailySleepScoreContributors(
				isoDay?: string
			): Metrics<
				| DailySleepScoreContributorsMetrics
				| DailySleepScoreContributorsMetricsGaugeSize
				| DailySleepScoreContributorsGaugeCalibrationMetrics
			> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(isoDay);
					}),
					[isoDay]
				);
				return model.dailySleepScoreContributorsMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailyEnergyScore(isoDay: string = moment().toISOString()) {
				useEffect(
					action(function () {
						if (!model.dailyEnergyScore.has(isoDay)) {
							actions.setDailyEnergyScore(isoDay);
						}
					}),
					[isoDay]
				);
				return {
					// Default value accordint to the specs.
					score: model.dailyEnergyScore.get(isoDay) ?? 0,
					controlState: getScoreControlStates({
						score: model.dailyEnergyScore.get(isoDay) ?? 0,
						lowThreshold: 0.8,
						highThreshold: 0.9,
					}),
				};
			},
			useDailySleepQualityScore(isoDay: string = moment().toISOString()) {
				useEffect(
					action(function () {
						if (!model.dailySleepScore.has(isoDay)) {
							actions.setDailySleepScore(isoDay);
						}
					}),
					[isoDay]
				);
				const data = model.dailySleepScore.get(isoDay);
				const score = {
					[MetricType.UserDailySleepScore]: data?.[MetricType.UserDailySleepScore] ?? 0,
					[MetricType.UserDailySleepScoreGoalMin]: data?.[MetricType.UserDailySleepScoreGoalMin] ?? 0.8,
					[MetricType.UserDailySleepScoreGoalMax]: data?.[MetricType.UserDailySleepScoreGoalMax] ?? 0.9,
				};
				return {
					// Default value according to the specs.
					...score,
					controlState: getScoreControlStates({
						lowThreshold: score["user.daily.score.sleep.goal.min"],
						highThreshold: score["user.daily.score.sleep.goal.max"],
						score: score["user.daily.sleep.score"],
					}),
				};
			},
			useCanDisplayData(isoDay: string): boolean {
				useEffect(
					action(function () {
						if (!model.dailySleepMetrics.has(isoDay)) {
							actions.setDailySleepStagesMetrics(isoDay);
						}
					}),
					[isoDay]
				);
				// UsercoreSleepEnd is in Unix time in second
				const userCoreSleepEnd = model.dailySleepMetrics.get(isoDay)?.constant[MetricType.UserCoreSleepEnd] as number;

				// Spec: 00000
				return !!userCoreSleepEnd && canDisplay(isoDay, userCoreSleepEnd * 1000);
			},
			useDailyGlobalScore(isoDay: string = moment().toISOString()): number | undefined {
				useEffect(
					action(function () {
						if (!model.dailyGlobalScore.has(isoDay)) {
							actions.setDailyGlobalScore(isoDay);
						}
					}),
					[isoDay]
				);
				return model.dailyGlobalScore.get(isoDay);
			},
		},
	};
}
