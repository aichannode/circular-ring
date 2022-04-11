import { MetricType } from "@domain/measure/metric";
import { SleepScoreContributors } from "@domain/measure/representation/lib/type";
import { WordingKey } from "src/wordings";
import { GaugeDisplayConfig } from "../type";

export type SleepQualityDetails = Record<SleepScoreContributors, GaugeDisplayConfig>;

export function getSleepGaugesConfig(format: (v: WordingKey) => string): SleepQualityDetails {
	return {
		[MetricType.UserDailyAwakeStageDuration]: {
			// Disturbance 2 metrics
			titleKey: "sleep.quality.disturbance.label",
			descriptionKey: "sleep.quality.disturbance.description",
			renderValue: ({ value, percent }) => `${Math.round(value)} min (${Math.round((1 - percent) * 100)}%)`,
		},
		[MetricType.UserDailyRealSleepDuration]: {
			// Real sleep
			titleKey: "sleep.quality.real_sleep.label",
			descriptionKey: "sleep.quality.real_sleep.description",
			renderValue: ({ value, percent }) =>
				`${Math.floor(value / 60)} h ${value % 60} min (${Math.round(percent * 100)}%)`,
		},
		[MetricType.UserDailyTranquility]: {
			// Tranquility: 2 metrics
			titleKey: "sleep.quality.tranquility.label",
			descriptionKey: "sleep.quality.tranquility.description",
			renderValue: getTranquilityLabel(format),
		},
		[MetricType.UserDailyCircadianRhythm]: {
			// Circadian
			titleKey: "sleep.quality.circadian.label",
			descriptionKey: "sleep.quality.circadian.description",
			renderValue: ({ value }) => `${Math.round(value * 100)}%`,
		},
		[MetricType.UserDailyPercREMStageScore]: {
			// REM sleep: 2 metrics
			titleKey: "sleep.quality.rem.label",
			descriptionKey: "sleep.quality.rem.description",
			renderValue: ({ value }) => `${Math.round(value * 100)}%`,
		},
		[MetricType.UserDailyPercDeepStage]: {
			// Deep sleep: 2 metrics
			titleKey: "sleep.quality.deep.label",
			descriptionKey: "sleep.quality.deep.description",
			renderValue: ({ value }) => `${Math.round(value * 100)}%`,
		},
		[MetricType.UserDailyCoreTimeToFallAsleep]: {
			// Time to fall asleep: 2 metrics
			titleKey: "sleep.quality.fall_asleep.label",
			descriptionKey: "sleep.quality.fall_asleep.description",
			renderValue: ({ value }) => `${Math.round(value)} min`,
		},
		[MetricType.UserDailySleepDebt]: {
			// Sleep debt: 2 metrics
			titleKey: "sleep.quality.debt.label",
			descriptionKey: "sleep.quality.debt.description",
			renderValue: ({ value }) => `${Math.round(value)} min`,
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
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		percent: number;
	}) => {
		if (value >= thresholdHigh) {
			return format("sleep.tranquility.calm");
		}
		if (value < thresholdHigh && value >= thresholdLow) {
			return format("sleep.tranquility.agitated");
		}
		return format("sleep.tranquility.very_agitated");
	};
