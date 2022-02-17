import { CircleEntity } from "@domain/circles/type";
import { ApiService } from "@core/api/apiService";

export class CirclesApi {
	constructor(private readonly apiService: ApiService) {}

	async getAllCircles() {
		const allCirlces = await this.apiService.get<CircleEntity[]>("/circle/all");
		return allCirlces.data;
	}

	async getUserCircles() {
		const userCircles = await this.apiService.get<CircleEntity[]>("/circle");
		return userCircles.data;
	}

	async removeUserCircle(circleId: number) {
		return await this.apiService.delete(`/circle?circleId=${circleId.toString()}`);
	}

	async addUserCircle(circleId: number) {
		return await this.apiService.post(`/circle?circleId=${circleId.toString()}`);
	}
}
