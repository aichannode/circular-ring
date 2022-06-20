import { ActiveMode, CalibrationMode, DisabledMode, Mode } from "@ui/type";

export function isInActiveMode(mode: Mode): mode is ActiveMode {
	return mode.type === "active";
}

export function isInCalibrationMode(mode: Mode): mode is CalibrationMode {
	return mode.type === "calibration";
}

export function isInDisabledMode(mode: Mode): mode is DisabledMode {
	return mode.type === "disabled";
}

export function createActiveMode(): ActiveMode {
	return { type: "active" };
}

export function createCalibrationMode(nbRemainingDays: number): CalibrationMode {
	return { type: "calibration", nbRemainingDays };
}

export function createDisabledMode(): DisabledMode {
	return { type: "disabled" };
}

export function updateMode(prevMode: Mode, shouldDisabledMode: boolean) {
	if (shouldDisabledMode) {
		return createDisabledMode();
	}
	return prevMode;
}

export function getInitMode(
	nbRemainingDays: number,
	hasCompleteCoreSleep: boolean,
	{ allowDisabled = true, allowCalibration = true }: { allowDisabled?: boolean; allowCalibration?: boolean } = {}
): Mode {
	const isInCalibration = nbRemainingDays > 11;
	if (isInCalibration && allowCalibration) {
		return createCalibrationMode(nbRemainingDays);
	}
	if (!hasCompleteCoreSleep && allowDisabled) {
		return createDisabledMode();
	}
	return createActiveMode();
}

export interface TrimOptions {
	includes?: Array<[number, number]>;
	excludes?: Array<[number, number]>;
}

export function isInSomeIntervals(value: number, intervals: Array<[number, number]>): boolean {
	return intervals.some(([start, end]) => value >= start && value <= end);
}

export function trimData<T>(
	data: T[],
	getTimestampFromValue: (value: T) => number,
	{ excludes = [], includes = [] }: TrimOptions = {}
): T[] {
	const get = getTimestampFromValue;
	return data.filter((item) => {
		const timestamp = get(item);
		const isIncluded = includes.length === 0 || isInSomeIntervals(timestamp, includes);
		const isExcluded = isInSomeIntervals(timestamp, excludes);
		return isIncluded && !isExcluded;
	});
}
