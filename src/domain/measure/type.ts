import { DatedMetrics, MetricType } from "./metric"

export enum SleepStage {
	AWAKE = 4,
	REM = 3,
	LIGHT = 2,
	DEEP = 1,
}

export enum ActivityStage {
	SEDENTARY = 1,
	LOW = 2,
	MEDIUM = 3,
	HIGH = 4,
}

export enum TimeFrame {
	TODAY = "TODAY",
	LAST_7_DAYS = "LAST_7_DAYS",
	LAST_30_DAYS = "LAST_30_DAYS",
	YEAR = "YEAR",
	ALL = "ALL",
}

export type UserProperties = {
	"user.firstname": string,
	"user.lastname": string,
	"user.sex":string,
	"user.birthday":string,
	"user.stride.choice":string,
	"user.worktime":string,
	"user.sleepertype":string,
	"user.chronotype":string,
	"user.sleep.disorder":string,
	"user.physical_disability":string,
	"user.open.for.nap":string,
	"user.sleep.aid":string,
	"user.sleep.need":string,
	"user.tz":string,
	"user.age":number,
	"user.stride":number,
}

export type MetricDto<T extends MetricType = MetricType> = {
	metrics: DatedMetrics<T>[]
	user_properties: UserProperties
}