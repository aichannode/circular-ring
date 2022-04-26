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

export function getInitMode(nbRemainingDays: number, hasCompleteCoreSleep: boolean): Mode {
	const isInCalibration = nbRemainingDays > 0;
	if (isInCalibration) {
		return createCalibrationMode(nbRemainingDays);
	}
	if (!hasCompleteCoreSleep) {
		return createDisabledMode();
	}
	return createActiveMode();
}
