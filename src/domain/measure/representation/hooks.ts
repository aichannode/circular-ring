import { ApiService } from "@core/api/apiService";
import { action } from "mobx";
import moment from "moment";
import { useEffect } from "react";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { getKeyFromDate } from "../common/business";
import { MetricType } from "../metric";
import { MeasureModel } from "../model/measureModel";
import { Contributor, DailyActivityIntensityData, DailySleepData } from "./api";
import { canDisplay, getScoreControlStates } from "./business";
import { createActivityPhasesGetter, createSleepStagesGetter, useDailyHeavyComputationData } from "./lib/business";
import { Activities, ActivityScoreContributors, SleepScoreContributors } from "./lib/type";

export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);
	return {
		actions,
		hooks: {
			useDailyHR(isoDay = moment().toISOString()) {
				useEffect(() => {
					__DEV__ && console.log("[MEASURE: Action] FETCH");
					actions.setDailyHRMetrics(isoDay);
				}, [isoDay]);
				return model.dailyHRMetrics.get(getKeyFromDate(isoDay)) ?? {};
			},
			useDailyActivityIntensity({
				isoDay = moment().toISOString(),
				setData,
			}: {
				isoDay?: string;
				setData: (data: DailyActivityIntensityData) => void;
			}) {
				const modelField = model.dailyActivityIntensityMetrics;
				const fetchData = () => actions.setDailyActivityIntensityMetrics(isoDay);
				useDailyHeavyComputationData(isoDay, modelField, setData, createActivityPhasesGetter(isoDay), fetchData);
			},
			useDailyActivities(isoDay?: string): Record<
				Activities,
				{
					value: number;
					thresholdLow?: number;
					thresholdHigh?: number;
				}
			> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivitiesMetrics(isoDay);
					}),
					[isoDay]
				);
				const data = model.dailyActivitiesMetrics.get(getKeyFromDate(isoDay)) ?? {};
				return {
					[MetricType.UserDailySteps]: {
						value: data[MetricType.UserDailySteps] as number,
						thresholdLow: data[MetricType.UserDailyStepsGoalMin] as number,
					},
					[MetricType.UserDailyWalkingEquivalency]: {
						value: (data[MetricType.UserDailyWalkingEquivalency] as number) / 1000,
						thresholdLow: data[MetricType.UserDailyWalkingEquivalencyGoalMin] as number,
					},
					[MetricType.UserDailyCaloriesBurned]: {
						value: data[MetricType.UserDailyCaloriesBurned] as number,
						thresholdLow: data[MetricType.UserDailyCaloriesBurnedGoalMin] as number,
					},
					[MetricType.UserDailyCardioPoints]: {
						value: data[MetricType.UserDailyCardioPointsGoalMin] as number,
						thresholdLow: data[MetricType.UserDailyCardioPointsGoalMin] as number,
					},
					[MetricType.UserDailyVO2Max]: {
						value: data[MetricType.UserDailyVO2Max] as number,
					},
					[MetricType.UserDailyAwakeHRMax]: {
						value: data[MetricType.UserDailyAwakeHRMax] as number,
					},
				};
			},
			/**
			 * Return sleep score contributors
			 * @implements 00013, 00014, 00015, 00016, 00017, 00018, 00019, 00020, 00021, 00022
			 */
			useDailyEnergyScoreContributors(isoDay?: string): Record<ActivityScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(isoDay);
					}),
					[isoDay]
				);
				const data = model.dailyEnergyScoreContributorsMetrics.get(getKeyFromDate(isoDay)) ?? {};
				return {
					[MetricType.UserDailyBodyRecovery]: {
						value: data[MetricType.UserDailyBodyRecovery] as number,
						thresholdLow: (data[MetricType.UserDailyBodyRecoveryGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyBodyRecoveryGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyBodyRecovery] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyBodyRecoveryGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyBodyRecoveryGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyBodyRecovery] as number,
						}),
					},
					[MetricType.UserDailyWakeUpScore]: {
						value: data[MetricType.UserDailyWakeUpScore] as number,
						thresholdLow: (data[MetricType.UserDailyWakeUpScoreGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyWakeUpScoreGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyWakeUpScore] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyWakeUpScoreGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyWakeUpScoreGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyWakeUpScore] as number,
						}),
					},
					[MetricType.UserDailyScoreBR]: {
						value: data[MetricType.UserDailyAsleepBR] as number,
						thresholdLow: data[MetricType.UserDailyScoreBRGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyScoreBRGoalMax] as number,
						percent: data[MetricType.UserDailyScoreBR] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyScoreBRGoalMin] as number,
							highThreshold: data[MetricType.UserDailyScoreBRGoalMax] as number,
							score: data[MetricType.UserDailyScoreBR] as number,
						}),
					},
					[MetricType.UserDailyScoreSPO2]: {
						value: data[MetricType.UserDailyAsleepSPO2] as number,
						thresholdLow: data[MetricType.UserDailyScoreBRGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyScoreBRGoalMax] as number,
						percent: data[MetricType.UserDailyScoreBR] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyScoreBRGoalMin] as number,
							highThreshold: data[MetricType.UserDailyScoreBRGoalMax] as number,
							score: data[MetricType.UserDailyScoreBR] as number,
						}),
					},
					[MetricType.UserDailyScoreHRV]: {
						value: data[MetricType.UserDailyAsleepHRV] as number,
						thresholdLow: data[MetricType.UserDailyScoreHRVGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyScoreHRVGoalMax] as number,
						percent: data[MetricType.UserDailyScoreHRV] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyScoreHRVGoalMin] as number,
							highThreshold: data[MetricType.UserDailyScoreHRVGoalMax] as number,
							score: data[MetricType.UserDailyScoreHRV] as number,
						}),
					},
					[MetricType.UserDailyScoreRHR]: {
						value: data[MetricType.UserDailyRHR] as number,
						thresholdLow: data[MetricType.UserDailyScoreRHRGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyScoreRHRGoalMax] as number,
						percent: data[MetricType.UserDailyScoreRHR] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyScoreRHRGoalMin] as number,
							highThreshold: data[MetricType.UserDailyScoreRHRGoalMax] as number,
							score: data[MetricType.UserDailyScoreRHR] as number,
						}),
					},
					[MetricType.UserDailyScoreVarTemperature]: {
						value: data[MetricType.UserDailySleepVarTemperature] as number,
						thresholdLow: data[MetricType.UserDailyScoreVarTemperatureGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyScoreVarTemperatureGoalMax] as number,
						percent: data[MetricType.UserDailyScoreVarTemperature] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyScoreVarTemperatureGoalMin] as number,
							highThreshold: data[MetricType.UserDailyScoreVarTemperatureGoalMax] as number,
							score: data[MetricType.UserDailyScoreVarTemperature] as number,
						}),
					},
					[MetricType.UserDailySleepScore]: {
						value: data[MetricType.User2DaysSleepScore] as number,
						thresholdLow: data[MetricType.UserDailySleepScoreGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailySleepScoreGoalMax] as number,
						percent: data[MetricType.UserDailySleepScore] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailySleepScoreGoalMin] as number,
							highThreshold: data[MetricType.UserDailySleepScoreGoalMax] as number,
							score: data[MetricType.UserDailySleepScore] as number,
						}),
					},
					[MetricType.UserDailySleepBalance]: {
						value: data[MetricType.UserDailySleepBalance] as number,
						thresholdLow: data[MetricType.UserDailySleepBalanceGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailySleepBalanceGoalMax] as number,
						percent: data[MetricType.UserDailyScoreSleepBalance] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailySleepBalanceGoalMin] as number,
							highThreshold: data[MetricType.UserDailySleepBalanceGoalMax] as number,
							score: data[MetricType.UserDailySleepBalance] as number,
						}),
					},
					[MetricType.UserDailyActivityVolume]: {
						value: data[MetricType.UserDailyActivityVolume] as number,
						thresholdLow: data[MetricType.UserDailyActivityVolumeGoalMin] as number,
						thresholdHigh: data[MetricType.UserDailyActivityVolumeGoalMax] as number,
						percent: data[MetricType.UserDailyActivityVolume] as number,
						controlState: getScoreControlStates({
							lowThreshold: data[MetricType.UserDailyActivityVolumeGoalMin] as number,
							highThreshold: data[MetricType.UserDailyActivityVolumeGoalMax] as number,
							score: data[MetricType.UserDailyActivityVolume] as number,
						}),
					},
				};
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
			/**
			 * Return sleep score contributors
			 * @implements 00006, 00007, 00008, 00009, 00010, 00011, 00012, 00022
			 */
			useDailySleepScoreContributors(isoDay?: string): Record<SleepScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(isoDay);
					}),
					[isoDay]
				);
				const data = model.dailySleepScoreContributorsMetrics.get(getKeyFromDate(isoDay)) ?? {};
				return {
					[MetricType.UserDailyAwakeStageDuration]: {
						value: data[MetricType.UserDailyAwakeStageDuration] as number,
						thresholdLow: 0.1,
						thresholdHigh: 0.2,
						percent: 1 - ((data[MetricType.UserDailyPercAwakeStage] as number) ?? 1),
						controlState: getScoreControlStates({
							lowThreshold: 0.1,
							highThreshold: 0.2,
							score: data[MetricType.UserDailyPercAwakeStage] as number,
							isInverted: true,
						}),
					},
					[MetricType.UserDailyRealSleepDuration]: {
						value: data[MetricType.UserDailyRealSleepDuration] as number,
						thresholdLow: 0.8,
						thresholdHigh: 0.9,
						percent: data[MetricType.UserDailyPercRealSleep] as number,
						controlState: getScoreControlStates({
							lowThreshold: 0.8,
							highThreshold: 0.9,
							score: data[MetricType.UserDailyPercRealSleep] as number,
						}),
					},
					[MetricType.UserDailyTranquility]: {
						value: data[MetricType.UserDailyTranquility] as number,
						thresholdLow: (data[MetricType.UserDailyTranquilityGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyTranquilityGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyTranquility] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyTranquilityGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyTranquilityGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyTranquility] as number,
						}),
					},
					[MetricType.UserDailyCircadianRhythm]: {
						value: data[MetricType.UserDailyCircadianRhythm] as number,
						thresholdLow: (data[MetricType.UserDailyCircadianRhythmGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyCircadianRhythmGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyCircadianRhythm] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyCircadianRhythmGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyCircadianRhythmGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyCircadianRhythm] as number,
						}),
					},
					[MetricType.UserDailyPercREMStageScore]: {
						value: data[MetricType.UserDailyPercREMStageScore] as number,
						thresholdLow: (data[MetricType.UserDailyPercREMStageScoreGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyPercREMStageScoreGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyPercREMStageScore] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyPercREMStageScoreGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyPercREMStageScoreGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyPercREMStageScore] as number,
						}),
					},
					[MetricType.UserDailyPercDeepStage]: {
						value: data[MetricType.UserDailyPercDeepStage] as number,
						thresholdLow: (data[MetricType.UserDailyPercDeepStageScoreGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyPercDeepStageScoreGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyPercDeepStage] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyPercDeepStageScoreGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyPercDeepStageScoreGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyPercDeepStage] as number,
						}),
					},
					[MetricType.UserDailyCoreTimeToFallAsleep]: {
						value: data[MetricType.UserDailyCoreTimeToFallAsleep] as number,
						thresholdLow: (data[MetricType.UserDailyPercTimeToFallAsleepGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyPercTimeToFallAsleepGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyPercTimeToFallAsleep] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyPercTimeToFallAsleepGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyPercTimeToFallAsleepGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyPercTimeToFallAsleep] as number,
						}),
					},
					[MetricType.UserDailySleepDebt]: {
						value: data[MetricType.UserDailySleepDebt] as number,
						thresholdLow: (data[MetricType.UserDailyPercSleepDebtGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyPercSleepDebtGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyPercSleepDebt] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyPercSleepDebtGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyPercSleepDebtGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyPercTimeToFallAsleep] as number,
						}),
					},
				};
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
						lowThreshold: score[MetricType.UserDailySleepScoreGoalMin],
						highThreshold: score[MetricType.UserDailySleepScoreGoalMax],
						score: score[MetricType.UserDailySleepScore],
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
