import { MetricType } from "@domain/measure/metric";
import { Activities, ActivityScoreContributors } from "@domain/measure/representation/lib/type";
import { useI18n } from "@ui/i18n";
import { WordingKey } from "src/wordings";
import { getScoreQualityLabel } from "../business";
import { GaugeDisplayConfig, MetricDisplayConfig } from "../type";

export type DailyEnergyScoreGaugeConfigs = Record<ActivityScoreContributors, GaugeDisplayConfig>;

export function getActivityGaugesConfig(format: (v: WordingKey) => string): DailyEnergyScoreGaugeConfigs {
	const { formatTemperature } = useI18n();
	return {
		// Body recovery
		[MetricType.UserDailyBodyRecovery]: {
			titleKey: "score.details.recovery.label",
			descriptionKey: "score.details.recovery.description",
			renderValue: getScoreQualityLabel(format),
		},
		[MetricType.UserDailyWakeUpScore]: {
			// Wakeup score
			titleKey: "score.details.wake_up.label",
			descriptionKey: "score.details.wake_up.description",
			renderValue: ({ value }: { value: number }) => `${value * 100}%`,
		},
		[MetricType.UserDailyScoreBR]: {
			// Breathing rate
			titleKey: "score.details.breathing.label",
			descriptionKey: "score.details.breathing.description",
			renderValue: ({ value }: { value: number }) => `${value} rpm`,
		},
		[MetricType.UserDailyScoreSPO2]: {
			// SPO2
			titleKey: "score.details.breathing.label",
			descriptionKey: "score.details.breathing.description",
			renderValue: ({ value }: { value: number }) => `${value} rpm`,
		},
		[MetricType.UserDailyScoreHRV]: {
			// Heart rate variability
			titleKey: "score.details.hrv.label",
			descriptionKey: "score.details.hrv.description",
			renderValue: ({ value }: { value: number }) => `${value} ms`,
		},
		[MetricType.UserDailyScoreRHR]: {
			// Resting heart rate
			titleKey: "score.details.resting_heart_rate.label",
			descriptionKey: "score.details.resting_heart_rate.description",
			renderValue: ({ value }: { value: number }) => `${value} bpm`,
		},
		[MetricType.UserDailyScoreVarTemperature]: {
			// Temperature variation
			titleKey: "score.details.temperature.label",
			descriptionKey: "score.details.temperature.description",
			renderValue: ({ value }: { value: number }) => formatTemperature(value),
		},
		[MetricType.UserDailySleepScore]: {
			// Sleep quality
			titleKey: "score.details.sleep_quality.label",
			descriptionKey: "score.details.sleep_quality.description",
			renderValue: ({ value }: { value: number }) => `${value * 100}%`,
		},
		[MetricType.UserDailySleepBalance]: {
			// Sleep balance
			titleKey: "score.details.sleep_balance.label",
			descriptionKey: "score.details.sleep_balance.description",
			renderValue: getScoreQualityLabel(format),
		},
		[MetricType.UserDailyActivityVolume]: {
			// Activity volume
			titleKey: "score.details.activity_volume.label",
			descriptionKey: "score.details.activity_volume.description",
			renderValue: getScoreQualityLabel(format),
		},
	};
}

type MetricsDetails = Record<Activities, MetricDisplayConfig>;

export const dailyActivitiesUIConfig: MetricsDetails = {
	[MetricType.UserDailySteps]: {
		icon: "@assets/images/shoes.png",
		labelKey: "metric.steps",
	},
	[MetricType.UserDailyWalkingEquivalency]: {
		icon: "@assets/images/journey.png",
		labelKey: "metric.walking",
	},
	[MetricType.UserDailyCaloriesBurned]: {
		icon: "@assets/images/fire.png",
		labelKey: "metric.calories",
	},
	[MetricType.UserDailyCardioPoints]: {
		icon: "@assets/images/sport.png",
		labelKey: "metric.cardio",
	},
	[MetricType.UserDailyVO2Max]: {
		icon: "@assets/images/lungs.png",
		labelKey: "metric.vo2_max",
	},
	[MetricType.UserDailyAwakeHRMax]: {
		icon: "@assets/images/heart.png",
		labelKey: "metric.hr_max",
	},
};
