import { observable } from "micro-observables";
import { CalibrationApi } from "./calibrationApi";

export class CalibrationService {
	private _calibrationDaysLeft = observable(-1);

	calibrationDaysLeft = this._calibrationDaysLeft.readOnly();

	constructor(private readonly calibrationApi: CalibrationApi) {}

	async fetchCalibrationLeft() {
		const result = await this.calibrationApi.getCalibrationDaysLeft();
		this._calibrationDaysLeft.set(result);
	}
}
