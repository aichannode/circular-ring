import { CircleActivityData } from "@domain/circleActivity/circleActivityData";
import { observable } from "micro-observables";
import { CircleActivityApi } from "./circleActivityApi";

export class CircleActivityService {
	private _dailyData = observable<CircleActivityData | null>(null);

	readonly dailyData = this._dailyData.readOnly();

	constructor(private readonly circleActivityApi: CircleActivityApi) {}

	async fetchDailyData() {
		const result = await this.circleActivityApi.getDailyMetrics();
		this._dailyData.set(result);
	}
}
