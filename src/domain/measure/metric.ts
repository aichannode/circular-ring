export type Metric<T extends MetricType = MetricType> = {
	[key in T]: number;
}

export type DatedMetrics<T extends MetricType = MetricType> = {
	timestamp: string;
	metrics: Partial<Metric<T>>;
}

export type RangeMetrics<T extends MetricType = MetricType> = Array<DatedMetrics<T>>

export enum MetricType {
	UserDailySteps = "user.daily.steps",
	UserDailyStepsGoal = "user.daily.steps.goal",
	UserDailyWalkingEquivalency = "user.daily.walking.equivalency",
	UserDailyWalkingEquivalencyGoal = "user.daily.walking.equivalency.goal",
	UserDailyCaloriesBurnedGoal = "user.daily.calories.burned.goal",
	UserDailyAwakeHrMax = "user.daily.awake.hr.max",
	UserDailyAsleepHrv = "user.daily.asleep.hrv",
	UserDailyAwakeHrv = "user.daily.awake.hrv",
	UserDailyBmi = "user.daily.bmi",
	UserDailyBmiCategory = "user.daily.bmi.category",
	UserAwakeBRHour = "user.awake.br.hour",
	UserAwakeHRHour = "user.awake.hr.hour",
	UserAwakeHRVHour = "user.awake.hrv.hour",
	UserAwakesSPO2Hour = "user.awake.spo2.hour",
	UserStepsHour = "user.steps.hour",
	UserAsleepBRHour = "user.asleep.br.hour",
	UserAsleepHRHour = "user.asleep.hr.hour",
	UserAsleepHRVHour = "user.asleep.hrv.hour",
	UserAsleepSPO2Hour = "user.asleep.spo2.hour",
	UserSleepstage = "user.sleep.stage",
	UserLifetimeSDAsleepHrv = "user.lifetime.sd.asleep.hrv",
	UserDailyTotalSleepDuration = "user.daily.total.sleep.duration",
	UserDailyRealSleepDuration = "user.daily.real.sleep.duration",
	UserDailyAwakeStageDuration = "user.daily.awake.stage.duration",
	UserDailyPercAwakeStageDuration = "user.daily.percawake.stage.duration",
	UserDailyAwakeStageDurationColor = "user.daily.awake.stage.duration.color",
	UserDailySleepStageDurationColor = "user.daily.sleep.stage.duration.color",
	UserDailyRemStageDuration = "user.daily.rem.stage.duration",
	UserDailyPercREMStage = "user.daily.percrem.stage",
	UserDailyPercDeepStage = "user.daily.percdeep.stage",
	UserCoreSleepBegin = "user.core.sleep.begin",
	UserCoreSleepEnd = "user.core.sleep.end",
	UserDailyPercRealSleep = "user.daily.percreal.sleep",
	UserDailyCorrectedPercremStage = "user.daily.corrected.percrem.stage",
	UserDailyPercREMStageScore = "user.daily.percrem.stage.score",
	UserDailyCorrectedPercDeepStage = "user.daily.corrected.percdeep.stage",
	UserDailyPercdeepStageScore = "user.daily.percdeep.stage.score",
	UserDailySleepScore = "user.daily.sleep.score",
	UserHR = "user.hr",
	UserSPO2 = "user.spo2",
	UserHRV = "user.hrv",
	UserBR = "user.br",
	UserTemperature = "UserTemperature",
	UserSteps = "user.steps",
	DeviceBattery = "device.battery",
	UserDataQuality = "user.data.quality",
	UserDataActivityIntensity = "user.data.activity.intensity",
	UserDataActivity = "user.data.activity",
	// Not implemented yet
	UserDailyTotalActivity = "user.daily.total.activity",
	// Deprecated metric, used to type checking only
	UserDailySleepQualityScore = "user.daily.wake.up.score",
	UserDailyGlobalScore = "user.daily.global.score",
	UserDailyTranquility = "user.daily.tranquility",
	UserDailyCircadianRhythm = "user.daily.circadian.rhythm",
	UserDailyTimeToFallAsleep = "user.daily.time.to.fall.asleep",
	UserDailyPercTimeTtoFallAsleep = "user.daily.perctime.to.fall.asleep",
	UserDailySleepDebt = "user.daily.sleep.debt",
	UserDailyPercSleepDebt = "user.daily.percsleep.debt",
	UserSleepNapping = "user.sleep.napping",
	UserDailyEnergyScore = "user.daily.energy.score",
	// User goals
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",
	UserWeeklyCardioPointsGoalMax = "user.weekly.cardio.points.goal.max",
	UserWeeklyCardioPointsGoalMin = "user.weekly.cardio.points.goal.min",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",
	MetricType = "MetricType"
}

export const dailyActivityGoals = [
	MetricType.UserDailyStepsGoalMin,
	MetricType.UserDailyStepsGoalMax,
	MetricType.UserDailyWalkingEquivalencyGoalMin,
	MetricType.UserDailyWalkingEquivalencyGoalMax,
	MetricType.UserWeeklyCardioPointsGoalMax,
	MetricType.UserWeeklyCardioPointsGoalMin,
	MetricType.UserDailyCardioPointsGoalMax,
	MetricType.UserDailyCardioPointsGoalMin,
] as const;
export type DailyActivityGoals = typeof dailyActivityGoals[number];


/**
 * Used by the service, globally fetch all data
 */

export const sleepMetrics = [
	MetricType.UserDailyTotalSleepDuration,
	MetricType.UserCoreSleepBegin,
	MetricType.UserCoreSleepEnd,
	MetricType.UserSleepstage,
	MetricType.UserDailyAwakeStageDuration,
	MetricType.UserDailyRealSleepDuration,
	MetricType.UserDailyPercREMStage,
	MetricType.UserDailyPercDeepStage,
	MetricType.UserDailyPercAwakeStageDuration,
	MetricType.UserDailyPercRealSleep,
	MetricType.UserDailyPercREMStageScore,
	MetricType.UserDailyPercdeepStageScore,
	// TODO to implement in back
	MetricType.UserDailyPercTimeTtoFallAsleep,
	MetricType.UserDailyPercSleepDebt,
	MetricType.UserDailyTranquility,
	MetricType.UserDailyCircadianRhythm,
	MetricType.UserDailyTimeToFallAsleep,
	MetricType.UserDailySleepDebt,
	MetricType.UserSleepNapping,
]

export const activityMetrics = [
	MetricType.UserDataActivityIntensity,
	MetricType.UserDailySteps,
	MetricType.UserDailyWalkingEquivalency,
	MetricType.UserDailyAwakeHrMax,
]
