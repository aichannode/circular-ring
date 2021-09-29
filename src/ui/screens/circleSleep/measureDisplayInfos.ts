import { ScoreUnit } from "@domain/circleActivity/circleActivityData";
import { SleepQualityGaugeMetric, SleepQualityMetric } from "@domain/measure/metric";
import { WordingKey } from "src/wordings";

export type SleepQualityData = {
	[key in SleepQualityMetric]: {
		titleKey: WordingKey;
		descriptionKey: WordingKey;
		unit: ScoreUnit;
		gauge?: SleepQualityGaugeMetric;
		inverted?: boolean;
		displayGaugeValue?: boolean;
	};
};

export const scoreDetailsDataInfos: SleepQualityData = {
	"user.daily.awake.stage.duration": {
		titleKey: "sleep.quality.disturbance.label",
		descriptionKey: "sleep.quality.disturbance.description",
		unit: "time",
		gauge: "user.daily.%awake.stage.duration",
		displayGaugeValue: true,
		inverted: true,
	},
	"user.daily.real.sleep.duration": {
		titleKey: "sleep.quality.real_sleep.label",
		descriptionKey: "sleep.quality.real_sleep.description",
		unit: "time",
		gauge: "user.daily.%real.sleep",
		displayGaugeValue: true,
	},
	"user.daily.tranquility": {
		titleKey: "sleep.quality.tranquility.label",
		descriptionKey: "sleep.quality.tranquility.description",
		unit: "tranquility",
	},
	"user.daily.circadian.rhythm": {
		titleKey: "sleep.quality.circadian.label",
		descriptionKey: "sleep.quality.circadian.description",
		unit: "qualitative",
	},
	"user.daily.%rem.stage": {
		titleKey: "sleep.quality.rem.label",
		descriptionKey: "sleep.quality.rem.description",
		unit: "%",
		gauge: "user.daily.%rem.stage.score",
	},
	"user.daily.%deep.stage": {
		titleKey: "sleep.quality.deep.label",
		descriptionKey: "sleep.quality.deep.description",
		unit: "%",
		gauge: "user.daily.%deep.stage.score",
	},
	"user.daily.time.to.fall.asleep": {
		titleKey: "sleep.quality.fall_asleep.label",
		descriptionKey: "sleep.quality.fall_asleep.description",
		unit: "time",
		gauge: "user.daily.%time.to.fall.asleep",
	},
	"user.daily.sleep.debt": {
		titleKey: "sleep.quality.debt.label",
		descriptionKey: "sleep.quality.debt.description",
		unit: "time",
		gauge: "user.daily.%sleep.debt",
	},
};
