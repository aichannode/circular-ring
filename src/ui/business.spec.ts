import {
	createActiveMode,
	createCalibrationMode,
	createDisabledMode,
	getInitMode,
	isInActiveMode,
	isInCalibrationMode,
	isInDisabledMode,
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
