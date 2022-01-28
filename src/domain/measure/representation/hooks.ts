import moment from "moment";
import { useEffect, useRef } from "react";
import { Metrics } from "../metric";
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
import { getActivityPhases, getSleepStages } from "./lib/business";
import { InteractionManager } from "react-native";
import { reaction } from "mobx";
import { useOnComponentWillMount } from "@ui/utils/lifecycleHooks";
import { DailyActivityIntensityData, DailySleepData } from "./api";
import { getKeyFromDate } from "../common/business";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { ApiService } from "@core/api/apiService";
import { MeasureModel } from "../model/measureModel";

type HeavyComputationHandler = ReturnType<typeof InteractionManager.runAfterInteractions>;

export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);
	return {
		actions,
		hooks: {
			useDailyActivityIntensity({
				isoDay,
				setData,
			}: {
				isoDay?: string;
				setData: (metrics: DailyActivityIntensityData) => void;
			}) {
				const heavyComputationHandler = useRef<HeavyComputationHandler>();

				useEffect(
					function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivityIntensityMetrics(isoDay);
					},
					[isoDay]
				);

				useOnComponentWillMount(function () {
					reaction(
						// If this changes
						() => model.dailyActivityIntensityMetrics.get(getKeyFromDate(isoDay)),
						// Launch heavy computation
						function (metrics) {
							if (metrics) {
								heavyComputationHandler.current?.cancel();
								heavyComputationHandler.current = InteractionManager.runAfterInteractions(() => {
									__DEV__ && console.log("[MEASURE: Representation] Start of daily activity data computation.");
									setData(getActivityPhases(metrics));
								});
								heavyComputationHandler.current.then(
									() => __DEV__ && console.log("[MEASURE: Representation] End of daily activity data computation.")
								);
							}
						}
					);
				});
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
				setData: (metrics: DailySleepData) => void;
			}) {
				const heavyComputationHandler = useRef<HeavyComputationHandler>();

				useEffect(
					function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepStagesMetrics(isoDay);
					},
					[isoDay]
				);

				useOnComponentWillMount(function () {
					reaction(
						// If this changes
						() => model.dailySleepMetrics.get(getKeyFromDate(isoDay)),
						// Launch heavy computation
						function (metrics) {
							if (metrics) {
								heavyComputationHandler.current?.cancel();
								heavyComputationHandler.current = InteractionManager.runAfterInteractions(() => {
									__DEV__ && console.log("[MEASURE: Representation] Start of daily activity data computation.");
									setData(getSleepStages(metrics, isoDay));
								});
								heavyComputationHandler.current.then(
									() => __DEV__ && console.log("[MEASURE: Representation] End of daily activity data computation.")
								);
							}
						}
					);
				});
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
				console.log(model.dailyGlobalScore.has);
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
