import { ApiService } from "@core/api/apiService";
import { delay } from "@core/utils";

export class CalibrationApi {
	constructor(private readonly apiService: ApiService) {}

	async getCalibrationDaysLeft() {
		await delay(1000);
		return 14;
	}
}
