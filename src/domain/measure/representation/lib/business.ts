import { getLogger } from "@core/logger/logger";
import { hasMetric } from "@ui/utils/guard";
import { action, reaction } from "mobx";
import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { MetricType, RangeMetrics } from "../../metric";
import { ActivityStage, SleepStage } from "../../type";
import { DailySleepData } from "../api";
import { DailyActivityIntensityMetrics, DailySleepStageDuration, SleepStagesMetrics, StageInfos } from "./type";

/**
 * Return the phases of sleep for the given metrics
 */
export const createActivityPhasesGetter =
	(isoDay: string) =>
	(
		data: RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>
	): {
		stages: Array<StageInfos<ActivityStage>>;
		duration: number;
		sportSessionDates: Array<[string | undefined, string | undefined]>;
	} => {
		const sportSessionDates: Array<[string | undefined, string | undefined]> = [];
		const duration = Number(data.constant[MetricType.UserDailyActivityTotal]);
		const stages: Array<StageInfos<ActivityStage>> = data.timeSeries.reduce(function (result, block, i) {
			const isSameDay = new Date(block.timestamp).getDate() === new Date(isoDay).getDate();
			if (isSameDay && hasMetric(MetricType.UserDataActivityIntensity)(block)) {
				const intensityValue = Number(block.metrics[MetricType.UserDataActivityIntensity]);
				// Prevent duplicated user.data.activity.intensity value
				// The user.data.activity.intensity should pop once per value change
				// TODO extract to front CIR-562
				if (result[i - 1]?.level !== intensityValue) {
					result.push({
						level: intensityValue,
						start: block.timestamp,
						// Look for the next activity intensity switch
						end:
							data.timeSeries.slice(i + 1).find(hasMetric(MetricType.UserDataActivityIntensity))?.timestamp ??
							data.timeSeries[data.timeSeries.length - 1].timestamp,
					});
				}
			}
			return result;
		}, [] as Array<StageInfos<ActivityStage>>);

		for (let i = 0; i < data.timeSeries.length; i++) {
			const currentBlock = data.timeSeries[i];
			const doesStartSession = MetricType.UserDailySportBegin in currentBlock.metrics;
			if (doesStartSession) {
				const startTime = currentBlock.timestamp;
				// Find end block
				const endIndex = data.timeSeries.slice(i).findIndex(hasMetric(MetricType.UserDailySportEnd));
				const endTime = endIndex > -1 ? data.timeSeries[i + endIndex].timestamp : undefined;
				sportSessionDates.push([startTime, endTime]);
				// Move the cursor forward to find the next session
				i += endIndex > -1 ? endIndex : 0;
			}
		}

		return {
			stages,
			duration,
			sportSessionDates,
		};
	};

/**
 * Return the phases of sleep for the given metrics
 */
export const createSleepStagesGetter =
	(_: string) =>
	(data: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>): DailySleepData => {
		const stages: Array<StageInfos<SleepStage>> = [];
		for (let i = 0; i < data.timeSeries.length; i++) {
			const block = data.timeSeries[i];
			if (MetricType.UserSleepStage in block.metrics) {
				const stage = block.metrics[MetricType.UserSleepStage] as number;
				// Prevent duplicated user sleep stage value
				// TODO ask the back to do this
				const currentLevel = Math.min(4, Math.max(1, Math.round(stage))); //@TODO ask if it is normal to have decimal
				const previousLevel = Math.min(4, Math.max(1, Math.round(stages[i - 1]?.level)));
				if (currentLevel !== previousLevel) {
					// Find the end of this phase
					// Look for the next sleep stage switch
					const startSearchAt = i + 1;
					const endOfStageBlockIndex =
						startSearchAt +
						data.timeSeries.slice(startSearchAt).findIndex(
							(nextBlock) =>
								// Either the next block with a different MetricType value
								nextBlock.metrics[MetricType.UserSleepStage] !== block.metrics[MetricType.UserSleepStage]
						);
					// No stage variation, we are probably on the last stage of the chain. Take the last block.
					const isLastStage = endOfStageBlockIndex === i;

					if (isLastStage) {
						break;
					}

					const endOfStageBlock = data.timeSeries[endOfStageBlockIndex];

					stages.push({
						level: currentLevel,
						start: block.timestamp,
						end: endOfStageBlock.timestamp,
					});

					// Fast forward the cursor to skip useless measure
					i = endOfStageBlockIndex - 1;
				}
			}
		}

		const hasCoreSleep = MetricType.UserCoreSleepBegin in data.constant;
		const coreSleepTiming = hasCoreSleep
			? ([
					new Date((data.constant[MetricType.UserCoreSleepBegin] as number) * 1000).toISOString(),
					new Date((data.constant[MetricType.UserCoreSleepEnd] as number) * 1000).toISOString(),
			  ] as [string, string])
			: undefined;

		const totalMinutesSleepDuration = Number(data.constant[MetricType.UserDailyTotalSleepDuration]);
		const napTimings: Array<[string, string]> = getNaps(data);

		return {
			totalMinutesSleepDuration,
			stages,
			timeToFallASleep: data.constant[MetricType.UserDailyCoreTimeToFallAsleep] as number,
			coreSleepTiming,
			napTimings,
			sleepStagesDuration: {
				[SleepStage.AWAKE]:
					MetricType.UserDailyAwakeStageDuration in data.constant && MetricType.UserDailyPercAwakeStage in data.constant
						? {
								duration: data.constant[MetricType.UserDailyAwakeStageDuration] as number,
								percent: data.constant[MetricType.UserDailyPercAwakeStage] as number,
						  }
						: undefined,
				[SleepStage.REM]:
					MetricType.UserDailyREMStageDuration in data.constant && MetricType.UserDailyPercREMStage in data.constant
						? {
								duration: data.constant[MetricType.UserDailyREMStageDuration] as number,
								percent: data.constant[MetricType.UserDailyPercREMStage] as number,
						  }
						: undefined,
				[SleepStage.LIGHT]:
					MetricType.UserDailyLightStageDuration in data.constant && MetricType.UserDailyPercLightStage in data.constant
						? {
								duration: data.constant[MetricType.UserDailyLightStageDuration] as number,
								percent: data.constant[MetricType.UserDailyPercLightStage] as number,
						  }
						: undefined,
				[SleepStage.DEEP]:
					MetricType.UserDailyDeepStageDuration in data.constant && MetricType.UserDailyPercDeepStage in data.constant
						? {
								duration: data.constant[MetricType.UserDailyDeepStageDuration] as number,
								percent: data.constant[MetricType.UserDailyPercDeepStage] as number,
						  }
						: undefined,
			},
		};
	};
export type HeavyComputationHandler = ReturnType<typeof InteractionManager.runAfterInteractions>;

export function setAfterHeavyComputation<M, T>(
	setData: (data: T) => void,
	heavyComputation: (metrics: M) => T,
	heavyComputationHandlerRef: React.MutableRefObject<HeavyComputationHandler | undefined>,
	metrics: M
) {
	let start = 0;
	heavyComputationHandlerRef.current?.cancel();
	heavyComputationHandlerRef.current = InteractionManager.runAfterInteractions(() => {
		start = new Date().getTime();
		__DEV__ && console.log("[MEASURE: Representation] Start of daily data computation.");
		setData(heavyComputation(metrics));
	});
	heavyComputationHandlerRef.current.then(
		() =>
			__DEV__ && console.log("[MEASURE: Representation] End of daily data computation.", new Date().getTime() - start)
	);
}

export function useDailyHeavyComputationData<M, T>(
	isoDay: string,
	modelField: {
		get(isoDay: string): M | undefined;
	},
	setData: (data: T) => void,
	heavyComputation: (metrics: M) => T,
	fetchData: (isoDay: string) => void
) {
	const heavyComputationHandlerRef = useRef<HeavyComputationHandler>();
	useEffect(
		action(function () {
			const metrics = modelField.get(isoDay);
			if (metrics === undefined) {
				__DEV__ && console.log("[MEASURE: Action] FETCH daily measure");
				fetchData(isoDay);
				const dispose = reaction(
					// If this changes
					() => modelField.get(isoDay),
					// Launch heavy computation
					function (metrics) {
						if (metrics) {
							dispose();
							setAfterHeavyComputation(setData, heavyComputation, heavyComputationHandlerRef, metrics);
						}
					}
				);
			} else {
				setAfterHeavyComputation(setData, heavyComputation, heavyComputationHandlerRef, metrics);
			}
		}),
		[isoDay]
	);
}

/**
 * Return the nap time frames
 */
export const getNaps = (data: RangeMetrics<SleepStagesMetrics>): Array<[string, string]> => {
	const napTimings: Array<[string, string]> = [];
	for (let i = 0; i < data.timeSeries.length; i++) {
		const currentBlock = data.timeSeries[i];
		if (MetricType.UserNapSleepBegin in currentBlock.metrics) {
			const startTime = new Date((currentBlock.metrics[MetricType.UserNapSleepBegin] as number) * 1000).toISOString();
			// Find end block
			const endIndex = data.timeSeries.slice(i).findIndex(hasMetric(MetricType.UserNapSleepEnd));
			const endTime =
				endIndex > -1
					? new Date((data.timeSeries[i + endIndex].metrics[MetricType.UserNapSleepEnd] as number) * 1000).toISOString()
					: undefined;
			if (!endTime) {
				getLogger("MEASURE REPRESENTATION").debug(`A nap started at ${startTime} has no end`);
				break;
			}
			napTimings.push([startTime, endTime]);
			// Move the cursor forward to find the next session
			i += endIndex > -1 ? endIndex : 0;
		}
	}
	return napTimings;
};
