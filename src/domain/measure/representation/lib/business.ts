import { getLogger } from "@core/logger/logger";
import { hasMetric } from "@ui/utils/guard";
import produce from "immer";
import { action, reaction } from "mobx";
import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { MetricType, RangeMetrics } from "../../metric";
import { ActivityStage, SleepStage } from "../../type";
import { DailyActivityIntensityData, DailySleepData, DataControlState } from "../api";
import { getOrElse } from "../business";
import {
	DailyActivityIntensityDuration,
	DailyActivityIntensityMetrics,
	DailySleepStageDuration,
	SleepStagesMetrics,
	StageInfos,
} from "./type";

/**
 * Return the phases of sleep for the given metrics
 */
export const createActivityPhasesGetter =
	(localISODay: string) =>
	(data: RangeMetrics<DailyActivityIntensityMetrics, DailyActivityIntensityDuration>): DailyActivityIntensityData => {
		const sportSessionDates: Array<[string | undefined, string | undefined]> = [];
		const stages: Array<StageInfos<ActivityStage>> = data.timeSeries.reduce(function (result, block, i) {
			const isSameDay = new Date(block.timestamp).getDate() === new Date(localISODay).getDate();
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
			const doesStartSession = hasMetric(MetricType.UserDailySportBegin)(currentBlock.metrics);
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

		const controlState = data.timeSeries.some((block) => hasMetric(MetricType.UserDataActivityIntensity)(block.metrics))
			? DataControlState.READY
			: DataControlState.NO_DATA;

		return {
			stages,
			controlState,
			duration: {
				total: getOrElse<number>(data.constant, MetricType.UserDailyActiveMinute, 0),
				highActivity: getOrElse<number>(data.constant, MetricType.UserDailyHighActivityIntensityDuration, 0),
				mediumActivity: getOrElse<number>(data.constant, MetricType.UserDailyMediumActivityIntensityDuration, 0),
				lowActivity: getOrElse<number>(data.constant, MetricType.UserDailyLowActivityIntensityDuration, 0),
			},
			sportSessionDates,
		};
	};

/**
 * Return the period of stages without the first/last awake period
 * Spec for sleep stages
 * - the data begins at user.core.sleep.begin minus user.time.to.fall.asleep
 * - the data ends after naps if any
 */
export function trimSleepStages({
	stages,
	coreSleepTiming,
	napTimings,
	userTimeToFallAsleep,
}: {
	stages: StageInfos<SleepStage>[];
	coreSleepTiming?: [string, string];
	napTimings: Array<[string, string]>;
	userTimeToFallAsleep: number;
}) {
	if (coreSleepTiming === undefined) {
		return stages;
	}
	if (!stages.length) {
		return [];
	}
	// Update the first stage to reflect the start of the sleep
	return produce(stages, function (draft) {
		// Retrieve the phase where the core sleep begins
		const coreSleepStart = Date.parse(coreSleepTiming[0]);
		draft.splice(
			0,
			draft.findIndex((stage) => Date.parse(stage.start) <= coreSleepStart && Date.parse(stage.end) > coreSleepStart)
		);

		// Start of sleep
		const correctedStart = new Date(coreSleepStart - userTimeToFallAsleep).toISOString();

		if (draft[0].start) {
			draft[0].start = correctedStart;
		}

		// End of sleep. We need to take nap in account
		const coreSleepEnd = Date.parse(coreSleepTiming[1]);
		const didNap = napTimings.length;
		const endBlockIndex = didNap
			? stages.findIndex((block) => {
					const napEnd = napTimings[napTimings.length - 1][1];
					// user woke up during this block
					return Date.parse(napEnd) >= Date.parse(block.start) && Date.parse(napEnd) <= Date.parse(block.end);
			  })
			: stages.findIndex((block) => {
					// user woke up during this block
					return coreSleepEnd >= Date.parse(block.start) && coreSleepEnd <= Date.parse(block.end);
			  });
		if (draft[endBlockIndex]) {
			draft[endBlockIndex].end = didNap ? napTimings[napTimings.length - 1][1] : new Date(coreSleepEnd).toISOString();
		}
	});
}

/**
 * Return the phases of sleep for the given metrics
 */
export const createSleepStagesGetter =
	(_: string) =>
	(data: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>): DailySleepData => {
		const stages: Array<StageInfos<SleepStage>> = [];
		for (let i = 0; i < data.timeSeries.length; i++) {
			const block = data.timeSeries[i];
			if (hasMetric(MetricType.UserSleepStage)(block.metrics)) {
				const stage = getOrElse<number>(block.metrics, MetricType.UserSleepStage, 0);
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

		const hasCoreSleep = hasMetric(MetricType.UserCoreSleepBegin)(data.constant);
		const coreSleepTiming = hasCoreSleep
			? ([
					new Date(getOrElse<number>(data.constant, MetricType.UserCoreSleepBegin, 0) * 1000).toISOString(),
					new Date(getOrElse<number>(data.constant, MetricType.UserCoreSleepEnd, 0) * 1000).toISOString(),
			  ] as [string, string])
			: undefined;

		const totalMinutesSleepDuration = Number(data.constant[MetricType.UserDailyTotalSleepDuration]);
		const napTimings: Array<[string, string]> = getNaps(data);

		return {
			totalMinutesSleepDuration,
			stages: trimSleepStages({
				stages,
				userTimeToFallAsleep: getOrElse<number>(
					data.constant,
					MetricType.UserDailyCoreTimeToFallAsleep,
					30 * 60 * 1000
				),
				napTimings,
				coreSleepTiming,
			}),
			timeToFallASleep: getOrElse<number>(data.constant, MetricType.UserDailyCoreTimeToFallAsleep, 0),
			coreSleepTiming,
			napTimings,
			sleepStagesDuration: {
				[SleepStage.AWAKE]:
					hasMetric(MetricType.UserDailyAwakeStageDuration)(data.constant) &&
					hasMetric(MetricType.UserDailyPercAwakeStage)(data.constant)
						? {
								duration: getOrElse<number>(data.constant, MetricType.UserDailyAwakeStageDuration, 0),
								percent: getOrElse<number>(data.constant, MetricType.UserDailyPercAwakeStage, 0),
						  }
						: undefined,
				[SleepStage.REM]:
					hasMetric(MetricType.UserDailyREMStageDuration)(data.constant) &&
					hasMetric(MetricType.UserDailyPercREMStage)(data.constant)
						? {
								duration: getOrElse<number>(data.constant, MetricType.UserDailyREMStageDuration, 0),
								percent: getOrElse<number>(data.constant, MetricType.UserDailyPercREMStage, 0),
						  }
						: undefined,
				[SleepStage.LIGHT]:
					hasMetric(MetricType.UserDailyLightStageDuration)(data.constant) &&
					hasMetric(MetricType.UserDailyPercLightStage)(data.constant)
						? {
								duration: getOrElse<number>(data.constant, MetricType.UserDailyLightStageDuration, 0),
								percent: getOrElse<number>(data.constant, MetricType.UserDailyPercLightStage, 0),
						  }
						: undefined,
				[SleepStage.DEEP]:
					hasMetric(MetricType.UserDailyDeepStageDuration)(data.constant) &&
					hasMetric(MetricType.UserDailyPercDeepStage)(data.constant)
						? {
								duration: getOrElse<number>(data.constant, MetricType.UserDailyDeepStageDuration, 0),
								percent: getOrElse<number>(data.constant, MetricType.UserDailyPercDeepStage, 0),
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
	localISODay: string,
	modelField: {
		has(isoDay: string): boolean;
		get(isoDay: string): M | undefined;
	},
	setData: (data: T) => void,
	heavyComputation: (metrics: M) => T,
	fetchData: (localISODay: string) => void
) {
	const heavyComputationHandlerRef = useRef<HeavyComputationHandler>();
	useEffect(
		action(function () {
			const isLoaded = modelField.has(localISODay);
			if (isLoaded) {
				const metrics = modelField.get(localISODay);
				if (metrics) {
					setAfterHeavyComputation(setData, heavyComputation, heavyComputationHandlerRef, metrics);
				}
			} else {
				__DEV__ && console.log("[MEASURE: Action] FETCH daily measure");
				fetchData(localISODay);
				const dispose = reaction(
					// If this changes
					() => modelField.get(localISODay),
					// Launch heavy computation
					function (metrics) {
						if (metrics) {
							dispose();
							setAfterHeavyComputation(setData, heavyComputation, heavyComputationHandlerRef, metrics);
						}
					}
				);
			}
		}),
		[localISODay]
	);
}

/**
 * Return the nap time frames
 */
export const getNaps = (data: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>): Array<[string, string]> => {
	const napTimings: Array<[string, string]> = [];
	for (let i = 0; i < data.timeSeries.length; i++) {
		const currentBlock = data.timeSeries[i];
		if (hasMetric(MetricType.UserNapSleepBegin)(currentBlock)) {
			const startTime = new Date(
				getOrElse<number>(currentBlock.metrics, MetricType.UserNapSleepBegin, 0) * 1000
			).toISOString();
			// Find end block
			const endIndex = data.timeSeries.slice(i).findIndex((b) => b.metrics[MetricType.UserNapSleepEnd] !== null);
			const endTime =
				endIndex > -1
					? new Date(
							getOrElse<number>(data.timeSeries[i + endIndex].metrics, MetricType.UserNapSleepEnd, 0) * 1000
					  ).toISOString()
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
