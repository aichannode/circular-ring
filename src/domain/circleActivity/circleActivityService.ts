import { MeasureApi } from "@domain/measure/measureApi";
import {
	allDailyActivityGoalMetrics,
	alldailyActivityMetrics,
	allEnergyScoreGaugeMetrics,
	allEnergyScoreMetrics,
	MetricInfo,
} from "@domain/measure/metric";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export class CircleActivityService {
	private _dailyData = observable<MetricInfo | null>(null);

	readonly dailyData = this._dailyData.readOnly();

	constructor(private readonly measureApi: MeasureApi) {}

	async fetchDailyData() {
		const allMetrics = await this.measureApi.getMeasures(
			[
				...alldailyActivityMetrics,
				...allDailyActivityGoalMetrics,
				...allEnergyScoreMetrics,
				...allEnergyScoreGaugeMetrics,
			],
			dayjs().subtract(1, "day").toDate(),
			new Date()
		);
		const lastMetric = allMetrics[allMetrics.length - 1] ?? null;
		this._dailyData.set(lastMetric);
	}
}
