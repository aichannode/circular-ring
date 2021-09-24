import { ApiService } from "@core/api/apiService";
import { delay } from "@core/utils";
import { UserRing } from "./ring";

const ringApiBaseUrl = "/rings";
export class RingApi {
	constructor(private readonly apiService: ApiService) {}

	async getRings() {
		const result = await this.apiService.get<UserRing[]>(`${ringApiBaseUrl}`);
		return result.data;
	}

	async addRing(ring: PostUserRing) {
		console.log("Add ring", ring);
		const result = await this.apiService.post<UserRing>(`${ringApiBaseUrl}`, ring);
		return result.data;
	}
	deleteRing(ringId: string) {
		return this.apiService.delete(`${ringApiBaseUrl}/${ringId}`);
	}

	async sendData(rawData: string) {
		// return this.apiService.post(``, rawData);
		console.log("Fake Sending data...", rawData.length);
		return delay(3000);
	}
}

type PostUserRing = Omit<UserRing, "userId" | "lastSyncDate">;
