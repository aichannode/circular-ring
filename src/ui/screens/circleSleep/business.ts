import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import produce from "immer";
import moment from "moment";
import { HypnogramData, Steps } from "./hypnogram";

export function toStepsData(hypnogramData: HypnogramData): Steps {
	return hypnogramData.flatMap((stage) => [
		// Start point
		{ x: moment(stage.start).valueOf(), y: Number(stage.level) },
		// End point
		{ x: moment(stage.end).valueOf(), y: Number(stage.level) },
	]);
}

/**
 * Return the period of stages without the first/last awake period
 * Spec for sleep stages
 * - the data begins at user.core.sleep.begin minus user.time.to.fall.asleep
 * - the data ends after naps if any
 */
export function trimSleepStages({
	stages,
	isoDay,
	coreSleepFrame,
	napFrames = [],
	userTimeToFallAsleep = 30 * 60 * 1000,
}: {
	stages: StageInfos<SleepStage>[];
	isoDay: string;
	coreSleepFrame?: [string, string];
	napFrames?: Array<[string, string]>;
	userTimeToFallAsleep?: number;
}) {
	if (coreSleepFrame === undefined) {
		return stages;
	}
	// First, remove all awake period before core sleep
	const splitedStages =
		stages.slice(
			coreSleepFrame
				? stages.findIndex((block) => moment(coreSleepFrame[0]).isBetween(block.start, block.end, undefined, "[)"))
				: stages.findIndex((block) =>
						moment(moment(isoDay).startOf("day")).isBetween(block.start, block.end, undefined, "[)")
				  )
		) || [];

	// Update the first stage to reflect the start of the sleep
	return produce(splitedStages, function (draft) {
		// Start of sleep
		const coreSleepStart = Date.parse(coreSleepFrame[0]);
		const start = new Date(coreSleepStart - userTimeToFallAsleep * 60).toISOString();

		if (draft[0]?.start) {
			draft[0].start = start;
		}

		// End of sleep. We need to take nap in account
		const coreSleepEnd = Date.parse(coreSleepFrame[1]);
		const didNap = napFrames.length;
		const endBlockIndex = didNap
			? stages.findIndex((block) => {
					const napEnd = napFrames[napFrames.length - 1][1];
					// user woke up during this block
					return Date.parse(napEnd) >= Date.parse(block.start) && Date.parse(napEnd) <= Date.parse(block.end);
			  })
			: stages.findIndex((block) => {
					// user woke up during this block
					return coreSleepEnd >= Date.parse(block.start) && coreSleepEnd <= Date.parse(block.end);
			  });
		if (draft[endBlockIndex]) {
			draft[endBlockIndex].end = didNap ? napFrames[napFrames.length - 1][1] : new Date(coreSleepEnd).toISOString();
		}
	});
}
