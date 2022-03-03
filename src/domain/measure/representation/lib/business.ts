import { getLogger } from "@core/logger/logger";
import { hasMetric } from "@ui/utils/guard";
import { reaction } from "mobx";
import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { MetricType, RangeMetrics } from "../../metric";
import { ActivityStage, SleepStage } from "../../type";
import { DailySleepData } from "../api";
import { DailyActivityIntensityMetrics, DailySleepStageDuration, SleepStagesMetrics, StageInfos } from "./type";

/**
 * Return the phases of sleep for the given metrics
 */
export function getActivityPhases(
	data: RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>
): {
	stages: Array<StageInfos<ActivityStage>>;
	duration: number;
	sportSessionDates: Array<[string | undefined, string | undefined]>;
} {
	const sportSessionDates: Array<[string | undefined, string | undefined]> = [];
	const duration = Number(data.last[MetricType.UserDailyActivityTotal]);
	const stages: Array<StageInfos<ActivityStage>> = data.timeline.reduce(function (result, block, i) {
		if (hasMetric(MetricType.UserDataActivityIntensity)(block)) {
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
						data.timeline.slice(i + 1).find(hasMetric(MetricType.UserDataActivityIntensity))?.timestamp ??
						data.timeline[data.timeline.length - 1].timestamp,
				});
			}
		}
		return result;
	}, [] as Array<StageInfos<ActivityStage>>);

	for (let i = 0; i < data.timeline.length; i++) {
		const currentBlock = data.timeline[i];
		const doesStartSession = MetricType.UserDailySportBegin in currentBlock.metrics;
		if (doesStartSession) {
			const startTime = currentBlock.timestamp;
			// Find end block
			const endIndex = data.timeline.slice(i).findIndex(hasMetric(MetricType.UserDailySportEnd));
			const endTime = endIndex > -1 ? data.timeline[i + endIndex].timestamp : undefined;
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
}

/**
 * Return the phases of sleep for the given metrics
 */
export const createSleepStagesGetter =
	(_: string) =>
	(data: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>): DailySleepData => {
		const stages: Array<StageInfos<SleepStage>> = [];
		for (let i = 0; i < data.timeline.length; i++) {
			const block = data.timeline[i];
			if (MetricType.UserSleepStage in block.metrics) {
				const stage = block.metrics[MetricType.UserSleepStage] as number;
				// Prevent duplicated user sleep stage value
				// TODO ask the back to do this
				if (stages[i - 1]?.level !== stage) {
					// Find the end of this phase
					// Look for the next sleep stage switch
					const startSearchAt = i + 1;
					const endOfStageBlockIndex =
						startSearchAt +
						data.timeline.slice(startSearchAt).findIndex(
							(nextBlock) =>
								// Either the next block with a different MetricType value
								nextBlock.metrics[MetricType.UserSleepStage] !== block.metrics[MetricType.UserSleepStage]
						);
					// No stage variation, we are probably on the last stage of the chain. Take the last block.
					const isLastStage = endOfStageBlockIndex === i;

					if (isLastStage) {
						break;
					}

					const endOfStageBlock = data.timeline[endOfStageBlockIndex];

					stages.push({
						level: stage,
						start: block.timestamp,
						end: endOfStageBlock.timestamp,
					});

					// Fast forward the cursor to skip useless measure
					i = endOfStageBlockIndex - 1;
				}
			}
		}

		const hasCoreSleep = MetricType.UserCoreSleepBegin in data.last;
		const coreSleepTiming = hasCoreSleep
			? ([
					new Date((data.last[MetricType.UserCoreSleepBegin] as number) * 1000).toISOString(),
					new Date((data.last[MetricType.UserCoreSleepEnd] as number) * 1000).toISOString(),
			  ] as [string, string])
			: undefined;

		const totalMinutesSleepDuration = Number(data.last[MetricType.UserDailyTotalSleepDuration]);
		const napTimings: Array<[string, string]> = getNaps(data);

		return {
			totalMinutesSleepDuration,
			stages,
			timeToFallASleep: data.last[MetricType.UserTimeToFallASleep] as number,
			coreSleepTiming,
			napTimings,
			sleepStagesDuration: {
				[SleepStage.AWAKE]:
					MetricType.UserDailyAwakeStageDuration in data.last && MetricType.UserDailyPercAwakeStage in data.last
						? {
								duration: data.last[MetricType.UserDailyAwakeStageDuration] as number,
								percent: data.last[MetricType.UserDailyPercAwakeStage] as number,
						  }
						: undefined,
				[SleepStage.REM]:
					MetricType.UserDailyREMStageDuration in data.last && MetricType.UserDailyPercREMStage in data.last
						? {
								duration: data.last[MetricType.UserDailyREMStageDuration] as number,
								percent: data.last[MetricType.UserDailyPercREMStage] as number,
						  }
						: undefined,
				[SleepStage.LIGHT]:
					MetricType.UserDailyLightStageDuration in data.last && MetricType.UserDailyPercLightStage in data.last
						? {
								duration: data.last[MetricType.UserDailyLightStageDuration] as number,
								percent: data.last[MetricType.UserDailyPercLightStage] as number,
						  }
						: undefined,
				[SleepStage.DEEP]:
					MetricType.UserDailyDeepStageDuration in data.last && MetricType.UserDailyPercDeepStage in data.last
						? {
								duration: data.last[MetricType.UserDailyDeepStageDuration] as number,
								percent: data.last[MetricType.UserDailyPercDeepStage] as number,
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
		function () {
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
		},
		[isoDay]
	);
}

/**
 * Return the nap time frames
 */
export const getNaps = (data: RangeMetrics<SleepStagesMetrics>): Array<[string, string]> => {
	const napTimings: Array<[string, string]> = [];
	for (let i = 0; i < data.timeline.length; i++) {
		const currentBlock = data.timeline[i];
		if (MetricType.UserNapSleepBegin in currentBlock.metrics) {
			const startTime = new Date((currentBlock.metrics[MetricType.UserNapSleepBegin] as number) * 1000).toISOString();
			// Find end block
			const endIndex = data.timeline.slice(i).findIndex(hasMetric(MetricType.UserNapSleepEnd));
			const endTime =
				endIndex > -1
					? new Date((data.timeline[i + endIndex].metrics[MetricType.UserNapSleepEnd] as number) * 1000).toISOString()
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
