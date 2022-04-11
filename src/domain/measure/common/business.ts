import { assertISODay } from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
import moment from "moment";
import { TimeFrame } from "../type";

/**
 * Return the UTC iso date of the start and the end for a given time segment and a given local iso day/month
 */
export function toUTCTimeSegment(
	localISODate: ISODay | ISOMonth,
	timeFrame: TimeFrame
): { isoStart: string; isoEnd: string } {
	switch (timeFrame) {
		case TimeFrame.TODAY:
		case TimeFrame.DAY:
			assertISODay(localISODate);
			return {
				isoStart: moment(localISODate).subtract(1, "day").startOf("day").toISOString(), // ensure a large enough timeframe to capture data like core.sleep.begin
				isoEnd: moment(localISODate).endOf("day").toISOString(),
			};
		case TimeFrame.LAST_7_DAYS:
			assertISODay(localISODate);
			return {
				isoStart: moment(localISODate).subtract(8, "day").startOf("day").toISOString(),
				isoEnd: moment(localISODate).subtract(1, "day").endOf("day").toISOString(),
			};
		case TimeFrame.WEEK:
			assertISODay(localISODate);
			return {
				isoStart: moment(localISODate).startOf("week").toISOString(),
				isoEnd: moment(localISODate).endOf("week").toISOString(),
			};
		case TimeFrame.LAST_30_DAYS:
			assertISODay(localISODate);
			return {
				isoStart: moment(localISODate).subtract(31, "day").startOf("day").toISOString(),
				isoEnd: moment(localISODate).subtract(1, "day").endOf("day").toISOString(),
			};
		case TimeFrame.MONTH:
			return {
				isoStart: moment(localISODate).startOf("month").toISOString(),
				isoEnd: moment(localISODate).endOf("month").toISOString(),
			};
		case TimeFrame.ALL:
			return {
				isoStart: moment(0).toISOString(),
				isoEnd: moment().toISOString(),
			};
	}
}
