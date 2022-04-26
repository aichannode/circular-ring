import { isDefined } from "@domain/common/business";
import { MetricType } from "@domain/measure/metric";
import { SleepScoreContributors } from "@domain/measure/representation/lib/type";
import { createActiveMode, isInCalibrationMode, isInDisabledMode } from "@ui/business";
import { Mode } from "@ui/type";
import { WordingKey } from "src/wordings";
import { GaugeDisplayConfig } from "../type";

export type SleepQualityDetails = Record<SleepScoreContributors, GaugeDisplayConfig>;

// XXX: Based on https://app.zeplin.io/project/612f3d589c650611e6322ac2/screen/61c5d189936f696af26fe056
// Metrics whitelist that could be displayed as usual in calibration mode.
export const METRICS_WHITELISTED_IN_CALIBRATION_MODE = new Set([
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCoreTimeToFallAsleep,
]);

function computeModeFactory(metric: SleepScoreContributors) {
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

export function getSleepGaugesConfig(format: (v: WordingKey) => string): SleepQualityDetails {
	return {
		[MetricType.UserDailyAwakeStageDuration]: {
			// Disturbance 2 metrics
			titleKey: "sleep.quality.disturbance.label",
			descriptionKey: "sleep.quality.disturbance.description",
			computeMode: computeModeFactory(MetricType.UserDailyAwakeStageDuration),
			renderValue: ({ value, percent }) =>
				isDefined(value) && isDefined(percent)
					? `${Math.round(value)} min (${Math.round((1 - percent) * 100)}%)`
					: undefined,
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyRealSleepDuration]: {
			// Real sleep
			titleKey: "sleep.quality.real_sleep.label",
			descriptionKey: "sleep.quality.real_sleep.description",
			computeMode: computeModeFactory(MetricType.UserDailyRealSleepDuration),
			renderValue: ({ value, percent }) =>
				isDefined(value) && isDefined(percent)
					? `${Math.floor(value / 60)} h ${value % 60} min (${Math.round(percent * 100)}%)`
					: undefined,
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyTranquility]: {
			// Tranquility: 2 metrics
			titleKey: "sleep.quality.tranquility.label",
			descriptionKey: "sleep.quality.tranquility.description",
			computeMode: computeModeFactory(MetricType.UserDailyTranquility),
			renderValue: getTranquilityLabel(format),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyCircadianRhythm]: {
			// Circadian
			titleKey: "sleep.quality.circadian.label",
			descriptionKey: "sleep.quality.circadian.description",
			computeMode: computeModeFactory(MetricType.UserDailyCircadianRhythm),
			renderValue: ({ value }) => (isDefined(value) ? `${Math.round(value * 100)}%` : undefined),
		},
		[MetricType.UserDailyPercREMStageScore]: {
			// REM sleep: 2 metrics
			titleKey: "sleep.quality.rem.label",
			descriptionKey: "sleep.quality.rem.description",
			computeMode: computeModeFactory(MetricType.UserDailyPercREMStageScore),
			renderValue: ({ value }) => (isDefined(value) ? `${Math.round(value * 100)}%` : undefined),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyPercDeepStage]: {
			// Deep sleep: 2 metrics
			titleKey: "sleep.quality.deep.label",
			descriptionKey: "sleep.quality.deep.description",
			computeMode: computeModeFactory(MetricType.UserDailyPercDeepStage),
			renderValue: ({ value }) => (isDefined(value) ? `${Math.round(value * 100)}%` : undefined),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailyCoreTimeToFallAsleep]: {
			// Time to fall asleep: 2 metrics
			titleKey: "sleep.quality.fall_asleep.label",
			descriptionKey: "sleep.quality.fall_asleep.description",
			computeMode: computeModeFactory(MetricType.UserDailyCoreTimeToFallAsleep),
			renderValue: ({ value }) => (isDefined(value) ? `${Math.round(value)} min` : undefined),
			shouldForceDisplayValue: true,
		},
		[MetricType.UserDailySleepDebt]: {
			// Sleep debt: 2 metrics
			titleKey: "sleep.quality.debt.label",
			descriptionKey: "sleep.quality.debt.description",
			computeMode: computeModeFactory(MetricType.UserDailySleepDebt),
			renderValue: ({ value }) => (isDefined(value) ? `${Math.round(value)} min` : undefined),
		},
	};
}

const getTranquilityLabel =
	(format: (v: WordingKey) => string) =>
	({
		value,
		thresholdLow,
		thresholdHigh,
	}: {
		value?: number;
		thresholdLow: number;
		thresholdHigh: number;
		percent?: number;
	}) => {
		if (!isDefined(value)) {
			return undefined;
		}
		if (value >= thresholdHigh) {
			return format("sleep.tranquility.calm");
		}
		if (value < thresholdHigh && value >= thresholdLow) {
			return format("sleep.tranquility.agitated");
		}
		return format("sleep.tranquility.very_agitated");
	};
