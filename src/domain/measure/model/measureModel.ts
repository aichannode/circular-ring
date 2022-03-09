import { Model, mutate } from "@core/model";
import { action, IObservableArray, makeAutoObservable, observable } from "mobx";
import { getKeyFromDate } from "../common/business";
import { Proposal } from "../common/type";
import { Metrics, MetricType, RangeMetrics } from "../metric";
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
	DailySleepScoreMetrics,
	DailySleepStageDuration,
	SleepStagesMetrics,
} from "../representation/lib/type";

export class MeasureModel implements Model<Proposal> {
	public dailySleepScoreContributorsMetrics: Map<
		string,
		Metrics<
			| DailySleepScoreContributorsMetrics
			| DailySleepScoreContributorsMetricsGaugeSize
			| DailySleepScoreContributorsGaugeCalibrationMetrics
		>
	> = new Map();
	public dailyEnergyScoreContributorsMetrics: Map<
		string,
		Metrics<DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics>
	> = new Map();
	public dailySleepMetrics: Map<string, RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>> = new Map();
	public dailyEnergyScore: Map<string, number | undefined> = new Map();
	public dailyActivityIntensityMetrics: Map<
		string,
		RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>
	> = new Map();
	public dailyActivitiesMetrics: Map<string, Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals>> = new Map();
	public dailyGlobalScore: Map<string, number | undefined> = new Map();
	public dailySleepScore: Map<string, Record<DailySleepScoreMetrics, number>> = new Map();
	public lastAcceptedMutations: Proposal[] = [];

	constructor() {
		// Mark all the collections of object that does not need to be deeply observed
		makeAutoObservable<MeasureModel>(this, {
			dailyActivityIntensityMetrics: observable.shallow,
			dailySleepMetrics: observable.shallow,
			dailySleepScoreContributorsMetrics: observable.shallow,
			dailyEnergyScoreContributorsMetrics: observable.shallow,
			dailyActivitiesMetrics: observable.shallow,
			lastAcceptedMutations: observable.shallow,
			present: action,
		});
	}
	public present = (proposal: Proposal) => {
		(this.lastAcceptedMutations as IObservableArray).clear();
		proposal.forEach((mutation) => {
			if (mutation.type === "setDailyActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyActivityIntensityMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.range)
				);
			} else if (mutation.type === "setDailySleepMetrics") {
				mutate.call(this, mutation, () =>
					this.dailySleepMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.range)
				);
			} else if (mutation.type === "setGlobalScore") {
				mutate.call(this, mutation, () =>
					this.dailyGlobalScore.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.score)
				);
			} else if (mutation.type === "setSleepScore") {
				mutate.call(this, mutation, () =>
					this.dailySleepScore.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			} else if (mutation.type === "setDailyActivitiesMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyActivitiesMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			} else if (mutation.type === "setDailyEnergyScoreContributorsMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyEnergyScoreContributorsMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			} else if (mutation.type === "setDailySleepScoreContributorsMetrics") {
				mutate.call(this, mutation, () =>
					this.dailySleepScoreContributorsMetrics.set(getKeyFromDate(mutation.payload.isoDate), mutation.payload.data)
				);
			}
		});
	};
}
