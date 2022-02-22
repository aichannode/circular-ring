import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { useEffect } from "react";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { getKeyFromDate } from "../common/business";
import { Metrics } from "../metric";
import { MeasureModel } from "../model/measureModel";
import { DailyActivityIntensityData, DailySleepData } from "./api";
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
					function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivitiesMetrics(isoDay);
					},
					[isoDay]
				);
				return model.dailyActivitiesMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailyEnergyScoreContributors(
				isoDay?: string
			): Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics> {
				useEffect(
					function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(isoDay);
					},
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
					function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(isoDay);
					},
					[isoDay]
				);
				return model.dailySleepScoreContributorsMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailyEnergyScore(isoDay: string = moment().toISOString()): number | undefined {
				useEffect(function () {
					if (!model.dailyEnergyScore.has(isoDay)) {
						actions.setDailyEnergyScore(isoDay);
					}
				});
				return model.dailySleepScore.get(isoDay);
			},
			useDailySleepQualityScore(isoDay: string = moment().toISOString()): number | undefined {
				useEffect(function () {
					if (!model.dailySleepScore.has(isoDay)) {
						actions.setDailySleepScore(isoDay);
					}
				});
				return model.dailySleepScore.get(isoDay);
			},
			useDailyGlobalScore(isoDay: string = moment().toISOString()): number | undefined {
				useEffect(function () {
					if (!model.dailyGlobalScore.has(isoDay)) {
						actions.setDailyGlobalScore(isoDay);
					}
				});
				return model.dailyGlobalScore.get(isoDay);
			},
		},
	};
}
