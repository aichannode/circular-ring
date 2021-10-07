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
import { DailyPhase, SleepDurationInfos } from "./sleep";

export class MeasureService {
	private logger = getLogger("📊 MeasureService");

	// private _activityData = observable<MetricInfo | null>(null);
	// private _sleepQualityDailyData = observable<MetricInfo | null>(null);
	private _wakeUpScore = observable<number | null>(null);
	private _sleepDurationInfos = observable<SleepDurationInfos | null>(null);

	// readonly activityData = this._activityData.readOnly();
	// readonly sleepQualityDailyData = this._sleepQualityDailyData.readOnly();
	readonly wakeUpScore = this._wakeUpScore.readOnly();
	readonly sleepDurationInfos = this._sleepDurationInfos.readOnly();

	activityData = new Store((day) => this.fetchActivityData(day), "date");
	sleepQualityData = new Store((day) => this.fetchSleepQualityDailyData(day), "date");
	dailyGlobalScores = new Store((day) => this.fetchGlobalScore(day), "date");

	constructor(private readonly measureApi: MeasureApi) {}

	async fetchActivityData(ymdDay?: string) {
		const metrics = await this.fetchDailyMeasures(
			[
				"user.daily.energy.score",
				...alldailyActivityMetrics,
				...allDailyActivityGoalMetrics,
				...allEnergyScoreMetrics,
				...allEnergyScoreGaugeMetrics,
			],
			ymdDay ? new Date(ymdDay) : undefined
		);
		if (!metrics) {
			this.logger.error("Error: activity data metrics are empty for day", ymdDay);
			throw Error("No activity metrics");
		}
		return { date: dayjs(metrics.timestamp).format("YYYY-MM-DD"), data: metrics };
	}

	async fetchSleepQualityDailyData(ymdDay?: string) {
		const metrics = await this.fetchDailyMeasures(
			["user.daily.sleep.score", ...allSleepQualityMetrics, ...allSleepQualityGaugeMetrics],
			ymdDay ? new Date(ymdDay) : undefined
		);
		if (!metrics) {
			this.logger.error("Error: sleep data metrics are empty for day", ymdDay);
			throw Error("No sleep metrics");
		}
		return { date: dayjs(metrics.timestamp).format("YYYY-MM-DD"), data: metrics };
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

	async fetchSleepDurationInfos() {
		const allMetrics = await this.measureApi.getMeasures(
			["user.daily.total.sleep.duration", "user.sleep.stage", "user.sleep.napping"],
			dayjs().subtract(1, "day").toDate(),
			new Date()
		);

		const sleepDurationInfos = getDurationInfos(allMetrics);
		this._sleepDurationInfos.set(sleepDurationInfos);
	}
}

function getDurationInfos(
	allMetrics: MetricInfo<"user.sleep.stage" | "user.sleep.napping" | "user.daily.total.sleep.duration">[]
) {
	// Waiting for backend algorithm

	return {
		totalSleepDuration: 9 * 60 + 23,
		dailyPhaseInfos: [
			{
				phase: DailyPhase.LYING,
				start: dayjs().subtract(1, "day").hour(22).toDate(),
				end: dayjs().subtract(1, "day").hour(23).toDate(),
			},
			{
				phase: DailyPhase.SLEEP,
				start: dayjs().subtract(1, "day").hour(23).toDate(),
				end: dayjs().hour(1).toDate(),
			},
			{
				phase: DailyPhase.DISTURBANCE,
				start: dayjs().hour(1).toDate(),
				end: dayjs().hour(2).toDate(),
			},
			{
				phase: DailyPhase.SLEEP,
				start: dayjs().hour(2).toDate(),
				end: dayjs().hour(6).minute(0).toDate(),
			},
			{
				phase: DailyPhase.AWAKE,
				start: dayjs().hour(6).minute(0).toDate(),
				end: dayjs().hour(14).toDate(),
			},
			{
				phase: DailyPhase.NAP,
				start: dayjs().hour(14).toDate(),
				end: dayjs().hour(15).toDate(),
			},
			{
				phase: DailyPhase.AWAKE,
				start: dayjs().hour(15).toDate(),
				end: dayjs().hour(19).toDate(),
			},
		],
	};
}
