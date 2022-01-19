import moment from "moment";
import { TimeFrame } from "../type";

const DAILY_KEY_FORMAT = "YYYY-MM-DD";

export function getKeyFromDate(isoDate?: string) {
	return moment(isoDate).format(DAILY_KEY_FORMAT);
}

export function toTimeSegment(isoDate: string, timeFrame: TimeFrame): { isoStart: string; isoEnd: string } {
	switch (timeFrame) {
		case TimeFrame.TODAY:
		case TimeFrame.DAY:
			return {
				isoStart: moment(isoDate).startOf("day").toISOString(),
				isoEnd: moment(isoDate).endOf("day").toISOString(),
			};
		case TimeFrame.LAST_7_DAYS:
			return {
				isoStart: moment(isoDate).subtract(8, "day").startOf("day").toISOString(),
				isoEnd: moment(isoDate).subtract(1, "day").endOf("day").toISOString(),
			};
		case TimeFrame.WEEK:
			return {
				isoStart: moment(isoDate).startOf("week").toISOString(),
				isoEnd: moment(isoDate).endOf("week").toISOString(),
			};
		case TimeFrame.LAST_30_DAYS:
			return {
				isoStart: moment(isoDate).subtract(31, "day").startOf("day").toISOString(),
				isoEnd: moment(isoDate).subtract(1, "day").endOf("day").toISOString(),
			};
		case TimeFrame.MONTH:
			return {
				isoStart: moment(isoDate).startOf("month").toISOString(),
				isoEnd: moment(isoDate).endOf("month").toISOString(),
			};
		case TimeFrame.ALL:
			return {
				isoStart: moment(0).toISOString(),
				isoEnd: moment().toISOString(),
			};
	}
}
