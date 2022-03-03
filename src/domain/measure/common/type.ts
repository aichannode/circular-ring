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
} from "../representation/lib/type";

export type Mutations =
	| {
			type: "setDailySleepScoreContributorsMetrics";
			payload: {
				isoDate: string;
				data: Metrics<
					| DailySleepScoreContributorsMetrics
					| DailySleepScoreContributorsMetricsGaugeSize
					| DailySleepScoreContributorsGaugeCalibrationMetrics
				>;
			};
	  }
	| {
			type: "setDailyEnergyScoreContributorsMetrics";
			payload: {
				isoDate: string;
				data: Metrics<
					DailyEnergyScoreMetrics | DailyEnergyScoreMetricsGaugeSize | DailyEnergyScoreGaugeCalibrationMetrics
				>;
			};
	  }
	| {
			type: "setDailyActivitiesMetrics";
			payload: {
				isoDate: string;
				data: Metrics<DailyActivitiesMetrics | DailyActivitiesMetricsGoals>;
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
