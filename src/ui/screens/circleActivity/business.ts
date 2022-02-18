import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage, SleepStage } from "@domain/measure/type";

/**
 * Return the sections of the input segments array included in the given slide of time.
 */
function getIntersections(
	inputSegments: Array<{ start: number; end: number; value: number }>,
	/** the slice start */
	from: number,
	/** the slice stop */
	to: number
): Array<{ index: number; from: number; to: number }> {
	const intersections: Array<{ index: number; from: number; to: number }> = [];
	for (let i = 0; i < inputSegments.length; i++) {
		const stage = inputSegments[i];
		const stageStart = stage.start;
		const stageEnd = stage.end;
		const stageDuration = stageEnd - stageStart;
		const sampleSize = to - from;
		// The stage is smaller than the sample buffer
		if (stageDuration < sampleSize) {
			// The sample buffer contains the start of the stage but not the end
			if (stage.start > from && stage.start < to && !(stage.end > from && stage.end < to)) {
				intersections.push({
					index: i,
					from: stage.start,
					to, // We will take into account the end time of the sample
				});
			}

			// The sample buffer contains the end of the stage but not the start
			if (!(stage.start > from && stage.start < to) && stage.end > from && stage.end < to) {
				intersections.push({
					index: i,
					from, // We will take into account the start time of the sample
					to: stage.end,
				});
			}
			// The sample buffer contains the whole stage
			if (stage.start > from && stage.start < to && stage.end > from && stage.end < to) {
				intersections.push({
					index: i,
					from: stage.start,
					to: stage.end,
				});
			}
		}
		// The stage is wider than the sample buffer
		else {
			// The stage contains the start of the sample buffer but not the end
			if (from > stage.start && from < stage.end && !(to > stage.start && to < stage.end)) {
				intersections.push({
					index: i,
					from,
					to: stage.end,
				});
			}

			// The stage contains the end of the sample buffer but not the start
			if (!(from > stage.start && from < stage.end) && to > stage.start && to < stage.end) {
				intersections.push({
					index: i,
					from: stage.start,
					to,
				});
			}
			// The stage contains the whole sample buffer
			if (from > stage.start && from < stage.end && to > stage.start && to < stage.end) {
				intersections.push({
					index: i,
					from,
					to,
				});
			}
		}
	}
	return intersections;
}

/**
 * Return the average value of the given timed data
 * for the given slice of time
 *
 */
function getAverage(
	/** the data */
	stages: Array<{ start: number; end: number; value: number }>,
	/** the sampling index */
	from: number,
	/** the sample size in ms with a minum of 1min */
	to: number
): number {
	const sliceDuration = to - from;
	const intersections = getIntersections(stages, from, to)
		// Convert the intersections length to a percent of time of the sample
		.map((section) => ({
			value: stages[section.index].value,
			percent: (section.to - section.from) / sliceDuration,
		}));

	return intersections.reduce(function (average, sample) {
		return average + sample.value * sample.percent;
	}, 0);
}

export function sample<T extends SleepStage | ActivityStage>(
	stages: ReadonlyArray<StageInfos<T>>,
	/** the sample size in ms with a minum of 1min */
	sampleSize: number
): Array<{ value: number; isoTime: string }> {
	const samples: Array<{ value: number; isoTime: string }> = [];
	if (sampleSize < 1000) {
		console.warn(`[SAMPLING DATA] sample function need a sample size > 1000. Got ${sampleSize}`);
		return samples;
	}
	if (!stages.length) {
		return samples;
	}
	const startOfActivity = new Date(stages[0].start);
	const endOfActivty = new Date(stages[stages.length - 1].end);
	const duration = endOfActivty.getTime() - startOfActivity.getTime();
	const sampleNb = duration / sampleSize; // How many samples we need to do
	const segments = stages.map((stage) => ({
		value: stage.level,
		start: new Date(stage.start).getTime(),
		end: new Date(stage.end).getTime(),
	}));

	for (let i = 0; i < sampleNb; i++) {
		const from = startOfActivity.getTime() + sampleSize * i;
		const to = from + sampleSize;
		samples.push({
			isoTime: new Date(from).toISOString(),
			value: getAverage(segments, from, to), // todo remove already used segments
		});
	}
	return samples;
}
