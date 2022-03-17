import moment from "moment";
import timezone_mock from "timezone-mock";
import {
	assertISODay,
	assertISOMonth,
	assertLocalDate,
	getCurrentLocalISODay,
	getLocalDayFromUTCDate,
	getLocalISODayFromLocalDate,
	getUTCCurrentLocalISODay,
	getUTCISODayFromLocalDate,
	isISODay,
	isISOMonth,
	isToday,
	isUTCDate,
	isYesterday,
	toISOMonth,
	toUTC,
} from "./business";

const today = "2021-10-12T14:31:06.585Z";

it("should be a today date", function () {
	expect(isToday("2021-10-12T10:31:06.585Z", today)).toBeTruthy();
});

it("should not be a today date", function () {
	expect(isToday("2021-09-11T14:31:06.585Z", today)).toBeFalsy();
});

it("should not be a yesterday date", function () {
	expect(isYesterday("2021-10-09T10:31:06.585Z", today)).toBeFalsy();
});

it("should be a yesterday date", function () {
	expect(isYesterday("2021-10-11T14:31:06.585Z", today)).toBeTruthy();
});

test("isIDODay", function () {
	expect(isISODay("2012-01-01T17:52:27.8116975-12:00")).toBeFalsy();
	expect(isISODay("2012-02-01T18:21:06")).toBeFalsy();
	expect(isISODay("2012-03-01T00:00:00Z")).toBeFalsy();
	expect(isISODay("2012-01-01")).toBeTruthy();
	expect(isISODay("2012-01")).toBeFalsy();
});

test("isUTCDate", function () {
	expect(isUTCDate("2012-01-01T17:52:27.8116975-12:00")).toBeTruthy();
	expect(isUTCDate("2022-03-01T00:00:00.000+00:00")).toBeTruthy();
	expect(isUTCDate("2022-03-01T00:00:00.000Z")).toBeTruthy();
	expect(isUTCDate("2022-03-02T00:02:00Z")).toBeTruthy();
	expect(isUTCDate("2012-02-01T18:21:06")).toBeFalsy();
});

test("isISOMonth", function () {
	expect(isISOMonth("2012-01-01T17:52:27.8116975-12:00")).toBeFalsy();
	expect(isISOMonth("2012-02-01T18:21:06")).toBeFalsy();
	expect(isISOMonth("2012-03-01T00:00:00Z")).toBeFalsy();
	expect(isISOMonth("2012-01-01")).toBeFalsy();
	expect(isISOMonth("2012-01")).toBeTruthy();
});

it("should throw on iso month", function () {
	expect(() => assertISODay("2022-02")).toThrow();
});

it("should throw on iso day", function () {
	expect(() => assertISOMonth("2022-02-02")).toThrow();
});

it("should throw on a local date", function () {
	expect(() => assertLocalDate(moment().toISOString())).toThrow();
});

it("should throw on a UTC date", function () {
	expect(() => assertLocalDate(moment.utc().toISOString())).toThrow();
});

test("getLocalISODayFromLocalDate ", function () {
	timezone_mock.register("US/Pacific");
	expect(getLocalISODayFromLocalDate("2022-03-01T00:00:00.000")).toBe("2022-03-01");
	timezone_mock.register("UTC");
	expect(getLocalISODayFromLocalDate("2022-03-01T23:00:00.000")).toBe("2022-03-01");
});

test("getUTCISODayFromLocalDate ", function () {
	timezone_mock.register("US/Pacific");
	expect(getUTCISODayFromLocalDate("2022-02-28T07:00:00.000")).toBe("2022-02-28");
	timezone_mock.register("UTC");
	expect(getUTCISODayFromLocalDate("2022-02-28T23:00:00.000")).toBe("2022-02-28");
});

test("getLocalDayFromUTCDate", function () {
	timezone_mock.register("US/Pacific");
	expect(getLocalDayFromUTCDate("2022-03-01T00:00:00.000Z")).toBe("2022-02-28");
	timezone_mock.register("UTC");
	expect(getLocalDayFromUTCDate("2022-03-01T00:00:00.000Z")).toBe("2022-03-01");
});

test("getCurrentLocalISODay", function () {
	timezone_mock.register("US/Pacific");
	expect(getCurrentLocalISODay("2022-03-01T00:00:00.000")).toBe("2022-03-01");
	timezone_mock.register("UTC");
	expect(getCurrentLocalISODay("2022-03-01T00:00:00.000")).toBe("2022-03-01");
});

test("getUTCCurrentLocalISODay", function () {
	timezone_mock.register("US/Pacific");
	expect(getUTCCurrentLocalISODay("2022-02-28T08:00:00.000")).toBe("2022-02-28");
	timezone_mock.register("UTC");
	expect(getUTCCurrentLocalISODay("2022-03-01T00:00:00.000")).toBe("2022-03-01");
});

test("toISOMonth", function () {
	expect(toISOMonth("2022-03-01")).toBe("2022-03");
});

test("toUTC", function () {
	timezone_mock.register("US/Pacific");
	expect(toUTC("2022-03-01")).toBe("2022-03-01T08:00:00.000Z");
	timezone_mock.register("UTC");
});
