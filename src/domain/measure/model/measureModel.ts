import { Model, mutate } from "@core/model";
import { ISODay } from "@domain/common/type";
import { action, IObservableArray, makeAutoObservable, observable } from "mobx";
import { Proposal } from "../common/type";
import { Metrics, MetricType, RangeMetrics } from "../metric";
import {
	CaloriesBurned,
	CardioPoints,
	ContributorActivityVolume,
	ContributorAwakeDuration,
	ContributorBodyRecovery,
	ContributorBRScore,
	ContributorCircadianRhythm,
	ContributorDailyTranquility,
	ContributorDeepSleepuration,
	ContributorHRV,
	ContributorRealSleepDuration,
	ContributorREMDuration,
	ContributorRHR,
	ContributorSleepBalance,
	ContributorSleepDebt,
	ContributorSleepQuality,
	ContributorSPO2,
	ContributorTimeToFallAsleep,
	ContributorVarTemperature,
	ContributorWakeUpScore,
	DailyActivityIntensityMetrics,
	DailyHRConstantMetrics,
	DailyHRTimeSeriesMetrics,
	DailySleepScoreMetrics,
	DailySleepStageDuration,
	SleepStagesMetrics,
	StepsTaken,
	WalkingEquivalency,
} from "../representation/lib/type";

export class MeasureModel implements Model<Proposal> {
	public dailyHRMetrics: Map<ISODay, RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics> | undefined> =
		new Map();
	public dailySleepScoreContributorsMetrics: Map<
		ISODay,
		Metrics<
			| ContributorAwakeDuration
			| ContributorRealSleepDuration
			| ContributorDailyTranquility
			| ContributorCircadianRhythm
			| ContributorREMDuration
			| ContributorDeepSleepuration
			| ContributorTimeToFallAsleep
			| ContributorSleepDebt
		>
	> = new Map();
	public dailyEnergyScoreContributorsMetrics: Map<
		ISODay,
		Metrics<
			| ContributorBodyRecovery
			| ContributorWakeUpScore
			| ContributorBRScore
			| ContributorSPO2
			| ContributorHRV
			| ContributorRHR
			| ContributorVarTemperature
			| ContributorSleepQuality
			| ContributorSleepBalance
			| ContributorActivityVolume
		>
	> = new Map();
	public dailySleepMetrics: Map<ISODay, RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>> = new Map();
	public dailyEnergyScore: Map<ISODay, number | undefined> = new Map();
	public dailyActivityIntensityMetrics: Map<
		ISODay,
		RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>
	> = new Map();
	public dailyActivitiesMetrics: Map<
		ISODay,
		Metrics<
			| StepsTaken
			| WalkingEquivalency
			| CaloriesBurned
			| CardioPoints
			| MetricType.UserDailyVO2Max
			| MetricType.UserDailyAwakeHRMax
		>
	> = new Map();
	public dailyGlobalScore: Map<ISODay, number | undefined> = new Map();
	public dailySleepScore: Map<ISODay, Record<DailySleepScoreMetrics, number>> = new Map();
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
			if (mutation.type === "setDailyHRMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyActivityIntensityMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailySleepMetrics") {
				mutate.call(this, mutation, () =>
					this.dailySleepMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setGlobalScore") {
				mutate.call(this, mutation, () =>
					this.dailyGlobalScore.set(mutation.payload.localISODay, mutation.payload.score)
				);
			} else if (mutation.type === "setDailyEnergyScore") {
				mutate.call(this, mutation, () =>
					this.dailyEnergyScore.set(mutation.payload.localISODay, mutation.payload.score)
				);
			} else if (mutation.type === "setSleepScore") {
				mutate.call(this, mutation, () =>
					this.dailySleepScore.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "setDailyActivitiesMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyActivitiesMetrics.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "setDailyEnergyScoreContributorsMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyEnergyScoreContributorsMetrics.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "setDailySleepScoreContributorsMetrics") {
				mutate.call(this, mutation, () =>
					this.dailySleepScoreContributorsMetrics.set(mutation.payload.localISODay, mutation.payload.data)
				);
			}
		});
	};
}
