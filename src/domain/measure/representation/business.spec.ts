import { MetricType } from "../metric";
import { canDisplay, getScoreControlStates, SleepScoreControlStates } from "./business";

test("Specs: 00000. Display mode", function () {
	const today = "2022-03-01";
	const yesterdaySleepCoreEnd = Date.parse("2022-02-28T14:05:19.941Z");
	const todaySleepCoreEnd = Date.parse("2022-03-01T07:05:19.941Z");
	const tomorrowSleepCoreEnd = Date.parse("2022-03-02T14:05:19.941Z");
	expect(canDisplay(today, yesterdaySleepCoreEnd)).toBeFalsy();
	expect(canDisplay(today, todaySleepCoreEnd)).toBeTruthy();
	expect(canDisplay(today, tomorrowSleepCoreEnd)).toBeFalsy();
});

test("Specs: 00001. Score sleep control states", function () {
	expect(
		getScoreControlStates({
			[MetricType.UserDailySleepScore]: 0.2,
			[MetricType.UserDailySleepScoreGoalMin]: 0.8,
			[MetricType.UserDailySleepScoreGoalMax]: 0.9,
		})
	).toEqual(SleepScoreControlStates.Poor);
	expect(
		getScoreControlStates({
			[MetricType.UserDailySleepScore]: 0.81,
			[MetricType.UserDailySleepScoreGoalMin]: 0.8,
			[MetricType.UserDailySleepScoreGoalMax]: 0.9,
		})
	).toEqual(SleepScoreControlStates.Good);
	expect(
		getScoreControlStates({
			[MetricType.UserDailySleepScore]: 0.94,
			[MetricType.UserDailySleepScoreGoalMin]: 0.8,
			[MetricType.UserDailySleepScoreGoalMax]: 0.9,
		})
	).toEqual(SleepScoreControlStates.Optimal);
});
