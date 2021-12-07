import { HourFormat } from "@domain/units";
import moment from "moment";
import { FeedEntity, FeedNotification, FeedEntityType, FeedRecommendation } from "./type";

export const isNotification = (entity: FeedEntity): entity is FeedNotification => entity.type === FeedEntityType.NOTIFICATION
export const isRecommendation = (entity: FeedEntity): entity is FeedRecommendation => entity.type !== FeedEntityType.NOTIFICATION

export function isToday(dateIso: string, todayIso: string) {
    const today = moment(todayIso).startOf("day")
    const date = moment(dateIso)
	return date.isSame(today, "d")
}

export function isYesterday(dateIso: string, todayIso: string) {
    const today = moment(todayIso).startOf("day")
    const date = moment(dateIso)
	const yesterday = today.subtract(1, "days")
	return date.isSame(yesterday, "d")
}


export function getFeedEntityDate(isoDate: string, todayIsoDate: string, format?: HourFormat) {
    const date = moment(isoDate)
    const today = moment(todayIsoDate)

    // The entry appeared today, return the relative time
    if (isToday(isoDate, todayIsoDate)) {
        return date.from(today);
    }

    // The entry is older than one day, return the hours
    return date.format(format === "12"
        ? "hh:mm A"
        : "HH:mm"
    )
}