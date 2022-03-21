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
			renderValue: ({ value }: { value: number }) => `${Math.round(value * 100)}%`,
		},
		[MetricType.UserDailyScoreBR]: {
			// Breathing rate
			titleKey: "score.details.breathing.label",
			descriptionKey: "score.details.breathing.description",
			renderValue: ({ value }: { value: number }) => `${Math.round(value)} rpm`,
		},
		[MetricType.UserDailyScoreSPO2]: {
			// SPO2
			titleKey: "score.details.spo2.label",
			descriptionKey: "score.details.spo2.description",
			renderValue: ({ value }: { value: number }) => `${Math.round(value)} %`,
		},
		[MetricType.UserDailyScoreHRV]: {
			// Heart rate variability
			titleKey: "score.details.hrv.label",
			descriptionKey: "score.details.hrv.description",
			renderValue: ({ value }: { value: number }) => `${Math.round(value)} ms`,
		},
		[MetricType.UserDailyScoreRHR]: {
			// Resting heart rate
			titleKey: "score.details.resting_heart_rate.label",
			descriptionKey: "score.details.resting_heart_rate.description",
			renderValue: ({ value }: { value: number }) => `${Math.round(value)} bpm`,
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
			renderValue: ({ value }: { value: number }) => `${Math.round(value * 100)}%`,
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
		decimalNb: 0,
	},
	[MetricType.UserDailyWalkingEquivalency]: {
		icon: "@assets/images/journey.png",
		labelKey: "metric.walking",
		decimalNb: 1,
	},
	[MetricType.UserDailyCaloriesBurned]: {
		icon: "@assets/images/fire.png",
		labelKey: "metric.calories",
		decimalNb: 0,
	},
	[MetricType.UserDailyCardioPoints]: {
		icon: "@assets/images/sport.png",
		labelKey: "metric.cardio",
		decimalNb: 0,
	},
	[MetricType.UserDailyVO2Max]: {
		icon: "@assets/images/lungs.png",
		labelKey: "metric.vo2_max",
		decimalNb: 0,
	},
	[MetricType.UserDailyAwakeHRMax]: {
		icon: "@assets/images/heart.png",
		labelKey: "metric.hr_max",
		decimalNb: 0,
	},
};
