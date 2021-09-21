import { ApiService } from "@core/api/apiService";
import { delay } from "@core/utils";

export class CalibrationApi {
	constructor(private readonly apiService: ApiService) {}

	async FAKE_UNKNOWN_getCalibrationDaysLeft() {
		await delay(1000);
		return 14;
		this.apiService;
	}
}
