import { Model, mutate } from "@core/model";
import { ISODay, ISOMonth } from "@domain/common/type";
import { action, IObservableArray, makeAutoObservable, observable } from "mobx";
import { Proposal } from "../common/type";
import { Metrics, MetricType, RangeMetrics } from "../metric";
import {
	ActivityIntensity7DAverageMetrics,
	ActivityIntensityAllAverageMetrics,
	CaloriesBurned,
	CardioPoints,
	CardioPointsConstantMetrics,
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
	DailyActivityIntensityDuration,
	DailyActivityIntensityMetrics,
	DailyBRConstantMetrics,
	DailyBRTimeSeriesMetrics,
	DailyHRConstantMetrics,
	DailyHRNightConstantMetrics,
	DailyHRNightTimeSeriesMetrics,
	DailyHRTimeSeriesMetrics,
	DailyHRTrendTimeSeriesMetrics,
	DailyHRVConstantMetrics,
	DailyHRVTimeSeriesMetrics,
	DailyHRVTrendTimeSeriesMetrics,
	DailySleepScoreMetrics,
	DailySleepStageDuration,
	DailySpo2ConstantMetrics,
	DailySpo2TimeSeriesMetrics,
	DailyWakeUpScoreMetrics,
	Sleep7DConstantMetrics,
	SleepAllConstantMetrics,
	SleepMonthlyStageMetrics,
	SleepStagesMetrics,
	StepsTaken,
	TemperatureVariationConstantMetrics,
	WalkingEquivalency,
} from "../representation/lib/type";

export class MeasureModel implements Model<Proposal> {
	public last7DSleepConstantMetrics: Map<ISODay, Metrics<Sleep7DConstantMetrics>> = new Map();
	public monthlySleepStageMetrics: Map<ISOMonth, Metrics<SleepMonthlyStageMetrics>> = new Map();
	public lastAllSleepStageMetrics: Map<ISOMonth, Metrics<SleepAllConstantMetrics>> = new Map();
	public dailyHRMetrics: Map<ISODay, RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics> | undefined> =
		new Map();
	public dailySpo2Metrics: Map<ISODay, RangeMetrics<DailySpo2TimeSeriesMetrics, DailySpo2ConstantMetrics> | undefined> =
		new Map();
	public dailyBRMetrics: Map<ISODay, RangeMetrics<DailyBRTimeSeriesMetrics, DailyBRConstantMetrics> | undefined> =
		new Map();
	public dailyHRVMetrics: Map<ISODay, RangeMetrics<DailyHRVTimeSeriesMetrics, DailyHRVConstantMetrics> | undefined> =
		new Map();
	public dailyHRNightMetrics: Map<
		ISODay,
		RangeMetrics<DailyHRNightTimeSeriesMetrics, DailyHRNightConstantMetrics> | undefined
	> = new Map();

	public dailyHRVTrendMetrics: Map<ISODay, RangeMetrics<DailyHRVTrendTimeSeriesMetrics, never> | undefined> = new Map();
	public dailyHRTrendMetrics: Map<ISODay, RangeMetrics<DailyHRTrendTimeSeriesMetrics, never> | undefined> = new Map();

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
	public dailyEnergyScore: Map<ISODay, number | null> = new Map();
	public last7DEnergyScore: Map<ISODay, number | null> = new Map();
	public last7DActivityIntensityAverageMetrics: Map<ISODay, Metrics<ActivityIntensity7DAverageMetrics>> = new Map();
	public dailyCardioPoints: Map<ISODay, number | null> = new Map();
	public dailyTemperatureVariation: Map<ISODay, number | null> = new Map();
	public last7DCardioPointConstants: Map<ISODay, Metrics<CardioPointsConstantMetrics>> = new Map();
	public last7DTemperatureVariationConstants: Map<ISODay, Metrics<TemperatureVariationConstantMetrics>> = new Map();
	public lastAllActivityIntensityAverageMetrics: Map<ISOMonth, Metrics<ActivityIntensityAllAverageMetrics>> = new Map();
	public dailyActivityIntensityMetrics: Map<
		ISODay,
		RangeMetrics<DailyActivityIntensityMetrics, DailyActivityIntensityDuration>
	> = new Map();
	public monthlyActivityIntensityMetrics: Map<ISOMonth, Metrics<ActivityIntensityAllAverageMetrics>> = new Map();
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
	public dailyGlobalScore: Map<ISODay, number | null> = new Map();
	public dailySleepScore: Map<ISODay, Metrics<DailySleepScoreMetrics>> = new Map();
	public dailyWakeUpScore: Map<ISODay, Metrics<DailyWakeUpScoreMetrics>> = new Map();

	public lastAcceptedMutations: Proposal[] = [];

	constructor() {
		// Mark all the collections of object that does not need to be deeply observed
		makeAutoObservable<MeasureModel>(this, {
			dailyActivityIntensityMetrics: observable.shallow,
			monthlyActivityIntensityMetrics: observable.shallow,
			dailySleepMetrics: observable.shallow,
			dailySleepScoreContributorsMetrics: observable.shallow,
			dailyEnergyScoreContributorsMetrics: observable.shallow,
			dailyActivitiesMetrics: observable.shallow,
			lastAcceptedMutations: observable.shallow,
			last7DSleepConstantMetrics: observable.shallow,
			monthlySleepStageMetrics: observable.shallow,
			lastAllSleepStageMetrics: observable.shallow,
			last7DActivityIntensityAverageMetrics: observable.shallow,
			present: action,
		});
	}
	public present = (proposal: Proposal) => {
		(this.lastAcceptedMutations as IObservableArray).clear();
		proposal.forEach((mutation) => {
			if (mutation.type === "pullLast7DSleepMetrics") {
				mutate.call(this, mutation, () =>
					this.last7DSleepConstantMetrics.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "pullMonthlySleepStageMetrics") {
				mutate.call(this, mutation, () =>
					this.monthlySleepStageMetrics.set(mutation.payload.localISOMonth, mutation.payload.data)
				);
			} else if (mutation.type === "pullLastAllSleepConstantMetrics") {
				mutate.call(this, mutation, () =>
					this.lastAllSleepStageMetrics.set(mutation.payload.localISOMonth, mutation.payload.data)
				);
			} else if (mutation.type === "setDailyHRMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyHRNightMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRNightMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailySpo2Metrics") {
				mutate.call(this, mutation, () =>
					this.dailySpo2Metrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyBRMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyBRMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyHRVMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRVMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyHRVTrendMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRVTrendMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailyHRTrendMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyHRTrendMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "pullLast7DActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.last7DActivityIntensityAverageMetrics.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "pullLastAllActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.lastAllActivityIntensityAverageMetrics.set(mutation.payload.localISOMonth, mutation.payload.data)
				);
			} else if (mutation.type === "setMonthlyActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.monthlyActivityIntensityMetrics.set(mutation.payload.localISOMonth, mutation.payload.data)
				);
			} else if (mutation.type === "pullDailyActivityIntensityMetrics") {
				mutate.call(this, mutation, () =>
					this.dailyActivityIntensityMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setDailySleepMetrics") {
				mutate.call(this, mutation, () =>
					this.dailySleepMetrics.set(mutation.payload.localISODay, mutation.payload.range)
				);
			} else if (mutation.type === "setGlobalScore") {
				const score = mutation.payload.score;
				mutate.call(this, mutation, () => this.dailyGlobalScore.set(mutation.payload.localISODay, score));
			} else if (mutation.type === "setDailyEnergyScore") {
				const score = mutation.payload.score;
				mutate.call(this, mutation, () => this.dailyEnergyScore.set(mutation.payload.localISODay, score));
			} else if (mutation.type === "setDailyCardioPoints") {
				const cardio = mutation.payload.cardio;
				mutate.call(this, mutation, () => this.dailyCardioPoints.set(mutation.payload.localISODay, cardio));
			} else if (mutation.type === "setLast7DCardioPoints") {
				mutate.call(this, mutation, () =>
					this.last7DCardioPointConstants.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "setDailyTemperatureVariation") {
				const temperature = mutation.payload.temperature;
				mutate.call(this, mutation, () =>
					this.dailyTemperatureVariation.set(mutation.payload.localISODay, temperature)
				);
			} else if (mutation.type === "setLast7DTemperatureVariation") {
				mutate.call(this, mutation, () =>
					this.last7DTemperatureVariationConstants.set(mutation.payload.localISODay, mutation.payload.data)
				);
			} else if (mutation.type === "setDailyWakeUpScore") {
				mutate.call(this, mutation, () =>
					this.dailyWakeUpScore.set(mutation.payload.localISODay, mutation.payload.data)
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
			} else if (mutation.type === "setLast7DEnergyScore") {
				const score = mutation.payload.score;
				mutate.call(this, mutation, () => this.last7DEnergyScore.set(mutation.payload.localISODay, score));
			}
		});
	};
}
