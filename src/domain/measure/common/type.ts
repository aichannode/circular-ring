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
				isoDate: string;
				range: RangeMetrics<DailyHRTimeSeriesMetrics, DailyHRConstantMetrics>;
			};
	  }
	| {
			type: "setDailySleepScoreContributorsMetrics";
			payload: {
				isoDate: string;
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
				isoDate: string;
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
				isoDate: string;
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
				isoDate: string;
				range: RangeMetrics<DailyActivityIntensityMetrics, MetricType.UserDailyActivityTotal>;
			};
	  }
	| {
			type: "setDailySleepMetrics";
			payload: {
				isoDate: string;
				range: RangeMetrics<MetricType.UserSleepStage, DailySleepStageDuration>;
			};
	  }
	| {
			type: "setGlobalScore";
			payload: {
				isoDate: string;
				score?: number;
			};
	  }
	| {
			type: "setDailyEnergyScore";
			payload: {
				isoDate: string;
				score?: number;
			};
	  }
	| {
			type: "setSleepScore";
			payload: {
				isoDate: string;
				data: Record<DailySleepScoreMetrics, number>;
			};
	  };

export type Proposal = Mutations[];
