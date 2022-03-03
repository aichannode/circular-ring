import { ScoreQuality } from "./api";
import { canDisplay, getScoreControlStates } from "./business";

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
