import { observable } from "micro-observables";
import { CalibrationApi } from "./calibrationApi";

export class CalibrationService {
	private _calibrationDaysLeft = observable(-1);

	calibrationDaysLeft = this._calibrationDaysLeft.readOnly();

	constructor(private readonly calibrationApi: CalibrationApi) {}

	async reset() {
		this._calibrationDaysLeft.set(-1);
	}

	async fetchCalibrationLeft() {
		const result = await this.calibrationApi.FAKE_UNKNOWN_getCalibrationDaysLeft();
		this._calibrationDaysLeft.set(result);
	}
}
