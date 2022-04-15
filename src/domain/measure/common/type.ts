import { ISODay, ISOMonth } from "@domain/common/type";
import { Metrics, MetricType, RangeMetrics } from "../metric";
import {
	ActivityIntensity7DAverageMetrics,
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
	DailyHRTimeSeriesMetrics,
	DailyHRVConstantMetrics,
	DailyHRVTimeSeriesMetrics,
	DailySleepScoreMetrics,
	DailySleepStageDuration,
	DailySpo2ConstantMetrics,
	DailySpo2TimeSeriesMetrics,
	DailyWakeUpScoreMetrics,
	Sleep7DConstantMetrics,
	SleepAllConstantMetrics,
	SleepMonthlyStageMetrics,
	StepsTaken,
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
			type: "setDailyCardioPoints";
			payload: {
				localISODay: ISODay;
				cardio?: number;
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
			type: "pullLast7DActivityIntensityMetrics";
			payload: {
				localISODay: ISODay;
				data: Metrics<ActivityIntensity7DAverageMetrics>;
			};
	  }
	| {
			type: "setDailySleepMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<MetricType.UserSleepStage, DailySleepStageDuration>;
			};
	  }
	| {
			type: "setGlobalScore";
			payload: {
				localISODay: ISODay;
				score?: number;
			};
	  }
	| {
			type: "setDailyEnergyScore";
			payload: {
				localISODay: ISODay;
				score?: number;
			};
	  }
	| {
			type: "setSleepScore";
			payload: {
				localISODay: ISODay;
				data: Record<DailySleepScoreMetrics, number>;
			};
	  }
	| {
			type: "setDailyWakeUpScore";
			payload: {
				localISODay: ISODay;
				data: Record<DailyWakeUpScoreMetrics, number>;
			};
	  }
	| {
			type: "setLast7DEnergyScore";
			payload: {
				localISODay: ISODay;
				score?: number;
			};
	  };

export type Proposal = Mutations[];
