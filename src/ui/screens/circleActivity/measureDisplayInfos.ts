import { MetricType } from "@domain/measure/metric";
import { Activities, ActivityScoreContributors } from "@domain/measure/representation/lib/type";
import { useIsCelsius } from "@domain/user/hooks/useUser";
import { createActiveMode, isInCalibrationMode, isInDisabledMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { Mode } from "@ui/type";
import { WordingKey } from "src/wordings";
import { getScoreQualityLabel } from "../business";
import { GaugeDisplayConfig, MetricDisplayConfig } from "../type";

export type DailyEnergyScoreGaugeConfigs = Record<ActivityScoreContributors, GaugeDisplayConfig>;

// XXX: Based on https://app.zeplin.io/project/612f3d589c650611e6322ac2/screen/61c5d18c6a5fb16a970dd4cf
// Metrics whitelist that could be displayed as usual in calibration mode.
export const METRICS_WHITELISTED_IN_CALIBRATION_MODE = new Set([
	MetricType.UserDailyBodyRecovery,
	MetricType.UserDailyWakeUpScore,
]);

function computeModeFactory(metric: ActivityScoreContributors) {
	return (parentMode: Mode): Mode => {
		if (
			(isInCalibrationMode(parentMode) && !METRICS_WHITELISTED_IN_CALIBRATION_MODE.has(metric)) ||
			isInDisabledMode(parentMode)
		) {
			return parentMode;
		}
		return createActiveMode();
	};
}

export function getActivityGaugesConfig(format: (v: WordingKey) => string): DailyEnergyScoreGaugeConfigs {
	const { formatTemperature } = useI18n();
	const isCelsius = useIsCelsius();
	return {
		// Body recovery
		[MetricType.UserDailyBodyRecovery]: {
			titleKey: "score.details.recovery.label",
			descriptionKey: "score.details.recovery.description",
			renderValue: getScoreQualityLabel(format),
			computeMode: computeModeFactory(MetricType.UserDailyBodyRecovery),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyWakeUpScore]: {
			// Wakeup score
			titleKey: "score.details.wake_up.label",
			descriptionKey: "score.details.wake_up.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value * 100)}%` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailyWakeUpScore),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyScoreBR]: {
			// Breathing rate
			titleKey: "score.details.breathing.label",
			descriptionKey: "score.details.breathing.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value)} rpm` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailyScoreBR),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyScoreSPO2]: {
			// SPO2
			titleKey: "score.details.spo2.label",
			descriptionKey: "score.details.spo2.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value)} %` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailyScoreSPO2),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyScoreHRV]: {
			// Heart rate variability
			titleKey: "score.details.hrv.label",
			descriptionKey: "score.details.hrv.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value)} ms` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailyScoreHRV),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyScoreRHR]: {
			// Resting heart rate
			titleKey: "score.details.resting_heart_rate.label",
			descriptionKey: "score.details.resting_heart_rate.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value)} bpm` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailyScoreRHR),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailySleepScoreVarTemperature]: {
			// Temperature variation
			titleKey: "score.details.temperature.label",
			descriptionKey: "score.details.temperature.description",
			renderValue: ({ value }: { value?: number }) => (value ? formatTemperature(value, isCelsius) : undefined),
			computeMode: computeModeFactory(MetricType.UserDailySleepScoreVarTemperature),
		},
		[MetricType.UserDailySleepScore]: {
			// Sleep quality
			titleKey: "score.details.sleep_quality.label",
			descriptionKey: "score.details.sleep_quality.description",
			renderValue: ({ value }: { value?: number }) => (value ? `${Math.round(value * 100)}%` : undefined),
			computeMode: computeModeFactory(MetricType.UserDailySleepScore),
		},
		[MetricType.UserDailySleepBalance]: {
			// Sleep balance
			titleKey: "score.details.sleep_balance.label",
			descriptionKey: "score.details.sleep_balance.description",
			renderValue: getScoreQualityLabel(format),
			computeMode: computeModeFactory(MetricType.UserDailySleepBalance),
		},
		[MetricType.UserDailyActivityVolume]: {
			// Activity volume
			titleKey: "score.details.activity_volume.label",
			descriptionKey: "score.details.activity_volume.description",
			renderValue: getScoreQualityLabel(format),
			computeMode: computeModeFactory(MetricType.UserDailyActivityVolume),
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
