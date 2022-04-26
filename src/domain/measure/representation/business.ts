import { hasNullMember, isDefined, isToday } from "@domain/common/business";
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
export function getActivityControlState(model: { thresholdLow: number; thresholdHigh?: number; value: number }) {
	if (model.thresholdHigh === undefined) {
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
		| undefined
): DailyHr | undefined {
	if (dailyHR === undefined) return undefined;
	const dailyHr: DailyHr = {
		constant: {
			hr: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRAverage, 0),
			hrMin: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRMin, 0),
			hrMax: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRMax, 0),
			reference: getOrElse<number>(dailyHR.constant, MetricType.UserDailyAwakeHRReference, 0),
		},
		lines: [],
	};
	dailyHR.timeSeries.map((timeSerie) => {
		dailyHr.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: getOrElse<number>(timeSerie.metrics, MetricType.UserHR, 0),
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

	const dailySpo2Data: DailySpo2 = {
		constant: {
			average: getOrElse<number>(dailySpo2.constant, MetricType.UserDailyAsleepSPO2, 0),
			reference: getOrElse<number>(dailySpo2.constant, MetricType.UserDailyAsleepSPO2Reference, 0),
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	dailySpo2.timeSeries.map((timeSerie) => {
		dailySpo2Data.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: getOrElse<number>(timeSerie.metrics, MetricType.UserDailySPO2, 0),
		});
	});
	if (dailySleepStageDuration) {
		const userSleepBegin = getOrElse<number>(dailySleepStageDuration?.constant, MetricType.UserCoreSleepBegin, 0);
		const userSleepEnd = getOrElse<number>(dailySleepStageDuration?.constant, MetricType.UserCoreSleepEnd, 0);

		const controlState = dailySpo2Data.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
			? DataControlState.READY
			: DataControlState.NO_DATA;
		dailySpo2Data.controlState = controlState;
	}

	return dailySpo2Data;
}
export function parseDailyBR(
	dailyBR:
		| RangeMetrics<MetricType.UserBR, MetricType.UserDailyAsleepBR | MetricType.UserDailyAsleepBRReference>
		| undefined,
	dailySleepStageDuration: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyBr | undefined {
	if (dailyBR === undefined || dailyBR?.timeSeries.length === 0) return undefined;

	const data: DailyBr = {
		constant: {
			average: getOrElse<number>(dailyBR.constant, MetricType.UserDailyAsleepBR, 0),
			reference: getOrElse<number>(dailyBR.constant, MetricType.UserDailyAsleepBRReference, 0),
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	dailyBR.timeSeries.map((timeSerie) => {
		data.lines.push({
			x: Date.parse(timeSerie.timestamp),
			y: getOrElse<number>(timeSerie.metrics, MetricType.UserBR, 0),
		});
	});

	if (dailySleepStageDuration) {
		const userSleepBegin = getOrElse<number>(dailySleepStageDuration?.constant, MetricType.UserCoreSleepBegin, 0);
		const userSleepEnd = getOrElse<number>(dailySleepStageDuration?.constant, MetricType.UserCoreSleepEnd, 0);

		const controlState = data.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
			? DataControlState.READY
			: DataControlState.NO_DATA;
		data.controlState = controlState;
	}

	return data;
}
export function parseDailyHRV(
	dailyHRV:
		| RangeMetrics<MetricType.UserHRV, MetricType.UserDailyAsleepHRV | MetricType.UserDailyReferenceHRV>
		| undefined,
	dailySleepMetrics: RangeMetrics<SleepStagesMetrics, DailySleepStageDuration> | undefined
): DailyHrv | undefined {
	if (dailyHRV === undefined) return undefined;
	const dailyHrv: DailyHrv = {
		constant: {
			average: getOrElse<number>(dailyHRV.constant, MetricType.UserDailyAsleepHRV, 0),
			reference: getOrElse<number>(dailyHRV.constant, MetricType.UserDailyReferenceHRV, 0),
		},
		lines: [],
		controlState: DataControlState.NO_DATA,
	};
	if (dailySleepMetrics) {
		const userSleepBegin = getOrElse<number>(dailySleepMetrics?.constant, MetricType.UserCoreSleepBegin, 0);
		const userSleepEnd = getOrElse<number>(dailySleepMetrics?.constant, MetricType.UserCoreSleepEnd, 0);

		dailyHRV.timeSeries.map((timeSerie) => {
			dailyHrv.lines.push({
				x: Date.parse(timeSerie.timestamp),
				y: getOrElse<number>(timeSerie.metrics, MetricType.UserHRV, 0),
			});
		});

		const controlState = dailyHrv.lines.some(({ x }) => x > userSleepBegin * 1000 && x < userSleepEnd * 1000)
			? DataControlState.READY
			: DataControlState.NO_DATA;
		dailyHrv.controlState = controlState;
	}

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
