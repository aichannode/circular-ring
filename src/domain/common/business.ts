import moment from "moment";
import { ISODay, ISOMonth } from "./type";

export function isYesterday(dateIso: string, todayIso: string) {
	const today = moment(todayIso).startOf("day");
	const date = moment(dateIso);
	const yesterday = today.subtract(1, "days");
	return date.isSame(yesterday, "d");
}

export function isToday(dateIso: string, todayIso: string) {
	const today = moment(todayIso).startOf("day");
	const date = moment(dateIso);
	return date.isSame(today, "d");
}

export function isISODay(isoDate: string): isoDate is ISODay {
	return isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/) !== null;
}

export function isISOMonth(isoDate: string): isoDate is ISODay {
	return isoDate.match(/^(\d{4})-(\d{2})$/) !== null;
}

/**
 * Return the month iso formated as YYYY-MM in UTC for the given local date
 */
export function getUTCLocalISOMonth(localIsoDay: ISODay): ISOMonth {
	return moment.utc(localIsoDay).startOf("month").format("YYYY-MM") as ISOMonth;
}

const regexUTCDate = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)Z$/;

/**
 * Return true if the given iso string is UTC based.
 * Ex:
 * 2012-01-01T17:52:27.8116975-12:00 => false
 * 2022-03-01T00:00:00.000+00:00 => false
 * 2022-03-01T00:00:00.000+0000 => false
 * 2012-03-01T00:00:00Z => true
 * 2022-03-01T00:00:00.000Z => true
 * 2022-03-02T00:02:00Z => true
 * 2012-02-01T18:21:06 => false
 */
export function isUTCDate(isoDate: string): boolean {
	return isoDate.match(regexUTCDate) !== null;
}

export function assertISODay(isoDate: string) {
	if (!isISODay(isoDate)) {
		throw new Error(`expects an iso date with the format YYYY-MM-DD input. Got a ${isoDate}`);
	}
}

export function assertISOMonth(isoDate: string) {
	if (!isISOMonth(isoDate)) {
		throw new Error(`expects an iso date with the format YYYY-MM input. Got a ${isoDate}`);
	}
}

export function assertUTCDate(isoDate: string) {
	if (!isUTCDate(isoDate)) {
		throw new Error(`expects a UTC date input. Got a local date ${isoDate}`);
	}
}

export function assertLocalDate(isoDate: string) {
	if (isUTCDate(isoDate)) {
		throw new Error(`expects a local date input. Got an UTC date ${isoDate}`);
	}
}

/**
 * Return the local iso day from the given local time stamp.
 */
export function getLocalISODayFromLocalDate(localIsoDate: string): ISODay {
	assertLocalDate(localIsoDate);
	return moment(localIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the local iso day from the given UTC time stamp.
 */
export function getLocalISODayFromUTCDate(utcIsoDate: string): ISODay {
	assertUTCDate(utcIsoDate);
	return moment(utcIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the UTC iso day from the given UTC time stamp.
 */
export function getUTCISODayFromUTCDate(utcIsoDate: string): ISODay {
	assertUTCDate(utcIsoDate);
	return moment(utcIsoDate).utc().format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the UTC iso day from the given local time stamp.
 */
export function getUTCISODayFromLocalDate(localIsoDate: string): ISODay {
	assertLocalDate(localIsoDate);
	return moment(localIsoDate).utc().format("YYYY-MM-DD") as ISODay;
}

/**
 * Convert UTC day to locale day
 */
export function getLocalISODayFromUTCISODay(isoDate: ISODay): ISODay {
	return moment.utc(isoDate).local().format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the current local iso day formated day in local time
 */
export function getCurrentLocalISODay(localNow?: string): ISODay {
	return getLocalISODayFromLocalDate(localNow ?? moment().toISOString(true));
}

/**
 * Convert iso day to iso month
 */
export function toISOMonth(isoDay: ISODay): ISOMonth {
	return isoDay.slice(0, 7) as ISOMonth;
}

/**
 * Convert locale isostring date to UTC
 */
export function toUTC(localISODate: string): string {
	assertLocalDate(localISODate);
	return moment(localISODate).toISOString();
}

/**
 * Convert UTC iso string to locale string
 */
export function toLocale(isoDate: string) {
	assertUTCDate(isoDate);
	return moment(isoDate).toISOString(true);
}
