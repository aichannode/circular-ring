import { MetricType, RangeMetrics } from "../metric";
import { makeAutoObservable, observable } from "mobx";
import { IModel, mutate } from "@core/model";
import { DailyActivityIntensityMetrics, DailySleepStageDuration } from "../representation/lib/type";
import { getKeyFromDate } from "../common/business";
import { Proposal } from "../common/type";

export class MeasureModel implements IModel<Proposal> {
	private _dailySleepMetrics: Map<string, RangeMetrics<MetricType.UserSleepStage, DailySleepStageDuration>> = new Map();
	public get dailySleepMetrics(): {
		get: (isoDate: string) => RangeMetrics<MetricType.UserSleepStage, DailySleepStageDuration> | undefined;
		has: (isoDate: string) => boolean;
		keys: () => IterableIterator<string>;
		values: () => IterableIterator<number | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailySleepMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailySleepMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailyGlobalScore.keys,
			values: this._dailyGlobalScore.values,
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
		values: () => IterableIterator<number | undefined>;
	} {
		return {
			get: (isoDate: string) => this._dailyActivityIntensityMetrics.get(getKeyFromDate(isoDate)),
			has: (isoDate: string) => this._dailyActivityIntensityMetrics.has(getKeyFromDate(isoDate)),
			keys: this._dailyGlobalScore.keys,
			values: this._dailyGlobalScore.values,
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
			}
		});
	};
}
