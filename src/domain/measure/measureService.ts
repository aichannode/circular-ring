import { getLogger } from "@core/logger/logger";
import moment from "moment";
import { MeasureApi } from "./measureApi";
import { DailyActivityGoals, dailyActivityGoals, MetricType, RangeMetrics } from "./metric";
import { makeObservable, observable } from "mobx";
import { mutate } from "@core/store";
import {
	DailyActivityDetailsMetrics,
	DailyEnergyScoreMetrics,
	ActivityScoreGaugeMetrics,
	ActivityIntensityMetrics,
	dailyActivityDetailsMetrics,
	dailyEnergyScoreMetrics,
	activityIntensityMetrics,
	DailySleepDetailsMetrics,
	DailySleepDetailsGaugeMetrics,
	SleepStageMetrics,
	dailySleepDetailsMetrics,
	dailySleepDetailsGaugeMetrics,
	activityScoreGaugeMetrics,
	sleepStageMetrics,
} from "./representation/type";

const DAILY_KEY_FORMAT = "YYYY-MM-DD";

export function getKeyFromDate(date?: Date) {
	return moment(date).format(DAILY_KEY_FORMAT);
}

export class MeasureService {
	private logger = getLogger("📊 MeasureService");

	wakeUpScore = 0;
	globalScore = 0;
	dailyActivityMetrics: Map<
		string,
		RangeMetrics<
			| MetricType.UserDailyEnergyScore
			| DailyActivityDetailsMetrics
			| DailyActivityGoals
			| DailyEnergyScoreMetrics
			| ActivityScoreGaugeMetrics
		>
	> = new Map();
	dailyDailySleepDetailsMetrics: Map<
		string,
		RangeMetrics<MetricType.UserDailySleepScore | DailySleepDetailsMetrics | DailySleepDetailsGaugeMetrics>
	> = new Map();
	dailyEnergyScore: Map<string, number> = new Map();
	dailyGlobalScores: Map<string, number> = new Map();
	dailySleepLevelMetrics: Map<string, RangeMetrics<SleepStageMetrics>> = new Map();
	dailyActivityIntensityMetrics: Map<string, RangeMetrics<ActivityIntensityMetrics>> = new Map();
	dailySleepDuration: Map<string, number> = new Map();

	constructor(private readonly measureApi: MeasureApi) {
		// TODO make those observable private
		makeObservable(this, {
			wakeUpScore: observable,
			globalScore: observable,
			dailyActivityMetrics: observable,
			dailyDailySleepDetailsMetrics: observable,
			dailyGlobalScores: observable,
			dailySleepLevelMetrics: observable,
			dailyActivityIntensityMetrics: observable,
			dailySleepDuration: observable,
		});
	}

	async fetchDailyActivityData(isoDate?: string) {
		const key = moment(isoDate).format(DAILY_KEY_FORMAT);
		const range: RangeMetrics<
			DailyActivityDetailsMetrics | DailyActivityGoals | DailyEnergyScoreMetrics | ActivityScoreGaugeMetrics
		> = await this.fetchDailyMeasures(
			[...dailyActivityDetailsMetrics, ...dailyActivityGoals, ...dailyEnergyScoreMetrics, ...activityScoreGaugeMetrics],
			isoDate ? moment(isoDate).toDate() : undefined
		);

		mutate(() => {
			this.dailyActivityMetrics.set(key, range);
		});
	}

	async fetchDailyDailySleepDetailsMetrics(isoDay?: string) {
		const key = moment(isoDay).format(DAILY_KEY_FORMAT);
		const range: RangeMetrics<DailySleepDetailsMetrics | DailySleepDetailsGaugeMetrics> = await this.fetchDailyMeasures(
			[...dailySleepDetailsMetrics, ...dailySleepDetailsGaugeMetrics],
			isoDay ? moment(isoDay).toDate() : undefined
		);

		mutate(() => {
			this.dailyDailySleepDetailsMetrics.set(key, range);
		});
	}

	async fetchWakeUpScore() {
		const range = await this.fetchDailyMeasures([MetricType.UserDailySleepQualityScore]);
		const scoreMetrics = range.reverse().find((data) => MetricType.UserDailySleepQualityScore in data.metrics);

		mutate(() => {
			this.wakeUpScore = scoreMetrics?.metrics[MetricType.UserDailySleepQualityScore] ?? 0;
		});
	}

	async fetchDailyEnergyScore(isoDay?: string) {
		const key = moment(isoDay).format(DAILY_KEY_FORMAT);
		const range = await this.fetchDailyMeasures([MetricType.UserDailyEnergyScore]);
		const scoreMetrics = range.reverse().find((data) => MetricType.UserDailyEnergyScore in data.metrics);

		mutate(() => {
			this.dailyEnergyScore.set(key, scoreMetrics?.metrics[MetricType.UserDailyEnergyScore] ?? 0);
		});
	}

	async fetchGlobalScore(isoDay?: string) {
		const range = await this.fetchDailyMeasures([MetricType.UserDailyGlobalScore], moment(isoDay).toDate());
		const scoreMetrics = range.reverse().find((data) => MetricType.UserDailyGlobalScore in data.metrics);

		mutate(() => {
			this.globalScore = scoreMetrics?.metrics[MetricType.UserDailyGlobalScore] ?? 0;
		});
	}

	async fetchMonthGlobalScores(isoFirstDayOfMonth: Date) {
		const lastDay = moment(isoFirstDayOfMonth).endOf("month").toDate();

		const range = await this.measureApi.getMeasures([MetricType.UserDailyGlobalScore], isoFirstDayOfMonth, lastDay);
		mutate(() => {
			// Merge each metrics day by day
			// If multiple metrics are bound to the same day
			// Select the last of each day.
			range.forEach((datedMetrics) => {
				const key = getKeyFromDate(moment(datedMetrics.timestamp).toDate());
				const value = datedMetrics.metrics["user.daily.global.score"];
				if (value) {
					this.dailyGlobalScores.set(key, value);
				} else {
					this.logger.warn(
						`${MetricType.UserDailyGlobalScore} has not been found for the date ${datedMetrics.timestamp}`
					);
				}
			});
		});
	}

	private async fetchDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay?: Date
	): Promise<RangeMetrics> {
		return await this.measureApi.getMeasures(
			measures,
			isoDay ? moment(isoDay).startOf("day").toDate() : moment().subtract(1, "day").toDate(),
			isoDay ? moment(isoDay).endOf("day").toDate() : moment().toDate()
		);
	}

	public async fetchDailyActivityIntensityMetrics(isoDay: Date = moment().toDate()) {
		const key = moment(isoDay).format(DAILY_KEY_FORMAT);
		const allMetrics = await this.fetchDailyMeasures(activityIntensityMetrics, isoDay);

		mutate(() => {
			this.dailyActivityIntensityMetrics?.set(key, allMetrics);
		});
	}

	public async fetchDailySleepDurationMetrics(date: Date = moment().toDate()) {
		const key = moment(date).format(DAILY_KEY_FORMAT);
		const allMetrics = await this.fetchDailyMeasures(sleepStageMetrics, date);

		mutate(() => {
			this.dailySleepLevelMetrics?.set(key, allMetrics);
		});
	}
}
