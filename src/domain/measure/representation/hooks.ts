import { ApiService } from "@core/api/apiService";
import {
	getCurrentLocalISODay,
	getLast7Days,
	getMonthsBetween,
	isDefined,
	isISOMonth,
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
	ActivityAll,
	ActivityDetail,
	CalorieBurned7D,
	Cardio7D,
	Contributor,
	DailyActivityIntensityData,
	DailyBr,
	DailyHr,
	DailyHRNight,
	DailyHrTrend,
	DailyHrv,
	DailyHrvTrend,
	DailySleepData,
	DailySpo2,
	DataControlState,
	Scores7D,
	Sleep7D,
	SleepAll,
	Steps7D,
	TemperatureVariation7D,
} from "./api";
import {
	canDisplay,
	getActivityControlState,
	getOrElse,
	getScoreControlStates,
	hasNullish,
	parseAllActivity,
	parseDailyBR,
	parseDailyHR,
	parseDailyHRNight,
	parseDailyHRTrend,
	parseDailyHRV,
	parseDailyHRVTrend,
	parseDailySpo2,
	toOptional,
} from "./business";
import { createActivityPhasesGetter, createSleepStagesGetter, useDailyHeavyComputationData } from "./lib/business";
import { Activities, ActivityScoreContributors, SleepScoreContributors } from "./lib/type";

export function createRepresentation(apiService: ApiService, model: MeasureModel) {
	const actions = createActions(new MeasureApi(apiService), model.present);

	function hasCompleteCoreSleep(localISODay: ISODay): boolean {
		const userCoreSleepEnd = model.dailySleepMetrics.get(localISODay)?.constant[MetricType.UserCoreSleepEnd];

		// Spec: 00000
		return !!userCoreSleepEnd && canDisplay(localISODay, (userCoreSleepEnd as number) * 1000);
	}

	function shouldByPassCache(field: Map<any, any>, key: ISODay | ISOMonth) {
		return (
			// Data has not been fetched yet
			!field.has(key) ||
			// Data has some nullish value, maybe something fresher is on the server
			hasNullish(field.get(key)) ||
			// The user looks today's data
			isToday(key, new Date().toISOString()) ||
			// The app has not enough data yet, maybe the server is now up to date
			(!isISOMonth(key) && !hasCompleteCoreSleep(key as ISODay))
		);
	}

	return {
		actions,
		hooks: {
			use7DaysSleep(localISODay: ISODay): Sleep7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily sleep stages metrics
						last7Days.forEach((d) =>
							actions.setDailySleepStagesMetrics(d, shouldByPassCache(model.dailySleepMetrics, d))
						);
						// and the constants for the last 7 days
						actions.pullLast7DSleepMetrics(
							localISODay,
							shouldByPassCache(model.last7DSleepConstantMetrics, localISODay)
						);
					}),
					[localISODay]
				);

				const isLoaded =
					model.last7DSleepConstantMetrics.has(localISODay) &&
					last7Days.every((date) => model.dailySleepMetrics.has(date));

				if (!isLoaded) {
					return undefined;
				}

				const last7DSleepMetrics = model.last7DSleepConstantMetrics.get(localISODay);

				if (last7DSleepMetrics) {
					const constant = {
						awakeDuration: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysAwakeStageDuration),
						awakePerc: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysPercawakeStage),
						lightDuration: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysLightStageDuration),
						lightPerc: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysPerclightStage),
						deepDuration: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysDeepStageDuration),
						deepPerc: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysPercdeepStage),
						REMDuration: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysRemStageDuration),
						REMPerc: toOptional<number>(last7DSleepMetrics, MetricType.User7DaysPercremStage),
					} as Sleep7D["constant"];

					const sleepStages = last7Days.map((date) => {
						const localMetrics = model.dailySleepMetrics.get(date)?.constant;
						return {
							awake:
								localMetrics && localMetrics[MetricType.UserDailyAwakeStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserDailyAwakeStageDuration]).asHours()
									: 0,
							light:
								localMetrics && localMetrics[MetricType.UserDailyLightStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserDailyLightStageDuration]).asHours()
									: 0,
							deep:
								localMetrics && localMetrics[MetricType.UserDailyDeepStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserDailyDeepStageDuration]).asHours()
									: 0,
							REM:
								localMetrics && localMetrics[MetricType.UserDailyREMStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserDailyREMStageDuration]).asHours()
									: 0,
							date,
						};
					}) as unknown as Sleep7D["sleepStages"];

					const controlState = sleepStages.some((stage) => isDefined(stage?.light))
						? DataControlState.READY
						: DataControlState.NO_DATA;

					return { sleepStages, constant, controlState };
				}
			},
			useAllMonthsSleep(
				beginISOMonth: ISOMonth,
				endISOMonth: ISOMonth = toISOMonth(getCurrentLocalISODay())
			): SleepAll | undefined {
				// Compute the all previous months from the given date
				const months = useMemo(() => getMonthsBetween(beginISOMonth, endISOMonth), [beginISOMonth, endISOMonth]);

				useEffect(
					action(function () {
						// Get the last 7 daily sleep stages metrics
						months.forEach((d) =>
							actions.pullMonthlySleepStageMetrics(d, shouldByPassCache(model.monthlySleepStageMetrics, d))
						);
						// and the constants for the last 7 days
						actions.pullLastAllSleepConstantMetrics(
							endISOMonth,
							shouldByPassCache(model.lastAllSleepStageMetrics, endISOMonth)
						);
					}),
					[months]
				);

				const isLoaded =
					model.lastAllSleepStageMetrics.has(endISOMonth) &&
					months.every((date) => model.monthlySleepStageMetrics.has(date));

				if (!isLoaded) {
					return undefined;
				}

				const lastAllSleepMetrics = model.lastAllSleepStageMetrics.get(endISOMonth);
				if (lastAllSleepMetrics) {
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
						const localMetrics = model.monthlySleepStageMetrics.get(date);
						return {
							awake:
								localMetrics && localMetrics[MetricType.UserMonthlyAwakeStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserMonthlyAwakeStageDuration]).asHours()
									: 0,
							light:
								localMetrics && localMetrics[MetricType.UserMonthlyLightStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserMonthlyLightStageDuration]).asHours()
									: 0,
							deep:
								localMetrics && localMetrics[MetricType.UserMonthlyDeepStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserMonthlyDeepStageDuration]).asHours()
									: 0,
							REM:
								localMetrics && localMetrics[MetricType.UserMonthlyRemStageDuration] !== null
									? moment.duration(localMetrics[MetricType.UserMonthlyRemStageDuration]).asHours()
									: 0,
							date,
						};
					}) as unknown as SleepAll["sleepStages"];

					const controlState = sleepStages.some((stage) => isDefined(stage?.light))
						? DataControlState.READY
						: DataControlState.NO_DATA;

					return { sleepStages, constant, controlState };
				}
			},
			use7DaysActivity(localISODay: ISODay): Activity7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily acitivity intensity metrics
						last7Days.forEach((d) =>
							actions.pullDailyActivityIntensityMetrics(d, shouldByPassCache(model.dailyActivityIntensityMetrics, d))
						);
						// and the constants for the last 7 days
						actions.pullLast7DActivityIntensityMetrics(
							localISODay,
							shouldByPassCache(model.last7DActivityIntensityAverageMetrics, localISODay)
						);
					}),
					[localISODay]
				);

				const isLoaded =
					model.last7DActivityIntensityAverageMetrics.has(localISODay) &&
					last7Days.every((date) => model.dailyActivityIntensityMetrics.has(date));

				if (!isLoaded) {
					return undefined;
				}

				const last7DActivityIntensityAverageMetrics = model.last7DActivityIntensityAverageMetrics.get(localISODay);

				if (last7DActivityIntensityAverageMetrics) {
					const constant = {
						highDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageHighIntensityDuration],
						mediumDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageMediumIntensityDuration],
						lowDuration: last7DActivityIntensityAverageMetrics[MetricType.User7DaysAverageLowIntensityDuration],
					} as Activity7D["constant"];

					const activityMetrics = last7Days.map((date) => {
						const localMetrics = model.dailyActivityIntensityMetrics.get(date)?.constant;
						return {
							high:
								localMetrics && localMetrics[MetricType.UserDailyHighActivityIntensityDuration] !== null
									? localMetrics[MetricType.UserDailyHighActivityIntensityDuration]
									: null,
							medium:
								localMetrics && localMetrics[MetricType.UserDailyMediumActivityIntensityDuration] !== null
									? localMetrics[MetricType.UserDailyMediumActivityIntensityDuration]
									: null,
							low:
								localMetrics && localMetrics[MetricType.UserDailyLowActivityIntensityDuration] !== null
									? localMetrics[MetricType.UserDailyLowActivityIntensityDuration]
									: null,
							date,
						};
					}) as unknown as Activity7D["activityMetrics"];

					const controlState = activityMetrics.some((metric) => isDefined(metric?.low))
						? DataControlState.READY
						: DataControlState.NO_DATA;

					return { activityMetrics, constant, controlState };
				}
			},
			useAllActivity(beginISOMonth: ISOMonth, endISOMonth: ISOMonth): ActivityAll | undefined {
				// Compute the all previous months from the given date
				const months = useMemo(() => getMonthsBetween(beginISOMonth, endISOMonth), [beginISOMonth, endISOMonth]);

				useEffect(
					action(function () {
						// Get the previous monthly sleep stages metrics
						months.forEach((d) =>
							actions.setMonthlyActivityIntensityMetrics(d, shouldByPassCache(model.monthlyActivityIntensityMetrics, d))
						);
						// and the constants for the last months
						actions.pullLastAllActivityIntensityMetrics(
							endISOMonth,
							shouldByPassCache(model.lastAllActivityIntensityAverageMetrics, endISOMonth)
						);
					}),
					[months]
				);

				const lastActivity = model.lastAllActivityIntensityAverageMetrics.get(endISOMonth);
				const allActivity = months.map((date) => ({ date, activity: model.monthlyActivityIntensityMetrics.get(date) }));

				return parseAllActivity(lastActivity, allActivity);
			},
			useDailyHR(localISODay: ISODay): DailyHr | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyHRMetrics(localISODay, shouldByPassCache(model.dailyHRMetrics, localISODay));
					}),
					[localISODay]
				);
				const data = model.dailySleepMetrics.get(localISODay);
				return parseDailyHR(model.dailyHRMetrics.get(localISODay), data);
			},
			useDailySpo2(localISODay: ISODay): DailySpo2 | undefined {
				useEffect(
					action(function () {
						actions.pullDailySpo2Metrics(localISODay, shouldByPassCache(model.dailySpo2Metrics, localISODay));
					}),
					[localISODay]
				);

				const data = model.dailySleepMetrics.get(localISODay);

				return parseDailySpo2(model.dailySpo2Metrics.get(localISODay), data);
			},
			useDailyHRNight(localISODay: ISODay): DailyHRNight | undefined {
				useEffect(
					action(function () {
						actions.pullDailyHRNightMetrics(localISODay, shouldByPassCache(model.dailySpo2Metrics, localISODay));
					}),
					[localISODay]
				);

				const data = model.dailySleepMetrics.get(localISODay);

				return parseDailyHRNight(model.dailyHRNightMetrics.get(localISODay), data);
			},
			useDailyBR(localISODay: ISODay): DailyBr | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.pullDailyBRMetrics(localISODay, shouldByPassCache(model.dailyBRMetrics, localISODay));
					}),
					[localISODay]
				);
				const data = model.dailySleepMetrics.get(localISODay);

				return parseDailyBR(model.dailyBRMetrics.get(localISODay), data);
			},

			useDailyHRV(localISODay: ISODay): DailyHrv | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.pullDailyHRVMetrics(localISODay, shouldByPassCache(model.dailyHRVMetrics, localISODay));
					}),
					[localISODay]
				);

				const data = model.dailySleepMetrics.get(localISODay);

				return parseDailyHRV(model.dailyHRVMetrics.get(localISODay), data);
			},

			useDailyActivityIntensity({
				localISODay,
				setData,
			}: {
				localISODay: ISODay;
				setData: (data: DailyActivityIntensityData) => void;
			}) {
				const modelField = model.dailyActivityIntensityMetrics;
				const fetchData = () => {
					actions.pullDailyActivityIntensityMetrics(
						localISODay,
						shouldByPassCache(model.dailyActivityIntensityMetrics, localISODay)
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
			useDailyActivities(localISODay: ISODay): Record<Activities, ActivityDetail> | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyActivitiesMetrics(
							localISODay,
							shouldByPassCache(model.dailyActivitiesMetrics, localISODay)
						);
					}),
					[localISODay]
				);
				const data = model.dailyActivitiesMetrics.get(localISODay);
				if (data) {
					return {
						[MetricType.UserDailySteps]: {
							value: toOptional<number>(data, MetricType.UserDailySteps),
							controlState: getActivityControlState({
								thresholdLow: Number(data[MetricType.UserDailyStepsGoalMin]),
								thresholdHigh: Number(data[MetricType.UserDailyStepsGoalMax]),
								value: getOrElse(data, MetricType.UserDailySteps, 0),
							}),
						},
						[MetricType.UserDailyWalkingEquivalency]: {
							value: toOptional<number>(data, MetricType.UserDailyWalkingEquivalency),
							controlState: getActivityControlState({
								thresholdLow: Number(data[MetricType.UserDailyWalkingEquivalencyGoalMin]),
								thresholdHigh: Number(data[MetricType.UserDailyWalkingEquivalencyGoalMax]),
								value: getOrElse(data, MetricType.UserDailyWalkingEquivalency, 0),
							}),
						},
						[MetricType.UserDailyCaloriesBurned]: {
							value: toOptional<number>(data, MetricType.UserDailyCaloriesBurned),
							score: Number(data[MetricType.UserDailySteps]),
							controlState: getActivityControlState({
								thresholdLow: Number(data[MetricType.UserDailyStepsGoalMin]),
								thresholdHigh: Number(data[MetricType.UserDailyStepsGoalMax]),
								value: getOrElse(data, MetricType.UserDailyCaloriesBurned, 0),
							}),
						},
						[MetricType.UserDailyCardioPoints]: {
							value: toOptional<number>(data, MetricType.UserDailyCardioPoints),
							controlState: getActivityControlState({
								thresholdLow: Number(data[MetricType.UserDailyCardioPointsGoalMin]),
								thresholdHigh: Number(data[MetricType.UserDailyCardioPointsGoalMax]),
								value: getOrElse(data, MetricType.UserDailyCardioPoints, 0),
							}),
						},
						[MetricType.UserDailyVO2Max]: {
							value: toOptional<number>(data, MetricType.UserDailyVO2Max),
						},
						[MetricType.UserDailyAwakeHRMax]: {
							value: toOptional<number>(data, MetricType.UserDailyAwakeHRMax),
						},
					};
				}
			},
			/**
			 * Return sleep score contributors
			 * @implements 00013, 00014, 00015, 00016, 00017, 00018, 00019, 00020, 00021, 00022
			 */
			useDailyEnergyScoreContributors(localISODay: ISODay): Record<ActivityScoreContributors, Contributor> | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailyEnergyScoreContributorsMetrics(
							localISODay,
							shouldByPassCache(model.dailyEnergyScoreContributorsMetrics, localISODay)
						);
					}),
					[localISODay]
				);
				const data = model.dailyEnergyScoreContributorsMetrics.get(localISODay);
				if (data) {
					return {
						[MetricType.UserDailyBodyRecovery]: {
							value: toOptional<number>(data, MetricType.UserDailyBodyRecovery),
							thresholdLow: getOrElse(data, MetricType.UserDailyBodyRecoveryGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyBodyRecoveryGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyBodyRecovery),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyBodyRecoveryGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyBodyRecoveryGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyBodyRecovery]),
							}),
						},
						[MetricType.UserDailyWakeUpScore]: {
							value: toOptional<number>(data, MetricType.UserDailyWakeUpScore),
							thresholdLow: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyWakeUpScore),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyWakeUpScore]),
							}),
						},
						[MetricType.UserDailyScoreBR]: {
							value: toOptional<number>(data, MetricType.UserDailyAsleepBR),
							thresholdLow: getOrElse(data, MetricType.UserDailyScoreBRGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyScoreBRGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyScoreBR),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyScoreBRGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyScoreBRGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyScoreBR]),
							}),
						},
						[MetricType.UserDailyScoreSPO2]: {
							value: toOptional<number>(data, MetricType.UserDailyAsleepSPO2),
							thresholdLow: getOrElse(data, MetricType.UserDailyScoreBRGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyScoreBRGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyScoreSPO2),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyScoreBRGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyScoreBRGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyScoreSPO2]),
							}),
						},
						[MetricType.UserDailyScoreHRV]: {
							value: toOptional<number>(data, MetricType.UserDailyAsleepHRV),
							thresholdLow: getOrElse(data, MetricType.UserDailyScoreHRVGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyScoreHRVGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyScoreHRV),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyScoreHRVGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyScoreHRVGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyScoreHRV]),
							}),
						},
						[MetricType.UserDailyScoreRHR]: {
							value: toOptional<number>(data, MetricType.UserDailyRHR),
							thresholdLow: getOrElse(data, MetricType.UserDailyScoreRHRGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyScoreRHRGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyScoreRHR),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyScoreRHRGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyScoreRHRGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyScoreRHR]),
							}),
						},
						[MetricType.UserDailySleepScoreVarTemperature]: {
							value: toOptional<number>(data, MetricType.UserDailySleepVarTemperature),
							thresholdLow: getOrElse(data, MetricType.UserDailySleepScoreVarTemperatureGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailySleepScoreVarTemperatureGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailySleepScoreVarTemperature),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailySleepScoreVarTemperatureGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailySleepScoreVarTemperatureGoalMax, 0.9),
								score: Number(data[MetricType.UserDailySleepScoreVarTemperature]),
							}),
						},
						[MetricType.UserDailySleepScore]: {
							value: toOptional<number>(data, MetricType.User2DaysSleepScore),
							thresholdLow: getOrElse(data, MetricType.UserDailySleepScoreGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailySleepScoreGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailySleepScore),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailySleepScoreGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailySleepScoreGoalMax, 0.9),
								score: Number(data[MetricType.UserDailySleepScore]),
							}),
						},
						[MetricType.UserDailySleepBalance]: {
							value: toOptional<number>(data, MetricType.UserDailySleepBalance),
							thresholdLow: getOrElse(data, MetricType.UserDailySleepBalanceGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailySleepBalanceGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailySleepBalance),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailySleepBalanceGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailySleepBalanceGoalMax, 0.9),
								score: Number(data[MetricType.UserDailySleepBalance]),
							}),
						},
						[MetricType.UserDailyActivityVolume]: {
							value: toOptional<number>(data, MetricType.UserDailyActivityVolume),
							thresholdLow: getOrElse(data, MetricType.UserDailyActivityVolumeGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyActivityVolumeGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyActivityVolume),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyActivityVolumeGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyActivityVolumeGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyActivityVolume]),
							}),
						},
					};
				}
			},
			useDailySleepStages({ localISODay, setData }: { localISODay: ISODay; setData: (data: DailySleepData) => void }) {
				const modelField = model.dailySleepMetrics;
				const fetchData = () =>
					actions.setDailySleepStagesMetrics(localISODay, shouldByPassCache(model.dailySleepMetrics, localISODay));
				useDailyHeavyComputationData(localISODay, modelField, setData, createSleepStagesGetter(localISODay), fetchData);
			},
			/**
			 * Return sleep score contributors
			 * @implements 00006, 00007, 00008, 00009, 00010, 00011, 00012, 00022
			 */
			useDailySleepScoreContributors(localISODay: ISODay): Record<SleepScoreContributors, Contributor> | undefined {
				useEffect(
					action(function () {
						__DEV__ && console.log("[MEASURE: Action] FETCH");
						actions.setDailySleepScoreContributorsMetrics(
							localISODay,
							shouldByPassCache(model.dailySleepScoreContributorsMetrics, localISODay)
						);
					}),
					[localISODay]
				);
				const data = model.dailySleepScoreContributorsMetrics.get(localISODay);
				if (data) {
					return {
						[MetricType.UserDailyAwakeStageDuration]: {
							value: toOptional<number>(data, MetricType.UserDailyAwakeStageDuration),
							thresholdLow: 0.1,
							thresholdHigh: 0.2,
							percent: 1 - (Number(data[MetricType.UserDailyPercAwakeStage]) ?? 1),
							controlState: getScoreControlStates({
								thresholdLow: 0.1,
								thresholdHigh: 0.2,
								score: Number(data[MetricType.UserDailyPercAwakeStage]),
								isInverted: true,
							}),
						},
						[MetricType.UserDailyRealSleepDuration]: {
							value: toOptional<number>(data, MetricType.UserDailyRealSleepDuration),
							thresholdLow: 0.8,
							thresholdHigh: 0.9,
							percent: toOptional<number>(data, MetricType.UserDailyPercRealSleep),
							controlState: getScoreControlStates({
								thresholdLow: 0.8,
								thresholdHigh: 0.9,
								score: Number(data[MetricType.UserDailyPercRealSleep]),
							}),
						},
						[MetricType.UserDailyTranquility]: {
							value: toOptional<number>(data, MetricType.UserDailyTranquility),
							thresholdLow: getOrElse(data, MetricType.UserDailyTranquilityGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyTranquilityGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyTranquility),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyTranquilityGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyTranquilityGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyTranquility]),
							}),
						},
						[MetricType.UserDailyCircadianRhythm]: {
							value: toOptional<number>(data, MetricType.UserDailyCircadianRhythm),
							thresholdLow: getOrElse(data, MetricType.UserDailyCircadianRhythmGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyCircadianRhythmGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyCircadianRhythm),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyCircadianRhythmGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyCircadianRhythmGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyCircadianRhythm]),
							}),
						},
						[MetricType.UserDailyPercREMStageScore]: {
							value: toOptional<number>(data, MetricType.UserDailyPercREMStage),
							thresholdLow: getOrElse(data, MetricType.UserDailyPercREMStageScoreGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyPercREMStageScoreGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyPercREMStageScore),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyPercREMStageScoreGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyPercREMStageScoreGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyPercREMStageScore]),
							}),
						},
						[MetricType.UserDailyPercDeepStage]: {
							value: toOptional<number>(data, MetricType.UserDailyPercDeepStage),
							thresholdLow: getOrElse(data, MetricType.UserDailyPercDeepStageScoreGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyPercDeepStageScoreGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyPercDeepStageScore),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyPercDeepStageScoreGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyPercDeepStageScoreGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyPercDeepStageScore]),
							}),
						},
						[MetricType.UserDailyCoreTimeToFallAsleep]: {
							value: toOptional<number>(data, MetricType.UserDailyCoreTimeToFallAsleep),
							thresholdLow: getOrElse(data, MetricType.UserDailyCorePercTimeToFallAsleepGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyCorePercTimeToFallAsleepGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyCorePercTimeToFallAsleep),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyCorePercTimeToFallAsleepGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyCorePercTimeToFallAsleepGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyCorePercTimeToFallAsleep]),
							}),
						},
						[MetricType.UserDailySleepDebt]: {
							value: toOptional<number>(data, MetricType.UserDailySleepDebt),
							thresholdLow: getOrElse(data, MetricType.UserDailyPercSleepDebtGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyPercSleepDebtGoalMax, 0.9),
							percent: toOptional<number>(data, MetricType.UserDailyPercSleepDebt),
							controlState: getScoreControlStates({
								thresholdLow: getOrElse(data, MetricType.UserDailyPercSleepDebtGoalMin, 0.8),
								thresholdHigh: getOrElse(data, MetricType.UserDailyPercSleepDebtGoalMax, 0.9),
								score: Number(data[MetricType.UserDailyPercSleepDebt]),
							}),
						},
					};
				}
			},
			useDailyEnergyScore(localISODay: ISODay) {
				useEffect(
					action(function () {
						actions.setDailyEnergyScore(localISODay, shouldByPassCache(model.dailyEnergyScore, localISODay));
					}),
					[localISODay]
				);

				if (!model.dailyEnergyScore.has(localISODay)) {
					return undefined;
				}

				return {
					// Default value accordint to the specs.
					score: Number(model.dailyEnergyScore.get(localISODay)),
					controlState: getScoreControlStates({
						score: Number(model.dailyEnergyScore.get(localISODay)),
						thresholdLow: 0.8,
						thresholdHigh: 0.9,
					}),
				};
			},
			useDailyHRVTrend(localISODay = getCurrentLocalISODay()): DailyHrvTrend | undefined {
				useEffect(
					action(function () {
						actions.pullDailyHRVTrendMetrics(localISODay, shouldByPassCache(model.dailyHRVTrendMetrics, localISODay));
					}),
					[localISODay]
				);
				return parseDailyHRVTrend(model.dailyHRVTrendMetrics.get(localISODay));
			},
			useDailyHRTrend(localISODay = getCurrentLocalISODay()): DailyHrTrend | undefined {
				useEffect(
					action(function () {
						actions.pullDailyHRTrendMetrics(localISODay, shouldByPassCache(model.dailyHRVTrendMetrics, localISODay));
					}),
					[localISODay]
				);

				return parseDailyHRTrend(model.dailyHRTrendMetrics.get(localISODay));
			},
			/**
			 * @implements spec 00026
			 */
			useLast7DaysEnergyScore(localISODay: ISODay): Scores7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);
				useEffect(
					action(function () {
						// Get the last 7 daily energy scores
						last7Days.forEach((d) => actions.setDailyEnergyScore(d, shouldByPassCache(model.dailyEnergyScore, d)));
						// and the average for the last 7 days
						actions.setLast7DEnergyScore(localISODay, shouldByPassCache(model.last7DEnergyScore, localISODay));
					}),
					[localISODay]
				);

				const isLoaded = last7Days.every((date) => model.dailyEnergyScore.has(date));

				if (!isLoaded) {
					return undefined;
				}

				const series = last7Days.map((date) => ({
					value: model.dailyEnergyScore.get(date),
					date,
				})) as Scores7D["series"];

				// Spec 00026: IS_READY if has some historical data
				const controlState = series.some(Boolean) ? DataControlState.READY : DataControlState.NO_DATA;
				return {
					series,
					constant: {
						average: model.last7DEnergyScore.get(localISODay) ?? 0,
					},
					controlState,
				};
			},
			/**
			 * @implements spec 00037
			 */
			useLast7DaysSleepScore(localISODay: ISODay): Scores7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);
				useEffect(
					action(function () {
						// Get the last 7 daily sleep scores
						last7Days.forEach((d) =>
							actions.setDailySleepQualityScore(d, shouldByPassCache(model.dailySleepScoreQuality, d))
						);
						// and the average for the last 7 days
						actions.setLast7DSleepScore(localISODay, shouldByPassCache(model.last7DSleepScore, localISODay));
					}),
					[localISODay]
				);

				const isLoaded = last7Days.every((date) => model.dailySleepScoreQuality.has(date));
				if (!isLoaded) {
					return undefined;
				}

				const series = last7Days.map((date) => ({
					value: model.dailySleepScoreQuality.get(date),
					date,
				})) as Scores7D["series"];

				// Spec 00026: IS_READY if has some historical data
				const controlState = series.some(Boolean) ? DataControlState.READY : DataControlState.NO_DATA;
				return {
					series,
					constant: {
						average: model.last7DSleepScore.get(localISODay) ?? 0,
					},
					controlState,
				};
			},
			useLast7DaysCardioPoints(localISODay: ISODay): Cardio7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily energy scores
						last7Days.forEach((d) => actions.pullDailyCardioPoints(d, shouldByPassCache(model.dailyCardioPoints, d)));
						// and the average for the last 7 days
						actions.pullLast7DCardioPoints(
							localISODay,
							shouldByPassCache(model.last7DCardioPointConstants, localISODay)
						);
					}),
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

				if (constants) {
					return {
						series,
						constant: {
							average: Number(constants[MetricType.UserCardioPointAverage]),
							baseline: Number(constants[MetricType.UserCardioPointBaseline]),
							total: Number(constants[MetricType.UserCardioPointTotal]),
						},
						controlState,
					};
				}
			},
			useLast7DaysTemperatureVariation(localISODay: ISODay): TemperatureVariation7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily energy scores
						last7Days.forEach((d) =>
							actions.pullDailyTemperatureVariation(d, shouldByPassCache(model.dailyTemperatureVariation, d))
						);
						// and the average for the last 7 days
						actions.pullLast7DTemperatureVariation(
							localISODay,
							shouldByPassCache(model.last7DTemperatureVariationConstants, localISODay)
						);
					}),
					[localISODay]
				);
				const isLoaded = last7Days.some((date) => model.dailyTemperatureVariation.has(date));

				if (!isLoaded) {
					return undefined;
				}

				// Spec 00026: IS_READY if has some historical data
				const controlState = last7Days.some((date) => isDefined(model.dailyTemperatureVariation.get(date)))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				const series = last7Days.map((date) => ({
					value: model.dailyTemperatureVariation.get(date),
					date,
				})) as TemperatureVariation7D["series"];

				const constants = model.last7DTemperatureVariationConstants.get(localISODay);
				if (constants) {
					return {
						series,
						constant: {
							average: Number(constants[MetricType.UserDailyVarTemperature]),
						},
						controlState,
					};
				}
			},
			useLast7DaysSteps(localISODay: ISODay): Steps7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily energy scores
						last7Days.forEach((d) => actions.pullDailySteps(d, shouldByPassCache(model.dailyCardioPoints, d)));
						// and the average for the last 7 days
						actions.pullLast7DSteps(localISODay, shouldByPassCache(model.last7DStepsConstants, localISODay));
					}),
					[localISODay]
				);
				const isLoaded = last7Days.some((date) => model.dailyStepsMetrics.has(date));

				if (!isLoaded) {
					return undefined;
				}

				// Spec 00026: IS_READY if has some historical data
				const controlState = last7Days.some((date) => isDefined(model.dailyStepsMetrics.get(date)))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				const series = last7Days.map((date) => ({
					value: model.dailyStepsMetrics.get(date),
					date,
				})) as Cardio7D["series"];

				const constants = model.last7DStepsConstants.get(localISODay);

				if (constants) {
					return {
						series,
						constant: {
							average: Number(constants[MetricType.UserStepsAverage]),
							baseline: Number(constants[MetricType.UserStepsBaseline]),
							total: Number(constants[MetricType.UserStepsTotal]),
						},
						controlState,
					};
				}
			},
			useLast7DaysCaloriesBurned(localISODay: ISODay): CalorieBurned7D | undefined {
				// Compute the 7 previous date from the given date
				const last7Days = getLast7Days(localISODay);

				useEffect(
					action(function () {
						// Get the last 7 daily energy scores
						last7Days.forEach((d) => actions.pullDailyCalorieBurned(d, shouldByPassCache(model.dailyCalorieBurned, d)));
						// and the average for the last 7 days
						actions.pullLast7DCalorieBurned(
							localISODay,
							shouldByPassCache(model.last7DCalorieBurnedConstants, localISODay)
						);
					}),
					[localISODay]
				);
				const isLoaded = last7Days.some((date) => model.dailyCalorieBurned.has(date));

				if (!isLoaded) {
					return undefined;
				}

				// Spec 00026: IS_READY if has some historical data
				const controlState = last7Days.some((date) => isDefined(model.dailyCalorieBurned.get(date)))
					? DataControlState.READY
					: DataControlState.NO_DATA;

				const series = last7Days.map((date) => ({
					value: model.dailyCalorieBurned.get(date),
					date,
				})) as CalorieBurned7D["series"];

				const constants = model.last7DCalorieBurnedConstants.get(localISODay);

				if (constants) {
					return {
						series,
						constant: {
							average: Number(constants[MetricType.UserCalorieBurnedAverage]),
							baseline: Number(constants[MetricType.UserCalorieBurnedBaseline]),
							total: Number(constants[MetricType.UserCalorieBurnedTotal]),
						},
						controlState,
					};
				}
			},

			useDailySleepQualityScore(localISODay: ISODay) {
				useEffect(
					action(function () {
						actions.setDailySleepScore(localISODay, shouldByPassCache(model.dailySleepScore, localISODay));
					}),
					[localISODay]
				);
				if (!model.dailySleepScore.has(localISODay)) {
					return;
				}

				const data = model.dailySleepScore.get(localISODay);

				if (data) {
					const score = {
						score: Number(data[MetricType.UserDailySleepScore]),
						goalMin: Number(data[MetricType.UserDailySleepScoreGoalMin]) ?? 0.8,
						goalMax: Number(data[MetricType.UserDailySleepScoreGoalMax]) ?? 0.9,
					};
					return {
						// Default value according to the specs.
						...score,
						controlState: getScoreControlStates({
							thresholdLow: score.goalMin,
							thresholdHigh: score.goalMax,
							score: score.score,
						}),
					};
				}
			},
			useDailyWakeUpScore(localISODay: ISODay) {
				useEffect(
					action(function () {
						actions.setDailyWakeUpScore(localISODay, shouldByPassCache(model.dailyWakeUpScore, localISODay));
					}),
					[localISODay]
				);

				if (!model.dailySleepScore.has(localISODay)) {
					return;
				}

				const data = model.dailyWakeUpScore.get(localISODay);

				if (data) {
					const score = data[MetricType.UserDailyWakeUpScore];
					return {
						score: Number(score),
						controlState: getScoreControlStates({
							thresholdLow: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMin, 0.8),
							thresholdHigh: getOrElse(data, MetricType.UserDailyWakeUpScoreGoalMax, 0.9),
							score: Number(score),
						}),
					};
				}
			},
			useHasCompleteCoreSleep(localISODay: ISODay): boolean {
				useEffect(
					action(function () {
						// Warning: date in model are in UTC, you need to convert them in local
						actions.setDailySleepStagesMetrics(localISODay, shouldByPassCache(model.dailySleepMetrics, localISODay));
					}),
					[localISODay]
				);
				return hasCompleteCoreSleep(localISODay);
			},
			useDailyGlobalScore(localISODay: ISODay): number | undefined {
				useEffect(
					action(function () {
						actions.setDailyGlobalScore(localISODay, shouldByPassCache(model.dailyGlobalScore, localISODay));
					}),
					[localISODay]
				);
				if (!model.dailyGlobalScore.has(localISODay)) {
					return undefined;
				}
				return Number(model.dailyGlobalScore.get(localISODay));
			},
		},
	};
}
