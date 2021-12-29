import moment from "moment"
import { SleepStage } from "@domain/measure/type"
import { HypnogramData, Steps } from "./hypnogram"

const cursor = moment().hour(22).minutes(0)

const input: HypnogramData = [{
    type: SleepStage.AWAKE,
    start: cursor.toISOString(),
    end: cursor.hour(23).toISOString()
}, {
    type: SleepStage.REM,
    start: cursor.toISOString(),
    end: cursor.add(10, "minutes").toISOString(),
}, {
    type: SleepStage.LIGHT,
    start: cursor.toISOString(),
    end: cursor.add(30, "minutes").toISOString(),
}, {
    type: SleepStage.DEEP,
    start: cursor.toISOString(),
    end: cursor.add(1, "day").hour(1).minutes(30).toISOString(),
}, {
    type: SleepStage.AWAKE,
    start: cursor.toISOString(),
    end: cursor.hour(2).toISOString(),
}]

const output: Steps = [
    // TODO to complete
    { x: 0, y: 1.1 },
]

test.todo("should convert sleep stages to victory pie data steps")