import { ActivityStage } from "@domain/measure/type";
import moment from "moment";
import { sample } from "./business";

const start = moment().hour(12).minutes(0);
const stageCursor = moment(start);
const sampleCursor = moment(start);

// Two hours of activity presented by stages
const activityInput = [
	{
		stage: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 12h
		end: stageCursor.add(10, "minutes").toISOString(), // 12h10
	},
	{
		stage: ActivityStage.MEDIUM,
		start: stageCursor.toISOString(), // 12h10
		end: stageCursor.add(20, "minutes").toISOString(), // 12h30
	},
	{
		stage: ActivityStage.HIGH,
		start: stageCursor.toISOString(), // 12h30
		end: stageCursor.add(10, "minutes").toISOString(), // 12h40
	},
	{
		stage: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 12h40
		end: stageCursor.add(10, "minutes").toISOString(), // 12h50
	},
	{
		stage: ActivityStage.MEDIUM,
		start: stageCursor.toISOString(), // 12h50
		end: stageCursor.add(40, "minutes").toISOString(), // 13h30
	},
	{
		stage: ActivityStage.HIGH,
		start: stageCursor.toISOString(), // 13h30
		end: stageCursor.add(10, "minutes").toISOString(), // 13h40
	},
	{
		stage: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 13h40
		end: stageCursor.add(10, "minutes").toISOString(), // 13h50
	},
	{
		stage: ActivityStage.SEDENTARY,
		start: stageCursor.toISOString(), // 13h50
		end: stageCursor.add(10, "minutes").toISOString(), // 14h
	},
];

// This output is an array of the average intensity by slice of 15 minutes
const sampledActivityOutput = [
	{
		value: 2.333333333333333, // 10 minutes of low + 5 minutes of medium
		isoTime: sampleCursor.toISOString(),
	},
	{
		value: 3, // 15 minutes of medium
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.333333333333333, // 10 minutes of high + 5 minutes of low
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.6666666666666665, // 5 minutes of low + 10 minutes of medium
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3, // 15 minutes of medium
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3, // 15 minutes of medium
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.333333333333333, // 10 minutes of high + 5 minutes of low
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.3333333333333333, // 5 minutes of low + 10 minutes of sedantary
		isoTime: sampleCursor.add(15, "minutes").toISOString(),
	},
];

it("should sample 2 hours of activity input by 15 minutes average", () => {
	expect(sample(activityInput, 60 * 15 * 1000)).toEqual(sampledActivityOutput);
});
