import { ApiService } from "@core/api/apiService";
import {
	getCurrentLocalISODay,
	getLast7Days,
	getMonthsBetween,
	isDefined,
	isToday,
	toISOMonth,
} from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
import { action } from "mobx";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { createActions } from "../actions";
import { MeasureApi } from "../actions/lib/measureApi";
import { MetricType } from "../metric";
import { MeasureModel } from "../model/measureModel";
import {
	Activity7D,
	ActivityControlState,
	Cardio7D,
	Contributor,
	DailyActivityIntensityData,
	DailyHr,
	DailySleepData,
	DailySpo2,
	DataControlState,
	Scores7D,
	Sleep7D,
	SleepAll,
} from "./api";
import { canDisplay, getActivityControlState, getScoreControlStates, parseDailyHR, parseDailySpo2 } from "./business";
import { createActivityPhasesGetter, createSleepStagesGetter, useDailyHeavyComputationData } from "./lib/business";
import { Activities, ActivityScoreContributors, SleepScoreContributors } from "./lib/type";

export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);

	function hasEnoughData(localISODay: ISODay): boolean {
		// UsercoreSleepEnd is in Unix time in second
		const userCoreSleepEnd = model.dailySleepMetrics.get(localISODay)?.constant[MetricType.UserCoreSleepEnd] as number;

		// Spec: 00000
		return !!userCoreSleepEnd && canDisplay(localISODay, userCoreSleepEnd * 1000);
	}

	function shouldForceRefresh(localISODay: ISODay) {
		return isToday(localISODay, new Date().toISOString()) || !hasEnoughData(localISODay);
	}

	return {
		actions,
		hooks: {
			use7DaysSleep(localISODay: ISODay = getCurrentLocalISODay()): Sleep7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily sleep stages metrics
						last7Days
							.filter((d) => !model.dailySleepMetrics.has(d))
							.forEach((d) => actions.setDailySleepStagesMetrics(d, true));
						// and the constants for the last 7 days
						actions.pullLast7DSleepMetrics(localISODay);
					}),
					[localISODay]
				);

				const last7DSleepMetrics = model.last7DSleepMetrics.get(localISODay) || {};
				const constant = {
					awakeDuration: last7DSleepMetrics[MetricType.User7DaysAwakeStageDuration],
					awakePerc: last7DSleepMetrics[MetricType.User7DaysPercawakeStage],
					lightDuration: last7DSleepMetrics[MetricType.User7DaysLightStageDuration],
					lightPerc: last7DSleepMetrics[MetricType.User7DaysPerclightStage],
					deepDuration: last7DSleepMetrics[MetricType.User7DaysDeepStageDuration],
					deepPerc: last7DSleepMetrics[MetricType.User7DaysPercdeepStage],
					REMDuration: last7DSleepMetrics[MetricType.User7DaysRemStageDuration],
					REMPerc: last7DSleepMetrics[MetricType.User7DaysPercremStage],
				} as Sleep7D["constant"];

				const sleepStages = last7Days.map((date) => {
					const localMetrics = model.dailySleepMetrics.get(date)?.constant ?? {};
					return {
						awake: isDefined(localMetrics[MetricType.UserDailyAwakeStageDuration])
							? moment.duration(localMetrics[MetricType.UserDailyAwakeStageDuration]).asHours()
							: undefined,
						light: isDefined(localMetrics[MetricType.UserDailyLightStageDuration])
							? moment.duration(localMetrics[MetricType.UserDailyLightStageDuration]).asHours()
							: undefined,
						deep: isDefined(localMetrics[MetricType.UserDailyDeepStageDuration])
							? moment.duration(localMetrics[MetricType.UserDailyDeepStageDuration]).asHours()
							: undefined,
						REM: isDefined(localMetrics[MetricType.UserDailyREMStageDuration])
							? moment.duration(localMetrics[MetricType.UserDailyREMStageDuration]).asHours()
							: undefined,
						date,
					};
				}) as unknown as Sleep7D["sleepStages"];

				const isLoaded =
					model.last7DSleepMetrics.has(localISODay) && last7Days.every((date) => model.dailySleepMetrics.has(date));

				const controlState = sleepStages.some((stage) => isDefined(stage?.light))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				return isLoaded ? { sleepStages, constant, controlState } : undefined;
			},
			useAllMonthsSleep(
				beginISOMonth: ISOMonth,
				endISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay())
			): SleepAll | undefined {
				// Compute the 7 previous date from the given date
				const months = useMemo(() => getMonthsBetween(beginISOMonth, endISOMonth), [beginISOMonth, endISOMonth]);

				useEffect(
					action(function () {
						// Get the last 7 daily sleep stages metrics
						months
							.filter((d) => !model.monthlySleepStageMetrics.has(d))
							.forEach((d) => actions.pullMonthlySleepStageMetrics(d, true));
						// and the constants for the last 7 days
						actions.pullLastAllSleepConstantMetrics(endISOMonth);
					}),
					[months]
				);

				const lastAllSleepMetrics = model.lastAllSleepStageMetrics.get(endISOMonth) || {};
				const constant = {
					awakeDuration: lastAllSleepMetrics[MetricType.UserLifetimeAwakeTimeDuration],
					awakePerc: lastAllSleepMetrics[MetricType.UserLifetimeAwakeTimePercent],
					lightDuration: lastAllSleepMetrics[MetricType.UserLifetimeLightStageDuration],
					lightPerc: lastAllSleepMetrics[MetricType.UserLifetimeLightStagePercent],
					deepDuration: lastAllSleepMetrics[MetricType.UserLifetimeDeepStageDuration],
					deepPerc: lastAllSleepMetrics[MetricType.UserLifetimeDeepStagePercent],
					REMDuration: lastAllSleepMetrics[MetricType.UserLifetimeREMStageDuration],
					REMPerc: lastAllSleepMetrics[MetricType.UserLifetimeREMStagePercent],
				} as SleepAll["constant"];

				const sleepStages = months.map((date) => {
					const localMetrics = model.monthlySleepStageMetrics.get(date) ?? {};
					return {
						awake: isDefined(localMetrics[MetricType.UserMonthlyAwakeStageDuration])
							? moment.duration(localMetrics[MetricType.UserMonthlyAwakeStageDuration]).asHours()
							: undefined,
						light: isDefined(localMetrics[MetricType.UserMonthlyLightStageDuration])
							? moment.duration(localMetrics[MetricType.UserMonthlyLightStageDuration]).asHours()
							: undefined,
						deep: isDefined(localMetrics[MetricType.UserMonthlyDeepStageDuration])
							? moment.duration(localMetrics[MetricType.UserMonthlyDeepStageDuration]).asHours()
							: undefined,
						REM: isDefined(localMetrics[MetricType.UserMonthlyRemStageDuration])
							? moment.duration(localMetrics[MetricType.UserMonthlyRemStageDuration]).asHours()
							: undefined,
						date,
					};
				}) as unknown as SleepAll["sleepStages"];

				const isLoaded =
					model.lastAllSleepStageMetrics.has(endISOMonth) &&
					months.every((date) => model.monthlySleepStageMetrics.has(date));

				const controlState = sleepStages.some((stage) => isDefined(stage?.light))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				return isLoaded ? { sleepStages, constant, controlState } : undefined;
			},
			use7DaysActivity(localISODay = getCurrentLocalISODay()): Activity7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily acitivity intensity metrics
						last7Days
							.filter((d) => !model.dailyActivityIntensityMetrics.has(d))
							.forEach((d) => actions.pullDailyActivityIntensityMetrics(d, true));
						// and the constants for the last 7 days
						actions.pullLast7DActivityIntensityMetrics(localISODay);
					}),
					[localISODay]
				);

				const last7DActivityIntensityAverageMetrics =
					model.last7DActivityIntensityAverageMetrics.get(localISODay) || {};
				const constant = {
					highDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageHighIntensityDuration],
					mediumDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageMediumIntensityDuration],
					lowDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageLowIntensityDuration],
				} as Activity7D["constant"];

				const activityMetrics = last7Days.map((date) => {
					const localMetrics = model.dailyActivityIntensityMetrics.get(date)?.constant ?? {};
					return {
						high: isDefined(localMetrics[MetricType.UserDailyHighActivityIntensityDuration])
							? moment.duration(localMetrics[MetricType.UserDailyHighActivityIntensityDuration]).asHours()
							: undefined,
						medium: isDefined(localMetrics[MetricType.UserDailyMediumActivityIntensityDuration])
							? moment.duration(localMetrics[MetricType.UserDailyMediumActivityIntensityDuration]).asHours()
							: undefined,
						low: isDefined(localMetrics[MetricType.UserDailyLowActivityIntensityDuration])
							? moment.duration(localMetrics[MetricType.UserDailyLowActivityIntensityDuration]).asHours()
							: undefined,
						date,
					};
				}) as unknown as Activity7D["activityMetrics"];

				const isLoaded =
					model.last7DActivityIntensityAverageMetrics.has(localISODay) &&
					last7Days.every((date) => model.dailyActivityIntensityMetrics.has(date));

				const controlState = activityMetrics.some((metric) => isDefined(metric?.low))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				return isLoaded ? { activityMetrics, constant, controlState } : undefined;
			},
			useDailyHR(localISODay = getCurrentLocalISODay()): DailyHr | undefined {
				useEffect(() => {
					__DEV__ && console.log("[MEASURE: Action] FETCH");
					actions.setDailyHRMetrics(localISODay, shouldForceRefresh(localISODay));
				}, [localISODay]);

				return parseDailyHR(model.dailyHRMetrics.get(localISODay));
			},
			useDailySpo2(localISODay = getCurrentLocalISODay()): DailySpo2 | undefined {
				useEffect(() => {
					if (!model.dailySpo2Metrics.has(localISODay)) {
						actions.pullDailySpo2Metrics(localISODay, true);
					}
				}, [localISODay]);

				const data = model.dailySleepMetrics.get(localISODay) ?? undefined;

				return parseDailySpo2(model.dailySpo2Metrics.get(localISODay), data);
			},

			useDailyActivityIntensity({
				localISODay = getCurrentLocalISODay(),
				setData,
			}: {
				localISODay?: ISODay;
				setData: (data: DailyActivityIntensityData) => void;
			}) {
				const modelField = model.dailyActivityIntensityMetrics;
				const fetchData = () => {
					actions.pullDailyActivityIntensityMetrics(
						localISODay,
						!model.dailyActivityIntensityMetrics.has(localISODay) || shouldForceRefresh(localISODay)
					);
				};
				useDailyHeavyComputationData(
					localISODay,
					modelField,
					setData,
					createActivityPhasesGetter(localISODay),
					fetchData
				);
			},
			useDailyActivities(localISODay: ISODay): Record<
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
						actions.setDailyActivitiesMetrics(localISODay, shouldForceRefresh(localISODay));
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
						value: data[MetricType.UserDailyCardioPoints] as number,
						controlState: getActivityControlState({
							lowThreshold: data[MetricType.UserDailyCardioPointsGoalMin] as number,
							highThreshold: data[MetricType.UserDailyCardioPointsGoalMax] as number,
							value: data[MetricType.UserDailyCardioPoints] as number,
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
			useDailyEnergyScoreContributors(localISODay: ISODay): Record<ActivityScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(localISODay, shouldForceRefresh(localISODay));
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
						percent: data[MetricType.UserDailyScoreSPO2] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailyScoreBRGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailyScoreBRGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailyScoreSPO2] as number,
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
					[MetricType.UserDailySleepScoreVarTemperature]: {
						value: data[MetricType.UserDailySleepVarTemperature] as number,
						thresholdLow: (data[MetricType.UserDailySleepScoreVarTemperatureGoalMin] as number) ?? 0.8,
						thresholdHigh: (data[MetricType.UserDailySleepScoreVarTemperatureGoalMax] as number) ?? 0.9,
						percent: data[MetricType.UserDailySleepScoreVarTemperature] as number,
						controlState: getScoreControlStates({
							lowThreshold: (data[MetricType.UserDailySleepScoreVarTemperatureGoalMin] as number) ?? 0.8,
							highThreshold: (data[MetricType.UserDailySleepScoreVarTemperatureGoalMax] as number) ?? 0.9,
							score: data[MetricType.UserDailySleepScoreVarTemperature] as number,
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
				const fetchData = () => actions.setDailySleepStagesMetrics(localISODay, shouldForceRefresh(localISODay));
				useDailyHeavyComputationData(localISODay, modelField, setData, createSleepStagesGetter(localISODay), fetchData);
			},
			/**
			 * Return sleep score contributors
			 * @implements 00006, 00007, 00008, 00009, 00010, 00011, 00012, 00022
			 */
			useDailySleepScoreContributors(localISODay: ISODay): Record<SleepScoreContributors, Contributor> {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(localISODay, shouldForceRefresh(localISODay));
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
						value: data[MetricType.UserDailyPercREMStage] as number,
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
						percent: data[MetricType.UserDailyPercDeepStageScore] as number,
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
							actions.setDailyEnergyScore(localISODay, shouldForceRefresh(localISODay));
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
			/**
			 * @implements spec 00026
			 */
			useLast7DaysEnergyScore(localISODay: ISODay = getCurrentLocalISODay()): Scores7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);
				useEffect(
					function () {
						// Get the last 7 daily energy scores
						last7Days
							.filter((d) => !model.dailyEnergyScore.has(d))
							.forEach((d) => actions.setDailyEnergyScore(d, true));
						// and the average for the last 7 days
						actions.setLast7DEnergyScore(localISODay, shouldForceRefresh(localISODay));
					},
					[localISODay]
				);

				const series = last7Days.map((date) => ({
					value: model.dailyEnergyScore.get(date),
					date,
				})) as Scores7D["series"];

				// Spec 00026: IS_READY if has some historical data
				const isReady = series.some(isDefined);
				const controlState = true ? DataControlState.READY : DataControlState.NO_DATA;
				return isReady
					? {
							series,
							constant: {
								average: model.last7DEnergyScore.get(localISODay) ?? 0,
							},
							controlState,
					  }
					: undefined;
			},
			useLast7DaysCardioPoints(localISODay: ISODay = getCurrentLocalISODay()): Cardio7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					function () {
						// Get the last 7 daily energy scores
						last7Days
							.filter((d) => !model.dailyCardioPoints.has(d))
							.forEach((d) => actions.pullDailyCardioPoints(d, true));
						// and the average for the last 7 days
						if (!model.last7DCardioPointConstants.has(localISODay)) {
							actions.pullLast7DCardioPoints(localISODay, true);
						}
					},
					[localISODay]
				);
				const isLoaded = last7Days.some((date) => model.dailyCardioPoints.has(date));

				if (!isLoaded) {
					return undefined;
				}

				// Spec 00026: IS_READY if has some historical data
				const controlState = last7Days.some((date) => isDefined(model.dailyCardioPoints.get(date)))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				const series = last7Days.map((date) => ({
					value: model.dailyCardioPoints.get(date),
					date,
				})) as Cardio7D["series"];

				const constants = model.last7DCardioPointConstants.get(localISODay);

				return {
					series,
					constant: {
						average: constants?.[MetricType.UserCardioPointAverage] as number,
						baseline: constants?.[MetricType.UserCardioPointBaseline] as number,
						total: constants?.[MetricType.UserCardioPointTotal] as number,
					},
					controlState,
				};
			},

			useDailySleepQualityScore(localISODay: ISODay = getCurrentLocalISODay()) {
				useEffect(
					action(function () {
						if (!model.dailySleepScore.has(localISODay)) {
							actions.setDailySleepScore(localISODay, shouldForceRefresh(localISODay));
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
							actions.setDailyWakeUpScore(localISODay, shouldForceRefresh(localISODay));
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
			hasEnoughData(localISODay: ISODay): boolean {
				useEffect(
					action(function () {
						// Warning: date in model are in UTC, you need to convert them in local
						if (!model.dailySleepMetrics.has(localISODay)) {
							actions.setDailySleepStagesMetrics(localISODay, true);
						}
					}),
					[localISODay]
				);
				return hasEnoughData(localISODay);
			},
			useDailyGlobalScore(localISODay: ISODay = getCurrentLocalISODay()): number | undefined {
				useEffect(
					action(function () {
						if (!model.dailyGlobalScore.has(localISODay)) {
							actions.setDailyGlobalScore(localISODay, shouldForceRefresh(localISODay));
						}
					}),
					[localISODay]
				);
				return model.dailyGlobalScore.get(localISODay);
			},
		},
	};
}
