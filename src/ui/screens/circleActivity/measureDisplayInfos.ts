import { MetricType } from "@domain/measure/metric";
import { DailyActivitiesMetrics, DailyEnergyScoreMetrics } from "@domain/measure/representation/lib/type";
import { useI18n } from "@ui/i18n";
import { WordingKey } from "src/wordings";
import { getGaugeColor, getMetricColor, getScoreQualityLabel } from "../business";
import { GaugeDisplayConfig, MetricDisplayConfig } from "../type";

export type DailyEnergyScoreGaugeConfigs = Record<DailyEnergyScoreMetrics, GaugeDisplayConfig>;

export function getActivityQualityDetails(format: (v: WordingKey) => string): DailyEnergyScoreGaugeConfigs {
	const { formatTemperature } = useI18n();
	return {
		// Body recovery
		[MetricType.UserDailyBodyRecovery]: {
			metricsName: {
				value: MetricType.UserDailyBodyRecovery,
				thresholdLow: MetricType.UserDailyBodyRecoveryGoalMin,
				thresholdHigh: MetricType.UserDailyBodyRecoveryGoalMax,
				gaugeFilling: MetricType.UserDailyBodyRecovery,
			},
			titleKey: "score.details.recovery.label",
			descriptionKey: "score.details.recovery.description",
			renderValue: getScoreQualityLabel(format),
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyWakeUpScore]: {
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
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
			}) => `${value * 100}%`,
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
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
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
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
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
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
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
				gaugeFilling,
			}: {
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
			}) => formatTemperature(value),
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
				value: number;
				thresholdLow: number;
				thresholdHigh: number;
				gaugeFilling: number;
			}) => `${value * 100}%`,
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
		},
	};
}

type MetricsDetails = {
	[key in DailyActivitiesMetrics]: MetricDisplayConfig;
};

export const dailyMetricsDetails: MetricsDetails = {
	[MetricType.UserDailySteps]: {
		metricsName: {
			value: MetricType.UserDailySteps,
			thresholdLow: MetricType.UserDailyStepsGoalMin,
			thresholdHigh: MetricType.UserDailyStepsGoalMax,
		},
		icon: "@assets/images/shoes.png",
		labelKey: "metric.steps",
		getColor: getMetricColor,
	},
	[MetricType.UserDailyWalkingEquivalency]: {
		metricsName: {
			value: MetricType.UserDailyWalkingEquivalency,
			thresholdLow: MetricType.UserDailyWalkingEquivalencyGoalMin,
			thresholdHigh: MetricType.UserDailyWalkingEquivalencyGoalMax,
		},
		icon: "@assets/images/journey.png",
		labelKey: "metric.walking",
		getColor: getMetricColor,
	},
	[MetricType.UserDailyCaloriesBurned]: {
		metricsName: {
			value: MetricType.UserDailyWalkingEquivalency,
			thresholdLow: MetricType.UserDailyWalkingEquivalencyGoalMin,
			thresholdHigh: MetricType.UserDailyWalkingEquivalencyGoalMax,
		},
		icon: "@assets/images/fire.png",
		labelKey: "metric.calories",
		getColor: getMetricColor,
	},
	[MetricType.UserDailyCardioPoints]: {
		metricsName: {
			value: MetricType.UserDailyWalkingEquivalency,
			thresholdLow: MetricType.UserDailyWalkingEquivalencyGoalMin,
			thresholdHigh: MetricType.UserDailyWalkingEquivalencyGoalMax,
		},
		icon: "@assets/images/sport.png",
		labelKey: "metric.cardio",
		getColor: getMetricColor,
	},
	[MetricType.UserDailyVO2Max]: {
		metricsName: {
			value: MetricType.UserDailyVO2Max,
		},
		icon: "@assets/images/lungs.png",
		labelKey: "metric.vo2_max",
	},
	[MetricType.UserDailyHRMax]: {
		metricsName: {
			value: MetricType.UserDailyHRMax,
		},
		icon: "@assets/images/heart.png",
		labelKey: "metric.hr_max",
	},
};
