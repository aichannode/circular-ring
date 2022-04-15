import { isDefined, isToday } from "@domain/common/business";
import { ISOMonth } from "@domain/common/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import moment from "moment";
import { Metrics, MetricType, RangeMetrics } from "../metric";
import {
	ActivityAll,
	ActivityControlState,
	DailyBr,
	DailyHr,
	DailyHrv,
	DailySpo2,
	DataControlState,
	ScoreQuality,
} from "./api";
import { ActivityIntensityAllAverageMetrics, DailySleepStageDuration, SleepStagesMetrics } from "./lib/type";

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
export function parseDailyBR(
	dailyBR:
		| RangeMetrics<MetricType.UserBR, MetricType.UserDailyAsleepBR | MetricType.UserDailyAsleepBRReference>
		| undefined,
	dailySleepStageDuration: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyBr | undefined {
	if (dailyBR === undefined || dailyBR?.timeSeries.length === 0) return undefined;

	const userSleepBegin = dailySleepStageDuration?.constant[MetricType.UserCoreSleepBegin] as number;
	const userSleepEnd = dailySleepStageDuration?.constant[MetricType.UserCoreSleepEnd] as number;

	const data: DailyBr = {
		constant: {
			average: dailyBR.constant[MetricType.UserDailyAsleepBR] as number,
			reference: dailyBR.constant[MetricType.UserDailyAsleepBRReference] as number,
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	dailyBR.timeSeries.map((timeSerie) => {
		data.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: timeSerie.metrics[MetricType.UserBR] as number,
		});
	});

	const controlState = data.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
		? DataControlState.READY
		: DataControlState.NO_DATA;
	data.controlState = controlState;

	return data;
}
export function parseDailyHRV(
	dailyHRV:
		| RangeMetrics<MetricType.UserHRV, MetricType.UserDailyAsleepHRV | MetricType.UserDailyReferenceHRV>
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyHrv | undefined {
	if (dailyHRV === undefined || dailyHRV?.timeSeries.length === 0) return undefined;
	const dailyHrv: DailyHrv = {
		constant: {
			average: dailyHRV.constant[MetricType.UserDailyAsleepHRV] as number,
			reference: dailyHRV.constant[MetricType.UserDailyReferenceHRV] as number,
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	const userSleepBegin = dailySleepMetrics?.constant[MetricType.UserCoreSleepBegin] as number;
	const userSleepEnd = dailySleepMetrics?.constant[MetricType.UserCoreSleepEnd] as number;

	dailyHRV.timeSeries.map((timeSerie) => {
		dailyHrv.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: timeSerie.metrics[MetricType.UserHRV] as number,
		});
	});

	const controlState = dailyHrv.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
		? DataControlState.READY
		: DataControlState.NO_DATA;
	dailyHrv.controlState = controlState;

	return dailyHrv;
}
export function parseAllActivity(
	lastActivity: Metrics<ActivityIntensityAllAverageMetrics> | undefined,
	allActivity: Array<{ activity?: Metrics<ActivityIntensityAllAverageMetrics>; date: ISOMonth } | undefined>
): ActivityAll | undefined {
	if (lastActivity === undefined || allActivity.length === 0) return undefined;

	if (allActivity[0]) {
		if (hasAttributesDefined(allActivity[0], ["activity"])) {
			allActivity[0].activity;
		}
	}

	const constant: ActivityAll["constant"] = {
		highDuration: lastActivity[MetricType.UserMonthlyAverageHighIntensityDuration] as number,
		mediumDuration: lastActivity[MetricType.UserMonthlyAverageMediumIntensityDuration] as number,
		lowDuration: lastActivity[MetricType.UserMonthlyAverageLowIntensityDuration] as number,
	};
	const activityMetrics: ActivityAll["activityMetrics"] = allActivity
		.map((item) => {
			if (!isDefined(item) || !hasAttributesDefined(item, ["activity"])) {
				return undefined;
			}
			const { activity, date } = item;
			return {
				high: isDefined(activity[MetricType.UserMonthlyAverageHighIntensityDuration])
					? moment.duration(activity[MetricType.UserMonthlyAverageHighIntensityDuration]).asHours()
					: undefined,
				medium: isDefined(activity[MetricType.UserMonthlyAverageMediumIntensityDuration])
					? moment.duration(activity[MetricType.UserMonthlyAverageMediumIntensityDuration]).asHours()
					: undefined,
				low: isDefined(activity[MetricType.UserMonthlyAverageLowIntensityDuration])
					? moment.duration(activity[MetricType.UserMonthlyAverageLowIntensityDuration]).asHours()
					: undefined,
				date,
			};
		})
		.filter(isDefined);
	const controlState = activityMetrics.some((metric) => isDefined(metric?.low))
		? DataControlState.READY
		: DataControlState.NO_DATA;

	const activityAll: ActivityAll = {
		constant,
		activityMetrics,
		controlState,
	};

	return activityAll;
}
