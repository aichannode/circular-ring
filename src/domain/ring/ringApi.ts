import { delay } from "@core/utils";

export class RingApi {
	// constructor(private readonly apiService: ApiService) {}

	sendData(rawData: string) {
		// return this.apiService.post(``, rawData);
		return delay(3000);
	}
}
