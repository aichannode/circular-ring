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

const regexUTCDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))((-(\d{2}):(\d{2})|Z))$/;

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
 * Return the local day iso formated as YYYY-MM-DD for the given date in local time
 */
export function getLocalISODayFromLocalDate(localIsoDate: string): ISODay {
	assertLocalDate(localIsoDate);
	return moment(localIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the day iso formated as YYYY-MM-DD for the given date in local time
 */
export function getUTCISODayFromLocalDate(localIsoDate: string): ISODay {
	assertLocalDate(localIsoDate);
	return moment.utc(localIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return a local day formated as YYYY-MM-DD from the given UTC time stamp.
 */
export function getLocalDayFromUTCDate(utcIsoDate: string): ISODay {
	assertUTCDate(utcIsoDate);
	return moment(utcIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return a local day formated as YYYY-MM-DD from the given UTC time stamp.
 */
export function getUTCDayFromUTCDate(utcIsoDate: string): ISODay {
	assertUTCDate(utcIsoDate);
	return moment(utcIsoDate).format("YYYY-MM-DD") as ISODay;
}

/**
 * Return the current local iso day formated day in local time
 */
export function getCurrentLocalISODay(localNow?: string): ISODay {
	return getLocalISODayFromLocalDate(localNow ?? moment().toISOString());
}

/**
 * Return the current local iso day formated day in UTC
 */
export function getUTCCurrentLocalISODay(localNow?: string): ISODay {
	return getUTCISODayFromLocalDate(localNow ?? moment.utc().toISOString());
}

/**
 * Convert iso day to iso month
 */
export function toISOMonth(isoDay: ISODay): ISOMonth {
	return isoDay.slice(0, 7) as ISOMonth;
}
