import moment from "moment";
import { getKeyFromDate, MeasureService } from "../measureService";
import { DatedMetrics } from "../metric";
import { ActivityStage, SleepStage } from "../type";
import { ActivityIntensityMetrics, SleepStageMetrics, StageInfos } from "./type";

/**
 * Return the phases of sleep for the given metrics
 */
export function getSleepPhases(
	chain: Array<DatedMetrics<SleepStageMetrics>>
): StageInfos<SleepStage>[] {
	return [
        {
            type: SleepStage.AWAKE,
            start: moment().subtract(1, "day").hour(23).toISOString(),
            end: moment().hour(1).toISOString(),
        },
        {
            type: SleepStage.REM,
            start: moment().hour(1).toISOString(),
            end: moment().hour(2).toISOString(),
        },
        {
            type: SleepStage.LIGHT,
            start: moment().hour(2).toISOString(),
            end: moment().hour(6).minute(0).toISOString(),
        },
        {
            type: SleepStage.DEEP,
            start: moment().hour(6).minute(0).toISOString(),
            end: moment().hour(14).toISOString(),
        },
        {
            type: SleepStage.REM,
            start: moment().hour(14).toISOString(),
            end: moment().hour(15).toISOString(),
        },
        {
            type: SleepStage.AWAKE,
            start: moment().hour(15).toISOString(),
            end: moment().hour(19).toISOString(),
        },
    ]
}

/**
 * Return the total duration of activity for the given activity data
 */
export function getActivityDuration(
    phases: Array<StageInfos<ActivityStage>>
) {
    return phases.reduce(function(duration, phase) {
        if ( phase.type >= ActivityStage.MEDIUM) {
            duration + moment(phase.start).diff(moment(phase.end))
        }
        return duration
    }, 0)
}

/**
 * Return the phases of sleep for the given metrics
 */
 export function getActivityPhases(
	chain: Array<DatedMetrics<ActivityIntensityMetrics>>
): Array<StageInfos<ActivityStage>> {
	return [
        {
            type: ActivityStage.SEDENTARY,
            start: moment().hour(0).minutes(0).toISOString(),
            end: moment().hour(11).minutes(55).toISOString(),
        },
        {
            type: ActivityStage.LOW,
            start: moment().hour(11).minutes(55).toISOString(),
            end: moment().hour(12).minutes(10).toISOString()
        },
        {
            type: ActivityStage.MEDIUM,
            start: moment().hour(12).minutes(10).toISOString(),
            end: moment().hour(12).minutes(40).toISOString(),
        },
        {
            type: ActivityStage.HIGH,
            start: moment().hour(12).minutes(40).toISOString(),
            end: moment().hour(12).minutes(55).toISOString()
        },
        {
            type: ActivityStage.MEDIUM,
            start: moment().hour(12).minutes(55).toISOString(),
            end: moment().hour(13).minutes(11).toISOString()
        },
        {
            type: ActivityStage.LOW,
            start: moment().hour(13).minutes(11).toISOString(),
            end: moment().hour(13).minutes(30).toISOString()
        },
        {
            type: ActivityStage.SEDENTARY,
            start: moment().hour(13).minutes(30).toISOString(),
            end: moment().hour(18).minutes(0).toISOString(),
        },
        {
            type: ActivityStage.LOW,
            start: moment().hour(18).minutes(0).toISOString(),
            end: moment().hour(18).minutes(20).toISOString()
        },
        {
            type: ActivityStage.SEDENTARY,
            start: moment().hour(18).minutes(20).toISOString(),
            end: moment().hour(20).minutes(0).toISOString()
        }
    ]
}

/**
 * Return the phases of activity for the given date.
 * Return the data for the current day if date is omitted.
 */
export function getDailyActivityPhases({ date, service }: { date?: Date; service: MeasureService; }) {
    const data = service.dailyActivityIntensityMetrics.get(getKeyFromDate(date))
    return data
        ? getActivityPhases(data)
        : undefined
}

/**
 * Return the total duration of activity for the given day
 */
export function getDailyActivityDuration({ date, service }: { date?: Date; service: MeasureService; }) {
    const data = service.dailyActivityIntensityMetrics.get(getKeyFromDate(date))
    return data
        ? getActivityDuration(getActivityPhases(data))
        : undefined
}

/**
 * Return the phases of sleep for the given date
 * Return the data for the current day if date is omitted.
 */
export function getDailySleepDurations({ date, service }: { date?: Date; service: MeasureService; }) {
	const data = service.dailySleepLevelMetrics.get(getKeyFromDate(date))
	return data
		? getSleepPhases(data)
		: undefined
}

/**
 * Return the total duration of activity for the given day
 */
export function getDailySleepDuration({ date, service }: { date?: Date; service: MeasureService; }) {
    return service.dailySleepDuration.get(getKeyFromDate(date))
}

/**
 * Return the daily energy score for the given day
 */
export function getDailyEnergyScore({ date, service }: { date?: Date; service: MeasureService; }) {
    return service.dailyEnergyScore.get(getKeyFromDate(date))
}
	