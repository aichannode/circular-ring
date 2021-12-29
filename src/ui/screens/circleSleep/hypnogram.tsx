import { StageInfos } from "@domain/measure/representation/type"
import { SleepStage } from "@domain/measure/type"
import React from "react"
import { VictoryChart, VictoryArea } from "victory-native"
import { toStepsData } from "./business"

export type HypnogramData = Array<StageInfos<SleepStage>>
export type Steps = Array<{
    /** Time in milliseconds */
    x: number,
    /** Stage value */
    y: number
}>

type Props = {
    data: HypnogramData
}

export function Hypnogram({data}: Props) {
    const stepsData = toStepsData(data)
    return (
        <VictoryChart>
            <VictoryArea
                style={{ data: { stroke: "blue", fill: "transparent" } }}
                data={stepsData}
            />
        </VictoryChart>
    )
}