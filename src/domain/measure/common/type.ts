import { ISODay, ISOMonth } from "@domain/common/type";
import { Metrics, MetricType, RangeMetrics } from "../metric";
import {
	ActivityIntensity7DAverageMetrics,
	ActivityIntensityAllAverageMetrics,
	ActivityIntensityMonthlyMetrics,
	CalorieBurnedConstantMetrics,
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
	DailyHRSConstantMetrics,
	DailyHRSMetrics,
	DailyHRTimeSeriesMetrics,
	DailyHRTrendTimeSeriesMetrics,
	DailyHRVConstantMetrics,
	DailyHRVTimeSeriesMetrics,
	DailyHRVTrendTimeSeriesMetrics,
	DailyPhaseBeforeWakeUpMetrics,
	DailySleepScoreMetrics,
	DailySleepStageDuration,
	DailySpo2ConstantMetrics,
	DailySpo2TimeSeriesMetrics,
	DailyWakeUpScoreMetrics,
	Sleep7DConstantMetrics,
	SleepAllConstantMetrics,
	SleepMonthlyStageMetrics,
	SleepStagesMetrics,
	StepsConstantMetrics,
	StepsTaken,
	TemperatureVariationConstantMetrics,
	THRH7DConstantMetrics,
	WalkingEquivalency,
} from "../representation/lib/type";

export type Mutations =
	| {
			type: "pullLast7DSleepMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<Sleep7DConstantMetrics>;
			};
	  }
	| {
			type: "pullMonthlySleepStageMetrics";
			payload: {
				localISOMonth: ISOMonth;
				data: Metrics<SleepMonthlyStageMetrics>;
			};
	  }
	| {
			type: "pullLastAllSleepConstantMetrics";
			payload: {
				localISOMonth: ISOMonth;
				data: Metrics<SleepAllConstantMetrics>;
			};
	  }
	| {
			type: "setDailyHRMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics>;
			};
	  }
	| {
			type: "setDailyHRNightMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRNightTimeSeriesMetrics, DailyHRNightConstantMetrics>;
			};
	  }
	| {
			type: "setDailyCardioPoints";
			payload: {
				localISODay: ISODay;
				cardio: number | null;
			};
	  }
	| {
			type: "setDailyCalorieBurned";
			payload: {
				localISODay: ISODay;
				calorie: number | null;
			};
	  }
	| {
			type: "setLast7DCardioPoints";
			payload: {
				localISODay: ISODay;
				data: Metrics<CardioPointsConstantMetrics>;
			};
	  }
	| {
			type: "setDailyTemperatureVariation";
			payload: {
				localISODay: ISODay;
				temperature: number | null;
			};
	  }
	| {
			type: "setLast7DTemperatureVariation";
			payload: {
				localISODay: ISODay;
				data: Metrics<TemperatureVariationConstantMetrics>;
			};
	  }
	| {
			type: "setDailyStepsMetrics";
			payload: {
				localISODay: ISODay;
				data: number | null;
			};
	  }
	| {
			type: "setLast7DStepsConstants";
			payload: {
				localISODay: ISODay;
				data: Metrics<StepsConstantMetrics>;
			};
	  }
	| {
			type: "setLast7DCalorieBurned";
			payload: {
				localISODay: ISODay;
				data: Metrics<CalorieBurnedConstantMetrics>;
			};
	  }
	| {
			type: "setDailySpo2Metrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailySpo2TimeSeriesMetrics, DailySpo2ConstantMetrics>;
			};
	  }
	| {
			type: "setDailyHRVMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRVTimeSeriesMetrics, DailyHRVConstantMetrics>;
			};
	  }
	| {
			type: "setDailyBRMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyBRTimeSeriesMetrics, DailyBRConstantMetrics>;
			};
	  }
	| {
			type: "setDailyHRVTrendMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRVTrendTimeSeriesMetrics, never>;
			};
	  }
	| {
			type: "setDailyHRTrendMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRTrendTimeSeriesMetrics, never>;
			};
	  }
	| {
			type: "setDailySleepScoreContributorsMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<
					| ContributorAwakeDuration
					| ContributorRealSleepDuration
					| ContributorDailyTranquility
					| ContributorCircadianRhythm
					| ContributorREMDuration
					| ContributorDeepSleepuration
					| ContributorTimeToFallAsleep
					| ContributorSleepDebt
				>;
			};
	  }
	| {
			type: "setDailyEnergyScoreContributorsMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<
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
				>;
			};
	  }
	| {
			type: "setDailyActivitiesMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<
					| StepsTaken
					| WalkingEquivalency
					| CaloriesBurned
					| CardioPoints
					| MetricType.UserDailyVO2Max
					| MetricType.UserDailyAwakeHRMax
				>;
			};
	  }
	| {
			type: "pullDailyActivityIntensityMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyActivityIntensityMetrics, DailyActivityIntensityDuration>;
			};
	  }
	| {
			type: "setMonthlyActivityIntensityMetrics";
			payload: {
				localISOMonth: ISOMonth;
				data: Metrics<ActivityIntensityMonthlyMetrics>;
			};
	  }
	| {
			type: "pullLast7DActivityIntensityMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<ActivityIntensity7DAverageMetrics>;
			};
	  }
	| {
			type: "pullLastAllActivityIntensityMetrics";
			payload: {
				localISOMonth: ISOMonth;
				data: Metrics<ActivityIntensityAllAverageMetrics>;
			};
	  }
	| {
			type: "setDailySleepMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration>;
			};
	  }
	| {
			type: "setGlobalScore";
			payload: {
				localISODay: ISODay;
				score: number | null;
			};
	  }
	| {
			type: "setDailyEnergyScore";
			payload: {
				localISODay: ISODay;
				score: number | null;
			};
	  }
	| {
			type: "setDailySleepScore";
			payload: {
				localISODay: ISODay;
				score: number | null;
			};
	  }
	| {
			type: "setSleepScore";
			payload: {
				localISODay: ISODay;
				data: Metrics<DailySleepScoreMetrics>;
			};
	  }
	| {
			type: "setDailyWakeUpScore";
			payload: {
				localISODay: ISODay;
				data: Metrics<DailyWakeUpScoreMetrics>;
			};
	  }
	| {
			type: "setLast7DEnergyScore";
			payload: {
				localISODay: ISODay;
				score: number | null;
			};
	  }
	| {
			type: "setDailyHRSMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<DailyHRSMetrics>;
			};
	  }
	| {
			type: "setDailyHRSConstantMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<DailyHRSConstantMetrics>;
			};
	  }
	| {
			type: "setDailyPhaseBeforeWakeUp";
			payload: {
				localISODay: ISODay;
				data: Metrics<DailyPhaseBeforeWakeUpMetrics>;
			};
	  }
	| {
			type: "setLast7DSleepScore";
			payload: {
				localISODay: ISODay;
				score: number | null;
			};
	  }
	| {
			type: "setDailyRestingHeartRate";
			payload: {
				localISODay: ISODay;
				data: number | null;
			};
	  }
	| {
			type: "setLast7DRestingHeartRate";
			payload: {
				localISODay: ISODay;
				constant: Metrics<THRH7DConstantMetrics>;
			};
	  };

export type Proposal = Mutations[];
