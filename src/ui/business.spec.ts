import {
	createActiveMode,
	createCalibrationMode,
	createDisabledMode,
	getInitMode,
	isInActiveMode,
	isInCalibrationMode,
	isInDisabledMode,
	trimData,
	updateMode,
} from "./business";

test("active mode", function () {
	expect(isInActiveMode(createActiveMode())).toBeTruthy();
	expect(isInCalibrationMode(createActiveMode())).toBeFalsy();
	expect(isInDisabledMode(createActiveMode())).toBeFalsy();
});

test("disabled mode", function () {
	expect(isInDisabledMode(createDisabledMode())).toBeTruthy();
	expect(isInActiveMode(createDisabledMode())).toBeFalsy();
	expect(isInCalibrationMode(createDisabledMode())).toBeFalsy();
});

test("calibration mode", function () {
	expect(isInCalibrationMode(createCalibrationMode(0))).toBeTruthy();
	expect(isInDisabledMode(createCalibrationMode(0))).toBeFalsy();
	expect(isInActiveMode(createCalibrationMode(0))).toBeFalsy();
});

test("update mode", function () {
	expect(isInActiveMode(updateMode(createActiveMode(), false))).toBeTruthy();
	expect(isInDisabledMode(updateMode(createActiveMode(), true))).toBeTruthy();
	expect(isInDisabledMode(updateMode(createDisabledMode(), false))).toBeTruthy();
	expect(isInDisabledMode(updateMode(createDisabledMode(), true))).toBeTruthy();
	expect(isInCalibrationMode(updateMode(createCalibrationMode(0), false))).toBeTruthy();
	expect(isInDisabledMode(updateMode(createCalibrationMode(0), true))).toBeTruthy();
});

test("get init mode", function () {
	expect(getInitMode(0, true)).toEqual(createActiveMode());
	expect(getInitMode(0, false)).toEqual(createDisabledMode());
	expect(getInitMode(3, true)).toEqual(createCalibrationMode(3));
	expect(getInitMode(3, false)).toEqual(createCalibrationMode(3));
});

test("trimData", function () {
	const getTimestampFromValue = (x: number) => x;
	expect(trimData([], getTimestampFromValue)).toEqual([]);
	expect(trimData([0], getTimestampFromValue, { includes: [[0, 1]] })).toEqual([0]);
	expect(trimData([-2, -1, 0, 1, 2, 3], getTimestampFromValue, { includes: [[0, 1]] })).toEqual([0, 1]);
	expect(trimData([-2, -1, 0, 1, 2, 3], getTimestampFromValue, { excludes: [[0, 1]] })).toEqual([-2, -1, 2, 3]);
	expect(
		trimData([-2, -1, 0, 1, 2, 3], getTimestampFromValue, {
			includes: [
				[0, 1],
				[2, 3],
			],
		})
	).toEqual([0, 1, 2, 3]);
	expect(
		trimData([-2, -1, 0, 1, 2, 3], getTimestampFromValue, {
			excludes: [
				[0, 1],
				[2, 3],
			],
		})
	).toEqual([-2, -1]);
	expect(trimData([-2, -1, 0, 1, 2, 3], getTimestampFromValue, { includes: [[-1, 2]], excludes: [[0, 1]] })).toEqual([
		-1, 2,
	]);
});
