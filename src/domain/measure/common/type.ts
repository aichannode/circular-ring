import { MetricType, RangeMetrics } from "../metric";
import { DailyActivityIntensityMetrics, DailySleepStageDuration } from "../representation/lib/type";

export type Mutations =
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
	  };

export type Proposal = Mutations[];
