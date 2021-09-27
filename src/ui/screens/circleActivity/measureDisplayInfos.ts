import { ScoreUnit } from "@domain/circleActivity/circleActivityData";
import {
	DailyActivityGoalMetric,
	DailyActivityMetric,
	EnergyScoreGaugeMetric,
	EnergyScoreMetric,
} from "@domain/measure/metric";
import { WordingKey } from "src/wordings";

export type DailyMetricsData = {
	[key in DailyActivityMetric]: {
		icon: number;
		labelKey: WordingKey;
		goodGoal?: DailyActivityGoalMetric;
		optimalGoal?: DailyActivityGoalMetric;
	};
};

export type ScoreDetailsData = {
	[key in EnergyScoreMetric]: {
		titleKey: WordingKey;
		descriptionKey: WordingKey;
		unit: ScoreUnit;
		gauge?: EnergyScoreGaugeMetric;
	};
};

export const dailyMetricsDataInfos: DailyMetricsData = {
	"user.daily.steps": {
		icon: require("@assets/images/shoes.png"),
		labelKey: "metric.steps",
		goodGoal: "user.daily.steps.goal.min",
		optimalGoal: "user.daily.steps.goal.max",
	},
	"user.daily.walking.equivalency": {
		icon: require("@assets/images/journey.png"),
		labelKey: "metric.walking",
		goodGoal: "user.daily.walking.equivalency.goal.min",
		optimalGoal: "user.daily.walking.equivalency.goal.max",
	},
	"user.daily.calories.burned": {
		icon: require("@assets/images/fire.png"),
		labelKey: "metric.calories",
		goodGoal: "user.daily.calories.burned.goal.min",
		optimalGoal: "user.daily.calories.burned.goal.max",
	},
	"user.daily.cardio.points": {
		icon: require("@assets/images/sport.png"),
		labelKey: "metric.cardio",
		goodGoal: "user.daily.cardio.points.goal.min",
		optimalGoal: "user.daily.cardio.points.goal.max",
	},
	"user.daily.vo2max": {
		icon: require("@assets/images/lungs.png"),
		labelKey: "metric.vo2_max",
	},
	"user.daily.awake.hr.max": {
		icon: require("@assets/images/heart.png"),
		labelKey: "metric.hr_max",
	},
};

export const scoreDetailsDataInfos: ScoreDetailsData = {
	"user.daily.score.recovery": {
		titleKey: "score.details.recovery.label",
		descriptionKey: "score.details.recovery.description",
		unit: "qualitative",
	},
	"user.daily.wake.up.score": {
		titleKey: "score.details.wake_up.label",
		descriptionKey: "score.details.wake_up.description",
		unit: "%",
	},
	"user.daily.sleep.br": {
		titleKey: "score.details.breathing.label",
		descriptionKey: "score.details.breathing.description",
		unit: "rpm",
		gauge: "user.score.daily.br",
	},
	"user.daily.sleep.hrv": {
		titleKey: "score.details.hrv.label",
		descriptionKey: "score.details.hrv.description",
		unit: "ms",
		gauge: "user.daily.score.hrv",
	},
	"user.daily.rhr": {
		titleKey: "score.details.resting_heart_rate.label",
		descriptionKey: "score.details.resting_heart_rate.description",
		unit: "bpm",
		gauge: "user.daily.score.rhr",
	},
	"user.daily.sleep.var.temperature": {
		titleKey: "score.details.temperature.label",
		descriptionKey: "score.details.temperature.description",
		unit: "°C", // TODO Units ?
		gauge: "user.score.daily.var.temperature",
	},
	"user.2days.sleep.score": {
		titleKey: "score.details.sleep_quality.label",
		descriptionKey: "score.details.sleep_quality.description",
		unit: "%",
	},
	"user.daily.score.sleep.balance": {
		titleKey: "score.details.sleep_balance.label",
		descriptionKey: "score.details.sleep_balance.description",
		unit: "qualitative",
	},
	"user.daily.score.activity.volume": {
		titleKey: "score.details.activity_volume.label",
		descriptionKey: "score.details.activity_volume.description",
		unit: "qualitative",
	},
};
