import { ScoreUnit } from "@domain/measure/score";
import { MetricType } from "@domain/measure/metric";
import { WordingKey } from "src/wordings";
import { DailySleepDetailsGaugeMetrics, DailySleepDetailsMetrics } from "@domain/measure/representation/type";

export type SleepQualityDetails = {
	[key in DailySleepDetailsMetrics]: {
		titleKey: WordingKey;
		descriptionKey: WordingKey;
		unit: ScoreUnit;
		gauge?: DailySleepDetailsGaugeMetrics;
		inverted?: boolean;
		displayGaugeValue?: boolean;
	};
};

export const scoreDetails: SleepQualityDetails = {
	[MetricType.UserDailyAwakeStageDuration]: {
		titleKey: "sleep.quality.disturbance.label",
		descriptionKey: "sleep.quality.disturbance.description",
		unit: "time",
		gauge: MetricType.UserDailyPercAwakeStageDuration,
		displayGaugeValue: true,
		inverted: true,
	},
	[MetricType.UserDailyRealSleepDuration]: {
		titleKey: "sleep.quality.real_sleep.label",
		descriptionKey: "sleep.quality.real_sleep.description",
		unit: "time",
		gauge: MetricType.UserDailyPercRealSleep,
		displayGaugeValue: true,
	},
	[MetricType.UserDailyTranquility]: {
		titleKey: "sleep.quality.tranquility.label",
		descriptionKey: "sleep.quality.tranquility.description",
		unit: "tranquility",
	},
	[MetricType.UserDailyCircadianRhythm]: {
		titleKey: "sleep.quality.circadian.label",
		descriptionKey: "sleep.quality.circadian.description",
		unit: "qualitative",
	},
	[MetricType.UserDailyPercREMStage]: {
		titleKey: "sleep.quality.rem.label",
		descriptionKey: "sleep.quality.rem.description",
		unit: "%",
		gauge: MetricType.UserDailyPercREMStageScore,
	},
	[MetricType.UserDailyPercDeepStage]: {
		titleKey: "sleep.quality.deep.label",
		descriptionKey: "sleep.quality.deep.description",
		unit: "%",
		gauge: MetricType.UserDailyPercdeepStageScore,
	},
	[MetricType.UserDailyTimeToFallAsleep]: {
		titleKey: "sleep.quality.fall_asleep.label",
		descriptionKey: "sleep.quality.fall_asleep.description",
		unit: "time",
		gauge: MetricType.UserDailyPercTimeTtoFallAsleep,
	},
	[MetricType.UserDailySleepDebt]: {
		titleKey: "sleep.quality.debt.label",
		descriptionKey: "sleep.quality.debt.description",
		unit: "time",
		gauge: MetricType.UserDailyPercSleepDebt,
	},
};
