import moment from "moment";
import { SleepStage } from "@domain/measure/type";
import { HypnogramData, Steps } from "./hypnogram";
import { toStepsData } from "./business";

const cursor = moment().hour(22).minutes(0);

const input: HypnogramData = [
	{
		type: SleepStage.AWAKE,
		start: cursor.toISOString(),
		end: cursor.hour(23).toISOString(),
	},
	{
		type: SleepStage.REM,
		start: cursor.toISOString(),
		end: cursor.add(10, "minutes").toISOString(),
	},
	{
		type: SleepStage.LIGHT,
		start: cursor.toISOString(),
		end: cursor.add(30, "minutes").toISOString(),
	},
	{
		type: SleepStage.DEEP,
		start: cursor.toISOString(),
		end: cursor.add(1, "day").hour(1).minutes(30).toISOString(),
	},
	{
		type: SleepStage.AWAKE,
		start: cursor.toISOString(),
		end: cursor.hour(2).toISOString(),
	},
];

const output: Steps = [
	// AWAKE
	{ x: moment(input[0].start).valueOf(), y: 4 },
	{ x: moment(input[0].end).valueOf(), y: 4 },
	// REM
	{ x: moment(input[1].start).valueOf(), y: 3 },
	{ x: moment(input[1].end).valueOf(), y: 3 },
	// LIGHT
	{ x: moment(input[2].start).valueOf(), y: 2 },
	{ x: moment(input[2].end).valueOf(), y: 2 },
	// DEEP
	{ x: moment(input[3].start).valueOf(), y: 1 },
	{ x: moment(input[3].end).valueOf(), y: 1 },
	// AWAKE
	{ x: moment(input[4].start).valueOf(), y: 4 },
	{ x: moment(input[4].end).valueOf(), y: 4 },
];

test("should convert sleep stages to victory pie data steps", function () {
	expect(toStepsData(input)).toEqual(output);
});
