import { ActivityStage, SleepStage } from "../type";
import { StageInfos } from "./lib/type";

export type DailyActivityIntensityData = {
	stages: Array<StageInfos<ActivityStage>>;
	duration: number;
	sportSessionTimes: Array<[string | undefined, string | undefined]>;
};
export type DailySleepData = {
	stages: Array<StageInfos<SleepStage>>;
	totalMinutesSleepDuration: number;
	coreSleepTiming?: [string, string];
	sleepStagesDuration: Partial<{
		[SleepStage.AWAKE]: { duration: number; percent: number };
		[SleepStage.REM]: { duration: number; percent: number };
		[SleepStage.LIGHT]: { duration: number; percent: number };
		[SleepStage.DEEP]: { duration: number; percent: number };
	}>;
};
