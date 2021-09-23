import { ScoreUnit } from "@domain/circleActivity/circleActivityData";
import {
	DailyActivityGoalMetric,
	DailyActivityMetric,
	EnergyScoreGaugeMetric,
	EnergyScoreMetric,
	Metric,
	MetricInfo,
} from "@domain/measure/metric";
import { WordingKey } from "src/wordings";

export type DailyMetricsData = {
	[key in DailyActivityMetric]: {
		icon: number;
		labelKey: WordingKey;
		// goodCalculator?: (value: number, others: MetricInfo<DailyActivityGoalMetric>) => boolean;
		// optimalCalculator?: (value: number, others: MetricInfo) => boolean;
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
		// goodCalculator?: (value: number, others: MetricInfo) => boolean;
		// optimalCalculator?: (value: number, others: MetricInfo) => boolean;
	};
};

export const dailyMetricsData: DailyMetricsData = {
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

export const scoreDetailsData: ScoreDetailsData = {
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
};
