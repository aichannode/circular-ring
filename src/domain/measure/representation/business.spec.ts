import { ScoreQuality } from "./api";
import { canDisplay, getScoreControlStates, parseDailyHR } from "./business";

test("Specs: 00000. Display mode", function () {
	const today = "2022-03-01";
	const yesterdaySleepCoreEnd = Date.parse("2022-02-28T14:05:19.941Z");
	const todaySleepCoreEnd = Date.parse("2022-03-01T07:05:19.941Z");
	const tomorrowSleepCoreEnd = Date.parse("2022-03-02T14:05:19.941Z");
	expect(canDisplay(today, yesterdaySleepCoreEnd)).toBeFalsy();
	expect(canDisplay(today, todaySleepCoreEnd)).toBeTruthy();
	expect(canDisplay(today, tomorrowSleepCoreEnd)).toBeFalsy();
});

test("Specs: 00001. Score control states", function () {
	expect(
		getScoreControlStates({
			score: 0.2,
			lowThreshold: 0.8,
			highThreshold: 0.9,
		})
	).toEqual(ScoreQuality.POOR);
	expect(
		getScoreControlStates({
			score: 0.81,
			lowThreshold: 0.8,
			highThreshold: 0.9,
		})
	).toEqual(ScoreQuality.GOOD);
	expect(
		getScoreControlStates({
			score: 0.94,
			lowThreshold: 0.8,
			highThreshold: 0.9,
		})
	).toEqual(ScoreQuality.OPTIMAL);
});

test("Specs: 00002. DailyHR hooks", () => {
	expect(parseDailyHR(undefined)).toBeUndefined();
	expect(parseDailyHR({ timeSeries: [], constant: {} })).toBeUndefined();
	const exampleData = {
		timeSeries: [
			{ metrics: { "user.hr": 0 }, timestamp: "2022-03-10T14:10:00Z" },
			{ metrics: { "user.hr": 10 }, timestamp: "2022-03-10T14:12:00Z" },
			{ metrics: { "user.hr": 20 }, timestamp: "2022-03-10T14:14:00Z" },
			{ metrics: { "user.hr": 30 }, timestamp: "2022-03-10T14:16:00Z" },
			{ metrics: { "user.hr": 40 }, timestamp: "2022-03-10T14:18:00Z" },
			{ metrics: { "user.hr": 50 }, timestamp: "2022-03-10T14:20:00Z" },
			{ metrics: { "user.hr": 60 }, timestamp: "2022-03-10T14:22:00Z" },
			{ metrics: { "user.hr": 70 }, timestamp: "2022-03-10T14:24:00Z" },
		],
		constant: { "user.daily.awake.hr": 69.34, "user.daily.awake.hr.max": 112, "user.daily.awake.hr.min": 30 },
	};
	const expectedReturn = {
		lines: [
			{ y: 0, x: Date.parse("2022-03-10T14:10:00Z") },
			{ y: 10, x: Date.parse("2022-03-10T14:12:00Z") },
			{ y: 20, x: Date.parse("2022-03-10T14:14:00Z") },
			{ y: 30, x: Date.parse("2022-03-10T14:16:00Z") },
			{ y: 40, x: Date.parse("2022-03-10T14:18:00Z") },
			{ y: 50, x: Date.parse("2022-03-10T14:20:00Z") },
			{ y: 60, x: Date.parse("2022-03-10T14:22:00Z") },
			{ y: 70, x: Date.parse("2022-03-10T14:24:00Z") },
		],
		constant: { hr: 69.34, hrMax: 112, hrMin: 30 },
	};
	expect(expectedReturn).toEqual(parseDailyHR(exampleData));
});
