import { StageInfos } from "@domain/measure/representation/type";
import { ActivityStage } from "@domain/measure/type";
import moment from "moment";
import { sample } from "./business";

const start = moment().hour(8).minutes(30);
const stageCursor = moment(start);
const sampleCursor = moment(start);

// Two hours of activity presented by stages
const activityInput: StageInfos<ActivityStage>[] = [
	{
		type: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 12h
		end: stageCursor.add(10, "minutes").toISOString(),
	},
	{
		type: ActivityStage.MEDIUM,
		start: stageCursor.toISOString(), // 12h10
		end: stageCursor.add(20, "minutes").toISOString(),
	},
	{
		type: ActivityStage.HIGH,
		start: stageCursor.toISOString(), // 12h30
		end: stageCursor.add(10, "minutes").toISOString(),
	},
	{
		type: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 12h40
		end: stageCursor.add(10, "minutes").toISOString(),
	},
	{
		type: ActivityStage.MEDIUM,
		start: stageCursor.toISOString(), // 13h20
		end: stageCursor.add(40, "minutes").toISOString(),
	},
	{
		type: ActivityStage.HIGH,
		start: stageCursor.toISOString(), // 13h30
		end: stageCursor.add(10, "minutes").toISOString(),
	},
	{
		type: ActivityStage.LOW,
		start: stageCursor.toISOString(), // 13h40
		end: stageCursor.add(10, "minutes").toISOString(),
	},
	{
		type: ActivityStage.SEDENTARY,
		start: stageCursor.toISOString(), // 13h50
		end: stageCursor.add(10, "minutes").toISOString(), // 14h
	},
];

// This output is an array of the average intensity by slice of 15 minutes

export const mockActivityIntensity = [
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.667, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.2, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.667, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.2, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.667, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.2, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.667, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
];

export const sampledActivityOutput = [
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.667, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1.333, // 10 minutes of low + 5 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 3.2, // 5 minutes of low + 10 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 2, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 1, // 15 minutes of medium
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 10 minutes of high + 5 minutes of low
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
	{
		value: 0.667, // 5 minutes of low + 10 minutes of sedantary
		time: sampleCursor.add(15, "minutes").toISOString(),
	},
];

// it("should sample 2 hours of activity input by 15 minutes average", () => {
// 	expect(sample(activityInput)).toEqual(sampledActivityOutput);
// });
