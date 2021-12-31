import { Store } from "@betomorrow/micro-stores";
import { getLogger } from "@core/logger/logger";
import moment from "moment";
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
import { DailyActivityPhase, DailySleepPhase, DurationInfos } from "./type";

export class MeasureService {
	private logger = getLogger("📊 MeasureService");

	private _wakeUpScore = observable<number | null>(null);

	readonly wakeUpScore = this._wakeUpScore.readOnly();

	activityData = new Store((day) => this.fetchActivityData(day), "date");
	sleepQualityData = new Store((day) => this.fetchSleepQualityDailyData(day), "date");
	dailyGlobalScores = new Store((day) => this.fetchGlobalScore(day), "date");
	sleepDurationInfos = new Store((day) => this.fetchSleepDurationInfos(day), "date");
	activityDurationInfos = new Store((day) => this.fetchActivityDurationInfos(day), "date");
	
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
		return { date: moment(metrics.timestamp).format("YYYY-MM-DD"), data: metrics };
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
		return { date: moment(metrics.timestamp).format("YYYY-MM-DD"), data: metrics };
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
			date: moment(metrics.timestamp).format("YYYY-MM-DD"),
			score: metrics.metrics["user.daily.global.score"],
		};
	}

	async fetchMonthGlobalScores(firstDayOfMonth: Date) {
		const allMetrics = await this.measureApi.getMeasures(
			["user.daily.global.score"],
			firstDayOfMonth,
			moment(firstDayOfMonth).endOf("month").toDate()
		);
		this.dailyGlobalScores.merge(
			allMetrics.map(({ timestamp, metrics }) => ({
				date: moment(timestamp).format("YYYY-MM-DD"),
				score: metrics["user.daily.global.score"] ?? 0,
			}))
		);
	}

	private async fetchDailyMeasures(measures: Metric[], date?: Date): Promise<MetricInfo | null> {
		const allMetrics = await this.measureApi.getLastMesures(
			measures,
			date ? moment(date).startOf("day").toDate() : moment().subtract(1, "day").toDate(),
			date ? moment(date).endOf("day").toDate() : new Date()
		);
		return {
			timestamp: date?.toISOString() ?? new Date().toISOString(),
			metrics: allMetrics
		};
	}

	async fetchActivityDurationInfos(ymdDay?: string) {
		const allMetrics = await this.measureApi.getMeasures(
			[
				"user.start.of.sport",
				"user.end.of.sport",
				"user.non.active.activity",
				"user.low.intensity.activity",
				"user.medium.intensity.activity",
				"user.high.intensity.activity"
			],
			moment(ymdDay).subtract(1, "day").toDate(),
			ymdDay ? new Date(ymdDay) : new Date()
		);

		const activityDurationInfos = getDurationInfos<DailyActivityPhase>(allMetrics);
		return { date: ymdDay ?? moment().format("YYYY-MM-DD"), infos: activityDurationInfos };
	}

	async fetchSleepDurationInfos(ymdDay?: string) {
		const allMetrics = await this.measureApi.getMeasures(
			["user.daily.total.sleep.duration", "user.sleep.stage", "user.sleep.napping"],
			moment(ymdDay).subtract(1, "day").toDate(),
			ymdDay ? new Date(ymdDay) : new Date()
		);

		const sleepDurationInfos = getDurationInfos<DailySleepPhase>(allMetrics);
		return { date: ymdDay ?? moment().format("YYYY-MM-DD"), infos: sleepDurationInfos };
	}
}

function getDurationInfos<T extends DailySleepPhase | DailyActivityPhase, K extends Metric = Metric>(
	allMetrics: MetricInfo<K>[]
): DurationInfos<T> {
	return (allMetrics[0].metrics as any)["user.start.of.sport"] // TODO implement algorithm
		? {
			totalDuration: 9 * 60 + 23,
			dailyPhaseInfos: [
				{
					phase: DailyActivityPhase.SEDENTARY as T,
					start: moment().hour(0).minutes(0).toDate(),
					end: moment().hour(11).minutes(55).toDate(),
				},
				{
					phase: DailyActivityPhase.LOW as T,
					start: moment().hour(11).minutes(55).toDate(),
					end: moment().hour(12).minutes(10).toDate()
				},
				{
					phase: DailyActivityPhase.MEDIUM as T,
					start: moment().hour(12).minutes(10).toDate(),
					end: moment().hour(12).minutes(40).toDate(),
				},
				{
					phase: DailyActivityPhase.HIGH as T,
					start: moment().hour(12).minutes(40).toDate(),
					end: moment().hour(12).minutes(55).toDate()
				},
				{
					phase: DailyActivityPhase.MEDIUM as T,
					start: moment().hour(12).minutes(55).toDate(),
					end: moment().hour(13).minutes(11).toDate()
				},
				{
					phase: DailyActivityPhase.LOW as T,
					start: moment().hour(13).minutes(11).toDate(),
					end: moment().hour(13).minutes(30).toDate()
				},
				{
					phase: DailyActivityPhase.SEDENTARY as T,
					start: moment().hour(13).minutes(30).toDate(),
					end: moment().hour(18).minutes(0).toDate(),
				},
				{
					phase: DailyActivityPhase.LOW as T,
					start: moment().hour(18).minutes(0).toDate(),
					end: moment().hour(18).minutes(20).toDate()
				},
				{
					phase: DailyActivityPhase.SEDENTARY as T,
					start: moment().hour(18).minutes(20).toDate(),
					end: moment().hour(20).minutes(0).toDate()
				}
			]
		}: {
			totalDuration: 9 * 60 + 23,
			dailyPhaseInfos: [
				
				{
					phase: DailySleepPhase.SLEEP as T,
					start: moment().subtract(1, "day").hour(23).toDate(),
					end: moment().hour(1).toDate(),
				},
				{
					phase: DailySleepPhase.DISTURBANCE as T,
					start: moment().hour(1).toDate(),
					end: moment().hour(2).toDate(),
				},
				{
					phase: DailySleepPhase.SLEEP as T,
					start: moment().hour(2).toDate(),
					end: moment().hour(6).minute(0).toDate(),
				},
				{
					phase: DailySleepPhase.AWAKE as T,
					start: moment().hour(6).minute(0).toDate(),
					end: moment().hour(14).toDate(),
				},
				{
					phase: DailySleepPhase.NAP as T,
					start: moment().hour(14).toDate(),
					end: moment().hour(15).toDate(),
				},
				{
					phase: DailySleepPhase.AWAKE as T,
					start: moment().hour(15).toDate(),
					end: moment().hour(19).toDate(),
				},
			],
		};
}
