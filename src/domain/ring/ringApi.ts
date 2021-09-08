import { delay } from "@core/utils";

export class RingApi {
	// constructor(private readonly apiService: ApiService) {}

	async sendData(rawData: string) {
		// return this.apiService.post(``, rawData);
		console.log("Fake Sending data...", rawData.length);
		return delay(3000);
	}
}
