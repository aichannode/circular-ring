import { hasNullMember, isDefined, isToday } from "@domain/common/business";
import { ISOMonth } from "@domain/common/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import moment from "moment";
import { DatedMetrics, Metrics, MetricType, RangeMetrics } from "../metric";
import {
	ActivityAll,
	ActivityControlState,
	DailyBr,
	DailyHr,
	DailyHRNight,
	DailyHrv,
	DailySpo2,
	DataControlState,
	Points,
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
export function getActivityControlState(model: { thresholdLow: number; thresholdHigh?: number; value: number }) {
	if (!isDefined(model.thresholdHigh)) {
		if (model.value >= model.thresholdLow) {
			return ActivityControlState.OPTIMAL;
		}
		return ActivityControlState.POOR;
	} else if (model.value >= model.thresholdLow && model.value < model.thresholdHigh) {
		return ActivityControlState.GOOD;
	} else if (model.value < model.thresholdLow) {
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
	thresholdLow: number;
	thresholdHigh: number;
	score: number;
	isInverted?: boolean;
}) {
	if (model.score >= model.thresholdLow && model.score < model.thresholdHigh) {
		return ScoreQuality.GOOD;
	} else if (model.score < model.thresholdLow) {
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
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyHr | undefined {
	if (!isDefined(dailyHR)) return undefined;
	const lines = getTimeseries(dailyHR.timeSeries, MetricType.UserHR);
	const dailyHr: DailyHr = {
		constant: {
			hr: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRAverage, 0),
			hrMin: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRMin, 0),
			hrMax: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRMax, 0),
			reference: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRReference, 0),
		},
		data: lines,
		controlState: getControlState(
			lines,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepBegin, 0) : 0,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepEnd, 0) : 0
		),
	};

	return dailyHr;
}

export function parseDailySpo2(
	dailySpo2:
		| RangeMetrics<MetricType.UserDailySPO2, MetricType.UserDailyAsleepSPO2 | MetricType.UserDailyAsleepSPO2Reference>
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailySpo2 | undefined {
	if (!isDefined(dailySpo2)) return undefined;
	const lines = getTimeseries(dailySpo2.timeSeries, MetricType.UserDailySPO2);
	const dailySpo2Data: DailySpo2 = {
		constant: {
			average: getOrElse<number>(dailySpo2.constant, MetricType.UserDailyAsleepSPO2, 0),
			reference: getOrElse<number>(dailySpo2.constant, MetricType.UserDailyAsleepSPO2Reference, 0),
		},
		data: lines,
		controlState: getControlState(
			lines,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepBegin, 0) : 0,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepEnd, 0) : 0
		),
	};

	return dailySpo2Data;
}
export function parseDailyBR(
	dailyBR:
		| RangeMetrics<MetricType.UserBR, MetricType.UserDailyAsleepBR | MetricType.UserDailyAsleepBRReference>
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyBr | undefined {
	if (!isDefined(dailyBR)) return undefined;
	const lines = getTimeseries(dailyBR.timeSeries, MetricType.UserBR);
	const data: DailyBr = {
		constant: {
			average: getOrElse<number>(dailyBR.constant, MetricType.UserDailyAsleepBR, 0),
			reference: getOrElse<number>(dailyBR.constant, MetricType.UserDailyAsleepBRReference, 0),
		},
		data: lines,
		controlState: getControlState(
			lines,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepBegin, 0) : 0,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepEnd, 0) : 0
		),
	};
	return data;
}
export function parseDailyHRV(
	dailyHRV:
		| RangeMetrics<MetricType.UserHRV, MetricType.UserDailyAsleepHRV | MetricType.UserDailyReferenceHRV>
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyHrv | undefined {
	if (!isDefined(dailyHRV)) return undefined;
	const lines = getTimeseries(dailyHRV.timeSeries, MetricType.UserHRV);
	const dailyHrv: DailyHrv = {
		constant: {
			average: getOrElse<number>(dailyHRV.constant, MetricType.UserDailyAsleepHRV, 0),
			reference: getOrElse<number>(dailyHRV.constant, MetricType.UserDailyReferenceHRV, 0),
		},
		data: lines,
		controlState: getControlState(
			lines,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepBegin, 0) : 0,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepEnd, 0) : 0
		),
	};

	return dailyHrv;
}

export function parseAllActivity(
	lastActivity: Metrics<ActivityIntensityAllAverageMetrics> | undefined,
	allActivity: Array<{ activity?: Metrics<ActivityIntensityAllAverageMetrics>; date: ISOMonth } | undefined>
): ActivityAll | undefined {
	if (!isDefined(lastActivity)) {
		return undefined;
	}

	if (allActivity[0]) {
		if (hasAttributesDefined(allActivity[0], ["activity"])) {
			allActivity[0].activity;
		}
	}

	const constant: ActivityAll["constant"] = {
		highDuration: getOrElse<number>(lastActivity, MetricType.UserMonthlyAverageHighIntensityDuration, 0),
		mediumDuration: getOrElse<number>(lastActivity, MetricType.UserMonthlyAverageMediumIntensityDuration, 0),
		lowDuration: getOrElse<number>(lastActivity, MetricType.UserMonthlyAverageLowIntensityDuration, 0),
	};
	const activityMetrics: ActivityAll["activityMetrics"] = allActivity
		.map((item) => {
			if (!isDefined(item) || !hasAttributesDefined(item, ["activity"])) {
				return undefined;
			}
			const { activity, date } = item;
			return {
				high:
					activity[MetricType.UserMonthlyAverageHighIntensityDuration] === null
						? undefined
						: moment.duration(activity[MetricType.UserMonthlyAverageHighIntensityDuration]).asHours(),
				medium:
					activity[MetricType.UserMonthlyAverageMediumIntensityDuration] === null
						? undefined
						: moment.duration(activity[MetricType.UserMonthlyAverageMediumIntensityDuration]).asHours(),
				low:
					activity[MetricType.UserMonthlyAverageLowIntensityDuration] === null
						? undefined
						: moment.duration(activity[MetricType.UserMonthlyAverageLowIntensityDuration]).asHours(),
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

export function hasNullish(data: RangeMetrics<any, any> | Metrics<any> | number | string | null): boolean {
	if (data === null) {
		return true;
	} else if (typeof data === "number" || typeof data === "string") {
		return false;
	} else if (data["timeSeries"]) {
		return (
			(data as RangeMetrics<any, any>)["timeSeries"].some((b) => hasNullMember(b.metrics)) ||
			hasNullMember((data as RangeMetrics<any, any>)["constant"])
		);
	}
	return hasNullMember(data);
}

export function toOptional<T extends number | string>(data: Metrics<any>, key: MetricType): T | undefined {
	return hasNullish(data[key])
		? undefined
		: typeof data[key] === "string"
		? (data[key] as T)
		: (Number(data[key]) as T);
}

export function getOrElse<T extends number | string>(data: Metrics<any>, key: MetricType, defaultValue: T): T {
	return hasNullish(data[key]) ? defaultValue : (data[key] as T);
}

export function parseDailyHRNight(
	dailyHRNight:
		| RangeMetrics<
				MetricType.UserHR,
				| MetricType.UserHR
				| MetricType.UserDailySleepHR
				| MetricType.UserDailySleepHRMin
				| MetricType.UserDailySleepHRMax
		  >
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyHRNight | undefined {
	if (!isDefined(dailyHRNight)) return undefined;
	const lines = getTimeseries(dailyHRNight.timeSeries, MetricType.UserHR);
	const data: DailyHRNight = {
		constant: {
			hr: getOrElse<number>(dailyHRNight.constant, MetricType.UserHR, 0),
			hrMin: getOrElse<number>(dailyHRNight.constant, MetricType.UserDailySleepHRMin, 0),
			hrMax: getOrElse<number>(dailyHRNight.constant, MetricType.UserDailySleepHRMax, 0),
			reference: getOrElse<number>(dailyHRNight.constant, MetricType.UserDailySleepHR, 0),
		},
		data: lines,
		controlState: getControlState(
			lines,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepBegin, 0) : 0,
			dailySleepMetrics ? getOrElse<number>(dailySleepMetrics.constant, MetricType.UserCoreSleepEnd, 0) : 0
		),
	};

	return data;
}

export function getTimeseries(timeSeries: ReadonlyArray<DatedMetrics<any>>, key: MetricType): Points {
	const lines = timeSeries.map((timeSerie) => {
		return {
			x: Date.parse(timeSerie.timestamp),
			y: getOrElse<number>(timeSerie.metrics, key, 0),
		};
	});
	return lines;
}

export function getControlState(
	lines: Points,
	userSleepBegin: number,
	userSleepEnd: number
): DataControlState.READY | DataControlState.NO_DATA {
	const controlState = lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
		? DataControlState.READY
		: DataControlState.NO_DATA;

	return controlState;
}
