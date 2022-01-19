import moment from "moment";
import { useEffect, useRef } from "react";
import { MetricType } from "../metric";
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

export function createRepresentation(_apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(/* apiService */), model.present);
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
			useDailyMetrics(isoDay?: string): RangeDetails<DailyActivityDetailsMetrics | DailyActivityDetailsMetricsGoals> {
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
				};
			},
			useDailyEnergyScoreDetails(
				isoDay?: string
			): RangeDetails<
				DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics
			> {
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
					[MetricType.UserDailyScoreRecoveryGoalMax]: 0.8,
					[MetricType.UserDailyScoreRecoveryGoalMin]: 0.9,
					[MetricType.UserDailyWakeUpScoreGoalMin]: 0.8,
					[MetricType.UserDailyWakeUpScoreGoalMax]: 0.9,
					[MetricType.UserDailyScoreBRGoalMin]: 0.8,
					[MetricType.UserDailyScoreBRGoalMax]: 0.9,
					[MetricType.UserDailyScoreHRVGoalMin]: 0.8,
					[MetricType.UserDailyScoreHRVGoalMax]: 0.9,
					[MetricType.UserDailyScoreRHRGoalMin]: 0.8,
					[MetricType.UserDailyScoreRHRGoalMax]: 0.9,
					[MetricType.UserDailyScoreVarTemperatureGoalMin]: 0.8,
					[MetricType.UserDailyScoreVarTemperatureGoalMax]: 0.9,
					[MetricType.UserDailySleepScoreGoalMin]: 0.8,
					[MetricType.UserDailySleepScoreGoalMax]: 0.9,
					[MetricType.UserDailyScoreSleepBalanceGoalMin]: 0.8,
					[MetricType.UserDailyScoreSleepBalanceGoalMax]: 0.9,
					[MetricType.UserDailyScoreActivityVolumeGoalMin]: 0.8,
					[MetricType.UserDailyScoreActivityVolumeGoalMax]: 0.9,
				};
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
			useDailySleepDetails(
				isoDay?: string
			): RangeDetails<DailySleepDetailsMetrics | DailySleepDetailsMetricsGaugeSize | DailySleepDetailsGaugeMetrics> {
				// TOTO implement
				return {
					// Those metrics are used to display the gauge label
					[MetricType.UserDailyTranquility]: 0.83,
					[MetricType.UserDailyCircadianRhythm]: 0.89,
					[MetricType.UserDailyAwakeStageDuration]: 45,
					[MetricType.UserDailyPercAwakeStage]: 0.08,
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
					[MetricType.UserDailyCircadianRhythmGoalMin]: 0.8,
					[MetricType.UserDailyCircadianRhythmGoalMax]: 0.9,
					[MetricType.UserDailyPercREMStageScoreGoalMin]: 0.8,
					[MetricType.UserDailyPercREMStageScoreGoalMax]: 0.9,
					[MetricType.UserDailyPercDeepStageScoreGoalMin]: 0.8,
					[MetricType.UserDailyPercDeepStageScoreGoalMax]: 0.9,
					[MetricType.UserDailyPercTimeToFallAsleepGoalMin]: 0.8,
					[MetricType.UserDailyPercTimeToFallAsleepGoalMax]: 0.9,
					[MetricType.UserDailySleepDebtGoalMin]: 0.8,
					[MetricType.UserDailySleepDebtGoalMax]: 0.9,
				};
			},
			useDailyEnergyScore(isoDay?: string): number | undefined {
				// TOTO implement
				return 55;
			},
			useDailySleepQualityScore(isoDay?: string): number | undefined {
				// TOTO implement
				return 47;
			},
			useDailyGlobalScore(isoDay: string = moment().toISOString()): number | undefined {
				console.log(model.dailyGlobalScore.has);
				useEffect(function () {
					if (!model.dailyGlobalScore.has(isoDay)) {
						actions.setDailyGlobalScore(isoDay);
					}
				});
				const score = model.dailyGlobalScore.get(isoDay);
				return score
					? score * 100
					: // : undefined
					  // TODO remove mocked score when back will serve global score monthlty
					  55;
			},
		},
	};
}
