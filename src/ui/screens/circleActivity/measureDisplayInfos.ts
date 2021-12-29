import { ScoreUnit } from "@domain/measure/score";
import {
	DailyActivityGoals,
	MetricType,
} from "@domain/measure/metric";
import { WordingKey } from "src/wordings";
import { DailyActivityDetailsMetrics, DailyEnergyScoreMetrics, ActivityScoreGaugeMetrics } from "@domain/measure/representation/type";

export type DailyMetricsData = {
	[key in DailyActivityDetailsMetrics]: {
		icon: number;
		labelKey: WordingKey;
		goodGoal?: DailyActivityGoals;
		optimalGoal?: DailyActivityGoals;
	};
};

export type ScoreDetailsData = {
	[key in DailyEnergyScoreMetrics]: {
		titleKey: WordingKey;
		descriptionKey: WordingKey;
		unit: ScoreUnit;
		gauge?: ActivityScoreGaugeMetrics;
	};
};

export const dailyMetricsDataInfos: DailyMetricsData = {
	[MetricType.UserDailySteps]: {
		icon: require("@assets/images/shoes.png"),
		labelKey: "metric.steps",
		goodGoal: MetricType.UserDailyStepsGoalMin,
		optimalGoal: MetricType.UserDailyStepsGoalMax,
	},
	[MetricType.UserDailyWalkingEquivalency]: {
		icon: require("@assets/images/journey.png"),
		labelKey: "metric.walking",
		goodGoal: MetricType.UserDailyWalkingEquivalencyGoalMin,
		optimalGoal: MetricType.UserDailyWalkingEquivalencyGoalMax,
	},
	// TODO enable when back will be ready
	/* 
	[MetricType.UserDailyCaloriesBurnedGoal]: {
		icon: require("@assets/images/fire.png"),
		labelKey: "metric.calories",
		goodGoal: MetricType.UserDailyCaloriesBurnedGoalMin, // not implemented
		optimalGoal: MetricType.UserDailyCardioPointsGoalMax,// not implemented
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
	}, */
	[MetricType.UserDailyAwakeHrMax]: {
		icon: require("@assets/images/heart.png"),
		labelKey: "metric.hr_max",
	},
};

export const scoreDetailsDataInfos: ScoreDetailsData = {
	// TODO enable when back will be ready
	/* "user.daily.score.recovery": {
		titleKey: "score.details.recovery.label",
		descriptionKey: "score.details.recovery.description",
		unit: "qualitative",
	}, */
	[MetricType.UserDailySleepQualityScore]: {
		titleKey: "score.details.wake_up.label",
		descriptionKey: "score.details.wake_up.description",
		unit: "%",
	},
	/* "user.daily.sleep.br": {
		titleKey: "score.details.breathing.label",
		descriptionKey: "score.details.breathing.description",
		unit: "rpm",
		gauge: "user.score.daily.br",
	}
	[MetricType.UserDailyAsleepHrv]: {
		titleKey: "score.details.hrv.label",
		descriptionKey: "score.details.hrv.description",
		unit: "ms",
		gauge: "user.daily.score.hrv", // Not implemented
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
	},*/
};
