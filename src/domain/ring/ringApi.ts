import { delay } from "@core/utils";

export class RingApi {
	// constructor(private readonly apiService: ApiService) {}

	async sendData(rawData: string) {
		// return this.apiService.post(``, rawData);
		return delay(3000);
	}
}
