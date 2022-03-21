import { ApiService } from "@core/api/apiService";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { action } from "mobx";
import { useEffect } from "react";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { MetricType } from "../metric";
import { MeasureModel } from "../model/measureModel";
import { ActivityControlState, Contributor, DailyActivityIntensityData, DailyHr, DailySleepData } from "./api";
import { canDisplay, getActivityControlState, getScoreControlStates, parseDailyHR } from "./business";
import { createActivityPhasesGetter, createSleepStagesGetter, useDailyHeavyComputationData } from "./lib/business";
import { Activities, ActivityScoreContributors, SleepScoreContributors } from "./lib/type";
export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);
	return {
		actions,
		hooks: {
			useDailyHR(localISODay = getCurrentLocalISODay()): DailyHr | undefined {
				useEffect(() => {
					__DEV__ && console.log("[MEASURE: Action] FETCH");
					actions.setDailyHRMetrics(localISODay);
				}, [localISODay]);

				return parseDailyHR(model.dailyHRMetrics.get(localISODay));
			},
			useDailyActivityIntensity({
				localISODay = getCurrentLocalISODay(),
				setData,
			}: {
				localISODay?: ISODay;
				setData: (data: DailyActivityIntensityData) => void;
			}) {
				const modelField = model.dailyActivityIntensityMetrics;
				const fetchData = () => actions.setDailyActivityIntensityMetrics(localISODay);
				useDailyHeavyComputationData(
					localISODay,
					modelField,
					setData,
					createActivityPhasesGetter(localISODay),
					fetchData
				);
			},
			useDailyActivities(localISODay?: ISODay): Record<
				Activities,
				{
					value: number;
					score?: number;
					controlState?: ActivityControlState;
				}
			> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivitiesMetrics(localISODay);
					}),
					[localISODay]
				);
				const data = (localISODay && model.dailyActivitiesMetrics.get(localISODay)) ?? {};
				return {
					[MetricType.UserDailySteps]: {
						value: data[MetricType.UserDailySteps] as number,
						controlState: getActivityControlState({
							lowThreshold: data[MetricType.UserDailyStepsGoalMin] as number,
							highThreshold: data[MetricType.UserDailyStepsGoalMax] as number,
							value: data[MetricType.UserDailySteps] as number,
						}),
					},
					[MetricType.UserDailyWalkingEquivalency]: {
						value: (data[MetricType.UserDailyWalkingEquivalency] as number) / 1000,
						controlState: getActivityControlState({
							lowThreshold: data[MetricType.UserDailyWalkingEquivalencyGoalMin] as number,
							highThreshold: data[MetricType.UserDailyWalkingEquivalencyGoalMax] as number,
							value: data[MetricType.UserDailyWalkingEquivalency] as number,
						}),
					},
					[MetricType.UserDailyCaloriesBurned]: {
						value: data[MetricType.UserDailyCaloriesBurned] as number,
						score: data[MetricType.UserDailySteps] as number,
						controlState: getActivityControlState({
							lowThreshold: data[MetricType.UserDailyStepsGoalMin] as number,
							highThreshold: data[MetricType.UserDailyStepsGoalMax] as number,
							value: data[MetricType.UserDailyCaloriesBurned] as number,
						}),
					},
					[MetricType.UserDailyCardioPoints]: {
						value: data[MetricType.UserDailyCardioPointsGoalMin] as number,
						controlState: getActivityControlState({
							lowThreshold: data[MetricType.UserDailyCardioPointsGoalMin] as number,
							value: data[MetricType.UserDailyCardioPointsGoalMin] as number,
						}),
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
			useDailyEnergyScoreContributors(localISODay?: ISODay): Record<ActivityScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(localISODay);
					}),
					[localISODay]
				);
				const data = (localISODay && model.dailyEnergyScoreContributorsMetrics.get(localISODay)) ?? {};
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
						thresholdLow: (data[MetricType.UserDailyScoreBRGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyScoreBRGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyScoreBR] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreBRGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreBRGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreBR] as number,
						}),
					},
					[MetricType.UserDailyScoreSPO2]: {
						value: data[MetricType.UserDailyAsleepSPO2] as number,
						thresholdLow: (data[MetricType.UserDailyScoreBRGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyScoreBRGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyScoreBR] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreBRGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreBRGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreBR] as number,
						}),
					},
					[MetricType.UserDailyScoreHRV]: {
						value: data[MetricType.UserDailyAsleepHRV] as number,
						thresholdLow: (data[MetricType.UserDailyScoreHRVGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyScoreHRVGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyScoreHRV] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreHRVGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreHRVGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreHRV] as number,
						}),
					},
					[MetricType.UserDailyScoreRHR]: {
						value: data[MetricType.UserDailyRHR] as number,
						thresholdLow: (data[MetricType.UserDailyScoreRHRGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyScoreRHRGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyScoreRHR] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreRHRGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreRHRGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreRHR] as number,
						}),
					},
					[MetricType.UserDailyScoreVarTemperature]: {
						value: data[MetricType.UserDailySleepVarTemperature] as number,
						thresholdLow: (data[MetricType.UserDailyScoreVarTemperatureGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyScoreVarTemperatureGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyScoreVarTemperature] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreVarTemperatureGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreVarTemperatureGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreVarTemperature] as number,
						}),
					},
					[MetricType.UserDailySleepScore]: {
						value: data[MetricType.User2DaysSleepScore] as number,
						thresholdLow: (data[MetricType.UserDailySleepScoreGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailySleepScoreGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailySleepScore] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailySleepScoreGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailySleepScoreGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailySleepScore] as number,
						}),
					},
					[MetricType.UserDailySleepBalance]: {
						value: data[MetricType.UserDailySleepBalance] as number,
						thresholdLow: (data[MetricType.UserDailySleepBalanceGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailySleepBalanceGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailySleepBalance] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailySleepBalanceGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailySleepBalanceGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailySleepBalance] as number,
						}),
					},
					[MetricType.UserDailyActivityVolume]: {
						value: data[MetricType.UserDailyActivityVolume] as number,
						thresholdLow: (data[MetricType.UserDailyActivityVolumeGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyActivityVolumeGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyActivityVolume] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyActivityVolumeGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyActivityVolumeGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyActivityVolume] as number,
						}),
					},
				};
			},
			useDailySleepStages({
				localISODay = getCurrentLocalISODay(),
				setData,
			}: {
				localISODay?: ISODay;
				setData: (data: DailySleepData) => void;
			}) {
				const modelField = model.dailySleepMetrics;
				const fetchData = () => actions.setDailySleepStagesMetrics(localISODay);
				useDailyHeavyComputationData(localISODay, modelField, setData, createSleepStagesGetter(localISODay), fetchData);
			},
			/**
			 * Return sleep score contributors
			 * @implements 00006, 00007, 00008, 00009, 00010, 00011, 00012, 00022
			 */
			useDailySleepScoreContributors(localISODay?: ISODay): Record<SleepScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(localISODay);
					}),
					[localISODay]
				);
				const data = (localISODay && model.dailySleepScoreContributorsMetrics.get(localISODay)) ?? {};
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
						thresholdLow: (data[MetricType.UserDailyCorePercTimeToFallAsleepGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailyCorePercTimeToFallAsleepGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailyCorePercTimeToFallAsleep] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyCorePercTimeToFallAsleepGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyCorePercTimeToFallAsleepGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyCorePercTimeToFallAsleep] as number,
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
							score: data[MetricType.UserDailyCorePercTimeToFallAsleep] as number,
						}),
					},
				};
			},
			useDailyEnergyScore(localISODay: ISODay = getCurrentLocalISODay()) {
				useEffect(
					action(function () {
						if (!model.dailyEnergyScore.has(localISODay)) {
							actions.setDailyEnergyScore(localISODay);
						}
					}),
					[localISODay]
				);
				return {
					// Default value accordint to the specs.
					score: model.dailyEnergyScore.get(localISODay) ?? 0,
					controlState: getScoreControlStates({
						score: model.dailyEnergyScore.get(localISODay) ?? 0,
						lowThreshold: 0.8,
						highThreshold: 0.9,
					}),
				};
			},
			useDailySleepQualityScore(localISODay: ISODay = getCurrentLocalISODay()) {
				useEffect(
					action(function () {
						if (!model.dailySleepScore.has(localISODay)) {
							actions.setDailySleepScore(localISODay);
						}
					}),
					[localISODay]
				);
				const data = model.dailySleepScore.get(localISODay);
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
			useDailyWakeUpScore(localISODay: ISODay = getCurrentLocalISODay()) {
				useEffect(
					action(function () {
						if (!model.dailyWakeUpScore.has(localISODay)) {
							actions.setDailyWakeUpScore(localISODay);
						}
					}),
					[localISODay]
				);
				const data = model.dailyWakeUpScore.get(localISODay);
				const score = data?.[MetricType.UserDailyWakeUpScore];
				return score !== undefined
					? {
							score,
							controlState: getScoreControlStates({
								lowThreshold: data?.[MetricType.UserDailyWakeUpScoreGoalMin] ?? 0.8,
								highThreshold: data?.[MetricType.UserDailyWakeUpScoreGoalMax] ?? 0.9,
								score,
							}),
					  }
					: undefined;
			},
			useCanDisplayData(localISODay: ISODay): boolean {
				useEffect(
					action(function () {
						// Warning: date in model are in UTC, you need to convert them in local
						if (!model.dailySleepMetrics.has(localISODay)) {
							actions.setDailySleepStagesMetrics(localISODay);
						}
					}),
					[localISODay]
				);
				// UsercoreSleepEnd is in Unix time in second
				const userCoreSleepEnd = model.dailySleepMetrics.get(localISODay)?.constant[
					MetricType.UserCoreSleepEnd
				] as number;

				// Spec: 00000
				return !!userCoreSleepEnd && canDisplay(localISODay, userCoreSleepEnd * 1000);
			},
			useDailyGlobalScore(localISODay: ISODay = getCurrentLocalISODay()): number | undefined {
				useEffect(
					action(function () {
						if (!model.dailyGlobalScore.has(localISODay)) {
							actions.setDailyGlobalScore(localISODay);
						}
					}),
					[localISODay]
				);
				return model.dailyGlobalScore.get(localISODay);
			},
		},
	};
}
