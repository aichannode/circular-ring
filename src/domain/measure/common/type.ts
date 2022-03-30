import { ISODay } from "@domain/common/type";
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
	DailyWakeUpScoreMetrics,
	StepsTaken,
	WalkingEquivalency,
} from "../representation/lib/type";

export type Mutations =
	| {
			type: "setDailyHRMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics>;
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
			type: "setDailyActivityIntensityMetrics";
			payload: {
				localISODay: ISODay;
				range: RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>;
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
				score: number;
			};
	  };

export type Proposal = Mutations[];
