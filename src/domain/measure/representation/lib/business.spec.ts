import { createSleepStagesGetter } from "./business";
import mockedData from "./mockedModelData.json";

test("getSleepStages", function () {
	expect(createSleepStagesGetter("2021-12-21")(mockedData)).toEqual({
		totalMinutesSleepDuration: 496,
		stages: [
			{
				stage: 2,
				start: "2021-12-20T23:24:00.000Z",
				end: "2021-12-20T23:36:00.000Z",
			},
			{
				stage: 1,
				start: "2021-12-20T23:36:00.000Z",
				end: "2021-12-21T00:16:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T00:16:00.000Z",
				end: "2021-12-21T00:25:00.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T00:25:00.000Z",
				end: "2021-12-21T00:50:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T00:50:00.000Z",
				end: "2021-12-21T01:02:01.000Z",
			},
			{
				stage: 1,
				start: "2021-12-21T01:02:01.000Z",
				end: "2021-12-21T01:16:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T01:16:00.000Z",
				end: "2021-12-21T01:52:00.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T01:52:00.000Z",
				end: "2021-12-21T02:07:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T02:07:00.000Z",
				end: "2021-12-21T03:32:01.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T03:32:01.000Z",
				end: "2021-12-21T03:37:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T03:37:00.000Z",
				end: "2021-12-21T03:46:01.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T03:46:01.000Z",
				end: "2021-12-21T04:04:01.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T04:04:01.000Z",
				end: "2021-12-21T04:42:01.000Z",
			},
			{
				stage: 1,
				start: "2021-12-21T04:42:01.000Z",
				end: "2021-12-21T04:50:01.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T04:50:01.000Z",
				end: "2021-12-21T05:06:01.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T05:06:01.000Z",
				end: "2021-12-21T05:18:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T05:18:00.000Z",
				end: "2021-12-21T05:49:00.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T05:49:00.000Z",
				end: "2021-12-21T06:20:00.000Z",
			},
			{
				stage: 2,
				start: "2021-12-21T06:20:00.000Z",
				end: "2021-12-21T07:32:00.000Z",
			},
			{
				stage: 4,
				start: "2021-12-21T07:32:00.000Z",
				end: "2021-12-21T07:38:00.000Z",
			},
			{
				stage: 3,
				start: "2021-12-21T07:38:00.000Z",
				end: "2021-12-21T07:42:00.000Z",
			},
		],
		coreSleepTiming: ["2021-12-20T23:24:00", "2021-12-21T07:40:00"],
		sleepStagesDuration: {
			1: {
				duration: 89,
				percent: 0.2,
			},
			2: {
				duration: 98,
				percent: 0.11,
			},
			3: {
				duration: 98,
				percent: 0.2,
			},
			4: {
				duration: 2,
				percent: 0,
			},
		},
	});
});
test.todo("getActivityPhases");
