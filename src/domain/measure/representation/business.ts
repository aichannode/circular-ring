import { isToday } from "@domain/common/business";
import { MetricType, RangeMetrics } from "../metric";
import { ActivityControlState, DailyHr, DailySpo2, DataControlState, ScoreQuality } from "./api";
import { DailySleepStageDuration, SleepStagesMetrics } from "./lib/type";

/**
 * Return either we can display the data of this day or not
 * @implements spec [00000](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWIm9aec)
 */
export function canDisplay(isoDay: string, userCoreSleepEnd: number) {
	return isToday(new Date(userCoreSleepEnd).toISOString(), isoDay);
}

/**
 * Compute an activity control state
 */
export function getActivityControlState(model: { lowThreshold: number; highThreshold?: number; value: number }) {
	if (model.highThreshold === undefined) {
		if (model.value >= model.lowThreshold) {
			return ActivityControlState.OPTIMAL;
		}
		return ActivityControlState.POOR;
	} else if (model.value >= model.lowThreshold && model.value < model.highThreshold) {
		return ActivityControlState.GOOD;
	} else if (model.value < model.lowThreshold) {
		return ActivityControlState.POOR;
	} else {
		return ActivityControlState.OPTIMAL;
	}
}

/**
 * Compute the control states for the sleep score
 * @implements spec [00001](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWInQrBs)
 */
export function getScoreControlStates(model: {
	lowThreshold: number;
	highThreshold: number;
	score: number;
	isInverted?: boolean;
}) {
	if (model.score >= model.lowThreshold && model.score < model.highThreshold) {
		return ScoreQuality.GOOD;
	} else if (model.score < model.lowThreshold) {
		return model.isInverted ? ScoreQuality.OPTIMAL : ScoreQuality.POOR;
	} else {
		return model.isInverted ? ScoreQuality.POOR : ScoreQuality.OPTIMAL;
	}
}

export function parseDailyHR(
	dailyHR:
		| RangeMetrics<
				MetricType.UserHR,
				| MetricType.UserDailyAwakeHRMax
				| MetricType.UserDailyAwakeHRMin
				| MetricType.UserDailyAwakeHRAverage
				| MetricType.UserDailyAwakeHRReference
		  >
		| undefined
): DailyHr | undefined {
	if (dailyHR === undefined || dailyHR?.timeSeries.length === 0) return undefined;
	const dailyHr: DailyHr = {
		constant: {
			hr: dailyHR.constant[MetricType.UserDailyAwakeHRAverage] as number,
			hrMin: dailyHR.constant[MetricType.UserDailyAwakeHRMin] as number,
			hrMax: dailyHR.constant[MetricType.UserDailyAwakeHRMax] as number,
			reference: dailyHR.constant[MetricType.UserDailyAwakeHRReference] as number,
		},
		lines: [],
	};
	dailyHR.timeSeries.map((timeSerie) => {
		dailyHr.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: typeof timeSerie.metrics["user.hr"] === "number" ? timeSerie.metrics["user.hr"] : 0,
		});
	});
	return dailyHr;
}

export function parseDailySpo2(
	dailySpo2:
		| RangeMetrics<MetricType.UserDailySPO2, MetricType.UserDailyAsleepSPO2 | MetricType.UserDailyAsleepSPO2Reference>
		| undefined,
	dailySleepStageDuration: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailySpo2 | undefined {
	if (dailySpo2 === undefined || dailySpo2?.timeSeries.length === 0) return undefined;

	const userSleepBegin = dailySleepStageDuration?.constant[MetricType.UserCoreSleepBegin] as number;
	const userSleepEnd = dailySleepStageDuration?.constant[MetricType.UserCoreSleepEnd] as number;

	const dailySpo2Data: DailySpo2 = {
		constant: {
			average: dailySpo2.constant[MetricType.UserDailyAsleepSPO2] as number,
			reference: dailySpo2.constant[MetricType.UserDailyAsleepSPO2Reference] as number,
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	dailySpo2.timeSeries.map((timeSerie) => {
		dailySpo2Data.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: typeof timeSerie.metrics["user.spo2"] === "number" ? timeSerie.metrics["user.spo2"] : 0,
		});
	});
	const controlState = dailySpo2Data.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
		? DataControlState.READY
		: DataControlState.NO_DATA;
	dailySpo2Data.controlState = controlState;

	return dailySpo2Data;
}
