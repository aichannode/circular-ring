import { StageInfos } from "@domain/measure/representation/type";
import { ActivityStage, SleepStage } from "@domain/measure/type";

export function sample<T extends SleepStage | ActivityStage>(stages: StageInfos<T>[]) {
    throw("Not implemented")
}