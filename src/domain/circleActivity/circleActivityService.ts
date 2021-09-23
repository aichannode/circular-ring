import { MeasureApi } from "@domain/measure/measureApi";
import { MetricInfo } from "@domain/measure/metric";
import dayjs from "dayjs";
import { observable } from "micro-observables";

export class CircleActivityService {
	private _dailyData = observable<MetricInfo | null>(null);

	readonly dailyData = this._dailyData.readOnly();

	constructor(private readonly measureApi: MeasureApi) {}

	async fetchDailyData() {
		const allMetrics = await this.measureApi.getMeasures(
			[
				"user.daily.steps",
				"user.daily.walking.equivalency",
				"user.daily.calories.burned",
				"user.daily.cardio.points",
				"user.daily.vo2max",
				"user.daily.awake.hr.max",
				"user.daily.score.recovery",
				"user.daily.wake.up.score",
				"user.daily.sleep.hrv",
				"user.daily.score.hrv",
				"user.daily.rhr",
				"user.daily.score.rhr",
				"user.daily.sleep.br",
				"user.score.daily.br",
				"user.daily.sleep.var.temperature",
				"user.score.daily.var.temperature",
				"user.2days.sleep.score",
				"user.daily.score.sleep.balance",
				"user.daily.score.activity.volume",
			],
			dayjs().subtract(1, "day").toDate(),
			new Date()
		);
		const lastMetric = allMetrics[allMetrics.length - 1] ?? null;
		this._dailyData.set(lastMetric);
	}
}
