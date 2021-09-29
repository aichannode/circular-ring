import { MeasureApi } from "@domain/measure/measureApi";
import { allSleepQualityGaugeMetrics, allSleepQualityMetrics, MetricInfo } from "@domain/measure/metric";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export class CircleSleepService {
	private _sleepQualityDailyData = observable<MetricInfo | null>(null);
	readonly sleepQualityDailyData = this._sleepQualityDailyData.readOnly();

	constructor(private readonly measureApi: MeasureApi) {}

	async fetchSleepQualityDailyData() {
		const allMetrics = await this.measureApi.getMeasures(
			[...allSleepQualityMetrics, ...allSleepQualityGaugeMetrics],
			dayjs().subtract(1, "day").toDate(),
			new Date()
		);

		const lastMetric = allMetrics[allMetrics.length - 1] ?? null;
		this._sleepQualityDailyData.set(lastMetric);
	}
}
