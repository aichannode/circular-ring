import { StageInfos } from "@domain/measure/representation/type";
import { ActivityStage, SleepStage } from "@domain/measure/type";
import moment from "moment";

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
		const stageStart = moment(stage.start);
		const stageEnd = moment(stage.end);
		const stageDuration = moment.duration(stageEnd.diff(stageStart)).valueOf();
		const sampleSize = to - from;
		// The stage is smaller than the sample buffer
		if (stageDuration < sampleSize) {
			// The sample buffer contains the start of the stage but not the end
			if (moment(stage.start).isBetween(from, to) && !moment(stage.end).isBetween(from, to)) {
				intersections.push({
					index: i,
					from: stage.start,
					to, // We will take into account the end time of the sample
				});
			}

			// The sample buffer contains the end of the stage but not the start
			if (!moment(stage.start).isBetween(from, to) && moment(stage.end).isBetween(from, to)) {
				intersections.push({
					index: i,
					from, // We will take into account the start time of the sample
					to: stage.end,
				});
			}
			// The sample buffer contains the whole stage
			if (moment(stage.start).isBetween(from, to) && moment(stage.end).isBetween(from, to)) {
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
			if (moment(from).isBetween(stage.start, stage.end) && !moment(to).isBetween(stage.start, stage.end)) {
				intersections.push({
					index: i,
					from,
					to: stage.end,
				});
			}

			// The stage contains the end of the sample buffer but not the start
			if (!moment(from).isBetween(stage.start, stage.end) && moment(to).isBetween(stage.start, stage.end)) {
				intersections.push({
					index: i,
					from: stage.start,
					to,
				});
			}
			// The stage contains the whole sample buffer
			if (moment(from).isBetween(stage.start, stage.end) && moment(to).isBetween(stage.start, stage.end)) {
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
	const sliceDuration = moment(to).diff(from);
	const intersections = getIntersections(stages, from, to)
		// Convert the intersections length to a percent of time of the sample
		.map((section) => ({
			value: stages[section.index].value,
			duration: moment(section.to).diff(section.from),
		}))
		.map(({ value, duration }) => ({
			value,
			percent: duration / sliceDuration,
		}));

	return intersections.reduce(function (average, sample) {
		return average + sample.value * sample.percent;
	}, 0);
}

export function sample<T extends SleepStage | ActivityStage>(
	stages: StageInfos<T>[],
	/** the sample size in ms with a minum of 1min */
	sampleSize: number
): Array<{ value: number; isoTime: string }> {
	const samples: Array<{ value: number; isoTime: string }> = [];
	if (!stages.length) {
		return samples;
	}
	const startOfActivity = moment(stages[0].start);
	const endOfActivty = moment(stages[stages.length - 1].end);
	const duration = moment.duration(endOfActivty.diff(startOfActivity)).asMilliseconds();
	const sampleNb = duration / sampleSize; // How many samples we need to do
	const segments = stages.map((stage) => ({
		value: stage.type,
		start: moment(stage.start).valueOf(),
		end: moment(stage.end).valueOf(),
	}));

	for (let i = 0; i < sampleNb; i++) {
		const from = moment(stages[0].start)
			.add(sampleSize * i)
			.valueOf();
		const to = moment(from).add(sampleSize).valueOf();
		samples.push({
			isoTime: moment(from).toISOString(),
			value: getAverage(segments, from, to),
		});
	}

	return samples;
}
