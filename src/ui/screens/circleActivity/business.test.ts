import { StageInfos } from "@domain/measure/representation/type"
import { ActivityStage } from "@domain/measure/type"
import moment from "moment"

const start = moment().hour(12).minutes(0)
const stageCursor = moment(start)
const sampleCursor = moment(start)

// Two hours of activity presented by stages
const activityInput: StageInfos<ActivityStage>[] = [{
    type: ActivityStage.LOW,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}, {
    type: ActivityStage.MEDIUM,
    start: stageCursor.toISOString(),
    end: stageCursor.add(20, "minutes").toISOString()
}, {
    type: ActivityStage.HIGH,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}, {
    type: ActivityStage.LOW,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}, {
    type: ActivityStage.MEDIUM,
    start: stageCursor.toISOString(),
    end: stageCursor.add(40, "minutes").toISOString()
}, {
    type: ActivityStage.HIGH,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}, {
    type: ActivityStage.LOW,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}, {
    type: ActivityStage.SEDENTARY,
    start: stageCursor.toISOString(),
    end: stageCursor.add(10, "minutes").toISOString()
}]

// This output is an array of the average intensity by slice of 15 minutes
const sampledActivityOutput = [{
    value: 1.333, // 10 minutes of low + 5 minutes of medium
    time: sampleCursor.toISOString(),
}, {
    value: 2, // 15 minutes of medium
    time: sampleCursor.toISOString(),
},{
    value: 2.667, // 10 minutes of high + 5 minutes of low
    time: sampleCursor.toISOString(),
},{
    value: 1.667, // 5 minutes of low + 10 minutes of medium
    time: sampleCursor.toISOString(),
},{
    value: 2, // 15 minutes of medium
    time: sampleCursor.toISOString(),
},{
    value: 2, // 15 minutes of medium
    time: sampleCursor.toISOString(),
},{
    value: 2.667, // 10 minutes of high + 5 minutes of low
    time: sampleCursor.toISOString(),
},{
    value: 2.667, // 5 minutes of low + 10 minutes of sedantary
    time: sampleCursor.toISOString(),
}]

it.todo("should sample 2 hours of activity input by 15 minutes average")