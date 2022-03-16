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
	StepsTaken,
	WalkingEquivalency,
} from "../representation/lib/type";

export type Mutations =
	| {
			type: "setDailyHRMetrics";
			payload: {
				isoDay: ISODay;
				range: RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics>;
			};
	  }
	| {
			type: "setDailySleepScoreContributorsMetrics";
			payload: {
				isoDay: ISODay;
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
				isoDay: ISODay;
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
				isoDay: ISODay;
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
				isoDay: ISODay;
				range: RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>;
			};
	  }
	| {
			type: "setDailySleepMetrics";
			payload: {
				isoDay: ISODay;
				range: RangeMetrics<MetricType.UserSleepStage, DailySleepStageDuration>;
			};
	  }
	| {
			type: "setGlobalScore";
			payload: {
				isoDay: ISODay;
				score?: number;
			};
	  }
	| {
			type: "setDailyEnergyScore";
			payload: {
				isoDay: ISODay;
				score?: number;
			};
	  }
	| {
			type: "setSleepScore";
			payload: {
				isoDay: ISODay;
				data: Record<DailySleepScoreMetrics, number>;
			};
	  };

export type Proposal = Mutations[];
