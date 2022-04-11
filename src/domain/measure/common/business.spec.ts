import { ISODay } from "@domain/common/type";
import timezone_mock from "timezone-mock";
import { TimeFrame } from "../type";
import { toUTCTimeSegment } from "./business";

test("toTimeSegment on US/Pacific", function () {
	timezone_mock.register("US/Pacific");
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.TODAY)).toEqual({
		isoStart: "2022-02-28T08:00:00.000Z",
		isoEnd: "2022-03-02T07:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.DAY)).toEqual({
		isoStart: "2022-02-28T08:00:00.000Z",
		isoEnd: "2022-03-02T07:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.LAST_7_DAYS)).toEqual({
		isoStart: "2022-02-21T08:00:00.000Z",
		isoEnd: "2022-03-01T07:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.WEEK)).toEqual({
		isoStart: "2022-02-27T08:00:00.000Z",
		isoEnd: "2022-03-06T07:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.LAST_30_DAYS)).toEqual({
		isoStart: "2022-01-29T08:00:00.000Z",
		isoEnd: "2022-03-01T07:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.MONTH)).toEqual({
		isoStart: "2022-03-01T08:00:00.000Z",
		isoEnd: "2022-04-01T06:59:59.999Z",
	});
});

test("toTimeSegment on UTC", function () {
	timezone_mock.register("UTC");
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.TODAY)).toEqual({
		isoStart: "2022-02-28T00:00:00.000Z",
		isoEnd: "2022-03-01T23:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.DAY)).toEqual({
		isoStart: "2022-02-28T00:00:00.000Z",
		isoEnd: "2022-03-01T23:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.LAST_7_DAYS)).toEqual({
		isoStart: "2022-02-21T00:00:00.000Z",
		isoEnd: "2022-02-28T23:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.WEEK)).toEqual({
		isoStart: "2022-02-27T00:00:00.000Z",
		isoEnd: "2022-03-05T23:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.LAST_30_DAYS)).toEqual({
		isoStart: "2022-01-29T00:00:00.000Z",
		isoEnd: "2022-02-28T23:59:59.999Z",
	});
	expect(toUTCTimeSegment("2022-03-01" as ISODay, TimeFrame.MONTH)).toEqual({
		isoStart: "2022-03-01T00:00:00.000Z",
		isoEnd: "2022-03-31T23:59:59.999Z",
	});
});
