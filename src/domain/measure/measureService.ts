import dayjs from "dayjs";
import { observable } from "micro-observables";
import { MeasureApi } from "./measureApi";
import {
	allDailyActivityGoalMetrics,
	alldailyActivityMetrics,
	allEnergyScoreGaugeMetrics,
	allEnergyScoreMetrics,
	allSleepQualityGaugeMetrics,
	allSleepQualityMetrics,
	Metric,
	MetricInfo,
} from "./metric";

export class MeasureService {
	private _activityData = observable<MetricInfo | null>(null);
	private _sleepQualityDailyData = observable<MetricInfo | null>(null);
	private _globalScore = observable<number | null>(null);
	private _wakeUpScore = observable<number | null>(null);

	readonly activityData = this._activityData.readOnly();
	readonly sleepQualityDailyData = this._sleepQualityDailyData.readOnly();
	readonly globalScore = this._globalScore.readOnly();
	readonly wakeUpScore = this._wakeUpScore.readOnly();

	constructor(private readonly measureApi: MeasureApi) {}

	async fetchActivityData() {
		const metrics = await this.fetchDailyMeasures([
			"user.daily.energy.score",
			...alldailyActivityMetrics,
			...allDailyActivityGoalMetrics,
			...allEnergyScoreMetrics,
			...allEnergyScoreGaugeMetrics,
		]);
		this._activityData.set(metrics);
	}

	async fetchSleepQualityDailyData() {
		const metrics = await this.fetchDailyMeasures([
			"user.daily.sleep.score",
			...allSleepQualityMetrics,
			...allSleepQualityGaugeMetrics,
		]);
		this._sleepQualityDailyData.set(metrics);
	}

	async fetchWakeUpScore() {
		const metrics = await this.fetchDailyMeasures(["user.daily.wake.up.score"]);
		this._wakeUpScore.set(metrics?.metrics["user.daily.wake.up.score"] ?? null);
	}

	async fetchGlobalScore() {
		const metrics = await this.fetchDailyMeasures(["user.daily.global.score"]);
		this._globalScore.set(metrics?.metrics["user.daily.global.score"] ?? null);
	}

	private async fetchDailyMeasures(measures: Metric[]): Promise<MetricInfo<Metric> | null> {
		const allMetrics = await this.measureApi.getMeasures(measures, dayjs().subtract(1, "day").toDate(), new Date());
		const lastMetric = allMetrics[allMetrics.length - 1] ?? null;
		return lastMetric;
	}
}
