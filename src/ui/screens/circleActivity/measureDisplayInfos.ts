import { ScoreUnit } from "@domain/measure/score";
import {
	DailyActivityGoals,
	MetricType,
} from "@domain/measure/metric";
import { WordingKey } from "src/wordings";
import { DailyActivityDetailsMetrics, DailyEnergyScoreMetrics, DailyEnergyScoreGaugeCalibrationMetrics } from "@domain/measure/representation/type";
import { getGaugeColor, getScoreQualityLabel } from "../business";
import { GaugeDisplayConfig } from "../type";

export type DailyEnergyScoreGaugeConfigs = Record<DailyEnergyScoreMetrics, GaugeDisplayConfig>

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
		gauge?: DailyEnergyScoreGaugeCalibrationMetrics;
	};
};

export function getActivityQualityDetails(format: (v: WordingKey) => string): DailyEnergyScoreGaugeConfigs {
	return {
		// Body recovery
		[MetricType.UserDailyScoreRecovery]: {
			metricsName: {
				value: MetricType.UserDailyScoreRecovery,
				thresholdLow: MetricType.UserDailyScoreRecoveryGoalMin,
				thresholdHigh: MetricType.UserDailyScoreRecoveryGoalMax,
				gaugeFilling: MetricType.UserDailyScoreRecovery,
			},
			titleKey: "score.details.recovery.label",
			descriptionKey: "score.details.recovery.description",
			displaySegment: [.6, 1],
			renderValue: getScoreQualityLabel(format),
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyWakeUpScore]:{
			// Wakeup score
			metricsName: {
				value: MetricType.UserDailyWakeUpScore,
				thresholdLow: MetricType.UserDailyWakeUpScoreGoalMin,
				thresholdHigh: MetricType.UserDailyWakeUpScoreGoalMax,
				gaugeFilling: MetricType.UserDailyWakeUpScore,
			},
			titleKey: "score.details.wake_up.label",
			descriptionKey: "score.details.wake_up.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value*100}%`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailySleepBR]: {
			// Breathing rate
			metricsName: {
				value: MetricType.UserDailySleepBR,
				thresholdLow: MetricType.UserDailyScoreBRGoalMin,
				thresholdHigh: MetricType.UserDailyScoreBRGoalMax,
				gaugeFilling: MetricType.UserDailyScoreBr,
			},
			titleKey: "score.details.breathing.label",
			descriptionKey: "score.details.breathing.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value} rpm`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailySleepHRV]: {
			// Heart rate variability
			metricsName: {
				value: MetricType.UserDailySleepHRV,
				thresholdLow: MetricType.UserDailyScoreHRVGoalMin,
				thresholdHigh: MetricType.UserDailyScoreHRVGoalMax,
				gaugeFilling: MetricType.UserDailyScoreHRV,
			},
			titleKey: "score.details.hrv.label",
			descriptionKey: "score.details.hrv.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value} ms`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyRHR]: {
			// Resting heart rate
			metricsName: {
				value: MetricType.UserDailyRHR,
				thresholdLow: MetricType.UserDailyScoreRHRGoalMin,
				thresholdHigh: MetricType.UserDailyScoreRHRGoalMax,
				gaugeFilling: MetricType.UserDailyScoreRHR,
			},
			titleKey: "score.details.resting_heart_rate.label",
			descriptionKey: "score.details.resting_heart_rate.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value} bpm`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailySleepVarTemperature]: {
			// Temperature variation
			metricsName: {
				value: MetricType.UserDailySleepVarTemperature,
				thresholdLow: MetricType.UserDailyScoreVarTemperatureGoalMin,
				thresholdHigh: MetricType.UserDailyScoreVarTemperatureGoalMax,
				gaugeFilling: MetricType.UserDailyScoreVarTemperature,
			},
			titleKey: "score.details.temperature.label",
			descriptionKey: "score.details.temperature.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
				gaugeFilling
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value > 0 ? '+' : '-'} ${value}°C`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailySleepScore]: {
			// Sleep quality
			metricsName: {
				value: MetricType.UserDailySleepScore,
				thresholdLow: MetricType.UserDailySleepScoreGoalMin,
				thresholdHigh: MetricType.UserDailySleepScoreGoalMax,
				gaugeFilling: MetricType.UserDailySleepScore,
			},
			titleKey: "score.details.sleep_quality.label",
			descriptionKey: "score.details.sleep_quality.description",
			renderValue: ({
				value,
				thresholdLow,
				thresholdHigh,
			}: {
				value: number,
				thresholdLow: number,
				thresholdHigh: number,
				gaugeFilling: number,
			}) => `${value*100}%`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyScoreSleepBalance]: {
			// Sleep balance
			metricsName: {
				value: MetricType.UserDailyScoreSleepBalance,
				thresholdLow: MetricType.UserDailyScoreSleepBalanceGoalMin,
				thresholdHigh: MetricType.UserDailyScoreSleepBalanceGoalMax,
				gaugeFilling: MetricType.UserDailyScoreSleepBalance,
			},
			titleKey: "score.details.sleep_balance.label",
			descriptionKey: "score.details.sleep_balance.description",
			renderValue: getScoreQualityLabel(format),
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyScoreActivityVolume]: {
			// Activity volume
			metricsName: {
				value: MetricType.UserDailyScoreActivityVolume,
				thresholdLow: MetricType.UserDailyScoreActivityVolumeGoalMin,
				thresholdHigh: MetricType.UserDailyScoreActivityVolumeGoalMax,
				gaugeFilling: MetricType.UserDailyScoreActivityVolume,
			},
			titleKey: "score.details.activity_volume.label",
			descriptionKey: "score.details.activity_volume.description",
			renderValue: getScoreQualityLabel(format),
			getGaugeColor: getGaugeColor(),
		}
	}
}


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