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
	if (!stages.length) {
		return [];
	}
	// Update the first stage to reflect the start of the sleep
	return produce(stages, function (draft) {
		// Retrieve the phase where the core sleep begins
		const coreSleepStart = Date.parse(coreSleepFrame[0]);
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
