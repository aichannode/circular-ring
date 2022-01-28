import { MetricType } from "@domain/measure/metric";
import { DailySleepScoreContributorsMetrics } from "@domain/measure/representation/lib/type";
import moment from "moment";
import { WordingKey } from "src/wordings";
import { getGaugeColor, getInvertedGaugeColor } from "../business";
import { GaugeDisplayConfig } from "../type";

export type SleepQualityDetails = {
	[key in DailySleepScoreContributorsMetrics]: GaugeDisplayConfig;
};

export function getSleepQualityDetails(format: (v: WordingKey) => string): SleepQualityDetails {
	return {
		[MetricType.UserDailyAwakeStageDuration]: {
			// Disturbance 2 metrics
			metricsName: {
				value: MetricType.UserDailyAwakeStageDuration,
				thresholdLow: MetricType.UserDailyPercAwakeStageDurationGoalMin,
				thresholdHigh: MetricType.UserDailyPercAwakeStageDurationGoalMax,
				gaugeFilling: MetricType.UserDailyPercAwakeStage,
			},
			titleKey: "sleep.quality.disturbance.label",
			descriptionKey: "sleep.quality.disturbance.description",
			isInverted: true,
			renderValue: ({ value, gaugeFilling }) => `${value} min (${gaugeFilling * 100}%)`,
			getGaugeColor: getInvertedGaugeColor(true),
		},
		[MetricType.UserDailyRealSleepDuration]: {
			// Real sleep
			metricsName: {
				value: MetricType.UserDailyRealSleepDuration,
				thresholdLow: MetricType.UserDailyPercRealSleepDurationGoalMin,
				thresholdHigh: MetricType.UserDailyPercRealSleepDurationGoalMax,
				gaugeFilling: MetricType.UserDailyPercRealSleep,
			},
			titleKey: "sleep.quality.real_sleep.label",
			descriptionKey: "sleep.quality.real_sleep.description",
			renderValue: ({ value, gaugeFilling }) =>
				`${moment(value * 60 * 1000).hour()} h ${moment(value * 60 * 1000).minutes()} min (${gaugeFilling * 100}%)`,
			getGaugeColor: getGaugeColor(),
			displaySegment: [0.6, 1],
		},
		[MetricType.UserDailyTranquility]: {
			// Tranquility: 2 metrics
			metricsName: {
				value: MetricType.UserDailyTranquility,
				thresholdLow: MetricType.UserDailyTranquilityGoalMin,
				thresholdHigh: MetricType.UserDailyTranquilityGoalMax,
				gaugeFilling: MetricType.UserDailyTranquility,
			},
			titleKey: "sleep.quality.tranquility.label",
			descriptionKey: "sleep.quality.tranquility.description",
			renderValue: getTranquilityLabel(format),
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyCircadianRhythm]: {
			// Circadian
			metricsName: {
				value: MetricType.UserDailyCircadianRhythm,
				thresholdLow: MetricType.UserDailyCircadianRhythmGoalMin,
				thresholdHigh: MetricType.UserDailyCircadianRhythmGoalMax,
				gaugeFilling: MetricType.UserDailyCircadianRhythm,
			},
			titleKey: "sleep.quality.circadian.label",
			descriptionKey: "sleep.quality.circadian.description",
			renderValue: ({ value }) => `${value * 100}%`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyPercREMStage]: {
			// REM sleep: 2 metrics
			metricsName: {
				value: MetricType.UserDailyPercREMStage,
				thresholdLow: MetricType.UserDailyPercREMStageScoreGoalMin,
				thresholdHigh: MetricType.UserDailyPercREMStageScoreGoalMax,
				gaugeFilling: MetricType.UserDailyCorrectedPercREMStage,
			},
			titleKey: "sleep.quality.rem.label",
			descriptionKey: "sleep.quality.rem.description",
			renderValue: ({ value }) => `${value * 100}%`,
			getGaugeColor: getGaugeColor(true),
		},
		[MetricType.UserDailyPercDeepStage]: {
			// Deep sleep: 2 metrics
			metricsName: {
				value: MetricType.UserDailyPercDeepStage,
				thresholdLow: MetricType.UserDailyPercDeepStageScoreGoalMin,
				thresholdHigh: MetricType.UserDailyPercDeepStageScoreGoalMax,
				gaugeFilling: MetricType.UserDailyPercDeepStage, // TO FIX, should be MetricType.UserDailyCorrectedPercDeepStage
			},
			titleKey: "sleep.quality.deep.label",
			descriptionKey: "sleep.quality.deep.description",
			renderValue: ({ value }) => `${value * 100}%`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailyTimeToFallAsleep]: {
			// Time to fall asleep: 2 metrics
			metricsName: {
				value: MetricType.UserDailyTimeToFallAsleep,
				thresholdLow: MetricType.UserDailyPercTimeToFallAsleepGoalMin,
				thresholdHigh: MetricType.UserDailyPercTimeToFallAsleepGoalMax,
				gaugeFilling: MetricType.UserDailyPercTimeToFallAsleep,
			},
			titleKey: "sleep.quality.fall_asleep.label",
			descriptionKey: "sleep.quality.fall_asleep.description",
			renderValue: ({ value }) => `${value > 0 ? "+" : "-"} ${value} min`,
			getGaugeColor: getGaugeColor(),
		},
		[MetricType.UserDailySleepDebt]: {
			// Sleep debt: 2 metrics
			metricsName: {
				value: MetricType.UserDailySleepDebt,
				thresholdLow: MetricType.UserDailySleepDebtGoalMin,
				thresholdHigh: MetricType.UserDailySleepDebtGoalMax,
				gaugeFilling: MetricType.UserDailyPercSleepDebt,
			},
			titleKey: "sleep.quality.debt.label",
			descriptionKey: "sleep.quality.debt.description",
			renderValue: ({ value }) => `${value} min`,
			getGaugeColor: getGaugeColor(),
			displaySegment: [0.6, 1],
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
		gaugeFilling: number;
	}) => {
		if (value >= thresholdHigh) {
			return format("sleep.tranquility.calm");
		}
		if (value < thresholdHigh && value >= thresholdLow) {
			return format("sleep.tranquility.agitated");
		}
		return format("sleep.tranquility.very_agitated");
	};
