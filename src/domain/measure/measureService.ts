import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
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
	private logger = getLogger("📊 MeasureService");

	private _activityData = observable<MetricInfo | null>(null);
	private _sleepQualityDailyData = observable<MetricInfo | null>(null);
	private _wakeUpScore = observable<number | null>(null);

	readonly activityData = this._activityData.readOnly();
	readonly sleepQualityDailyData = this._sleepQualityDailyData.readOnly();
	readonly wakeUpScore = this._wakeUpScore.readOnly();

	dailyGlobalScores = new Store((day) => this.fetchGlobalScore(day), "date");

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

	async fetchGlobalScore(day?: string) {
		const metrics = await this.fetchDailyMeasures(["user.daily.global.score"], day ? new Date(day) : undefined);
		if (!metrics || !metrics.metrics["user.daily.global.score"]) {
			this.logger.error("Error: global score metrics are empty");
			throw Error("No global score metrics");
		}

		return {
			date: dayjs(metrics.timestamp).format("YYYY-MM-DD"),
			score: metrics.metrics["user.daily.global.score"],
		};
	}

	async fetchMonthGlobalScores(firstDayOfMonth: Date) {
		const allMetrics = await this.measureApi.getMeasures(
			["user.daily.global.score"],
			firstDayOfMonth,
			dayjs(firstDayOfMonth).endOf("month").toDate()
		);
		this.dailyGlobalScores.merge(
			allMetrics.map(({ timestamp, metrics }) => ({
				date: dayjs(timestamp).format("YYYY-MM-DD"),
				score: metrics["user.daily.global.score"] ?? 0,
			}))
		);
	}

	private async fetchDailyMeasures(measures: Metric[], date?: Date): Promise<MetricInfo<Metric> | null> {
		const allMetrics = await this.measureApi.getMeasures(
			measures,
			date ? dayjs(date).startOf("day").toDate() : dayjs().subtract(1, "day").toDate(),
			date ? dayjs(date).endOf("day").toDate() : new Date()
		);
		const lastMetric = allMetrics[allMetrics.length - 1] ?? null;
		return lastMetric;
	}
}
