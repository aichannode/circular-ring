import { Metrics, MetricType, RangeMetrics } from "../metric";
import { makeAutoObservable, observable } from "mobx";
import { IModel, mutate } from "@core/model";
import {
	DailyActivitiesMetrics,
	DailyActivitiesMetricsGoals,
	DailyActivityIntensityMetrics,
	DailyEnergyScoreGaugeCalibrationMetrics,
	DailyEnergyScoreMetrics,
	DailyEnergyScoreMetricsGaugeSize,
	DailySleepScoreContributorsGaugeCalibrationMetrics,
	DailySleepScoreContributorsMetrics,
	DailySleepScoreContributorsMetricsGaugeSize,
	DailySleepStageDuration,
	SleepStagesMetrics,
} from "../representation/lib/type";
import { getKeyFromDate } from "../common/business";
import { Proposal } from "../common/type";

export class MeasureModel implements IModel<Proposal> {
	private _dailySleepScoreContributorsMetrics: Map<
		string,
		Metrics<
			| DailySleepScoreContributorsMetrics
			| DailySleepScoreContributorsMetricsGaugeSize
			| DailySleepScoreContributorsGaugeCalibrationMetrics
		>
	> = new Map();
	public get dailySleepScoreContributorsMetrics(): {
		get: (
			isoDate: string
		) =>
			| Metrics<
					| DailySleepScoreContributorsMetrics
					| DailySleepScoreContributorsMetricsGaugeSize
					| DailySleepScoreContributorsGaugeCalibrationMetrics
			  >
			| undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<
			| Metrics<
					| DailySleepScoreContributorsMetrics
					| DailySleepScoreContributorsMetricsGaugeSize
					| DailySleepScoreContributorsGaugeCalibrationMetrics
			  >
			| undefined
		>;
	} {
		return {
			get: (isoDate: string) => this._dailySleepScoreContributorsMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailySleepScoreContributorsMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailySleepScoreContributorsMetrics.keys,
			values: this._dailySleepScoreContributorsMetrics.values,
		};
	}
	private _dailyEnergyScoreContributorsMetrics: Map<
		string,
		Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics>
	> = new Map();
	public get dailyEnergyScoreContributorsMetrics(): {
		get: (
			isoDate: string
		) =>
			| Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics>
			| undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<
			| Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics>
			| undefined
		>;
	} {
		return {
			get: (isoDate: string) => this._dailyEnergyScoreContributorsMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyEnergyScoreContributorsMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailyEnergyScoreContributorsMetrics.keys,
			values: this._dailyEnergyScoreContributorsMetrics.values,
		};
	}
	private _dailySleepMetrics: Map<string, RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>> = new Map();
	public get dailySleepMetrics(): {
		get: (isoDate: string) => RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailySleepMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailySleepMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailySleepMetrics.keys,
			values: this._dailySleepMetrics.values,
		};
	}

	private _dailyEnergyScore: Map<string, number | undefined> = new Map();
	public get dailyEnergyScore(): {
		get: (isoDate: string) => number | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<number | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailyEnergyScore.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyEnergyScore.has(getKeyFromDate(isoDate)),
			keys: this._dailyEnergyScore.keys,
			values: this._dailyEnergyScore.values,
		};
	}

	private _dailyActivityIntensityMetrics: Map<
		string,
		RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>
	> = new Map();
	public get dailyActivityIntensityMetrics(): {
		get: (
			isoDate: string
		) => RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal> | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<
			RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal> | undefined
		>;
	} {
		return {
			get: (isoDate: string) => this._dailyActivityIntensityMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyActivityIntensityMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailyActivityIntensityMetrics.keys,
			values: this._dailyActivityIntensityMetrics.values,
		};
	}

	private _dailyActivitiesMetrics: Map<string, Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals>> =
		new Map();
	public get dailyActivitiesMetrics(): {
		get: (isoDate: string) => Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals> | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals> | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailyActivitiesMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyActivitiesMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailyActivitiesMetrics.keys,
			values: this._dailyActivitiesMetrics.values,
		};
	}

	private _dailyGlobalScore: Map<string, number | undefined> = new Map();
	public get dailyGlobalScore(): {
		get: (isoDate: string) => number | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<number | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailyGlobalScore.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyGlobalScore.has(getKeyFromDate(isoDate)),
			keys: this._dailyGlobalScore.keys,
			values: this._dailyGlobalScore.values,
		};
	}
	private _dailySleepScore: Map<string, number | undefined> = new Map();
	public get dailySleepScore(): {
		get: (isoDate: string) => number | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<number | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailySleepScore.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailySleepScore.has(getKeyFromDate(isoDate)),
			keys: this._dailySleepScore.keys,
			values: this._dailySleepScore.values,
		};
	}
	constructor() {
		makeAutoObservable<MeasureModel, "_dailyActivityIntensityMetrics" | "_dailySleepMetrics">(this, {
			_dailyActivityIntensityMetrics: observable.shallow,
			_dailySleepMetrics: observable.shallow,
		});
	}

	public present = (proposal: Proposal) => {
		proposal.forEach((mutation) => {
			if (mutation.type === "setDailyActivityIntensityMetrics") {
				mutate(() =>
					this._dailyActivityIntensityMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.range)
				);
			} else if (mutation.type === "setDailySleepMetrics") {
				mutate(() => this._dailySleepMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.range));
			} else if (mutation.type === "setGlobalScore") {
				mutate(() => this._dailyGlobalScore.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.score));
			} else if (mutation.type === "setSleepScore") {
				mutate(() => this._dailySleepScore.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.score));
			} else if (mutation.type === "setDailyActivitiesMetrics") {
				mutate(() => this._dailyActivitiesMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data));
			} else if (mutation.type === "setDailyEnergyScoreContributorsMetrics") {
				mutate(() =>
					this._dailyEnergyScoreContributorsMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			} else if (mutation.type === "setDailySleepScoreContributorsMetrics") {
				mutate(() =>
					this._dailySleepScoreContributorsMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			}
		});
	};
}
