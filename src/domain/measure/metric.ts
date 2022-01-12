export type Metric<T extends MetricType = MetricType> = {
	[key in T]: number;
}

export type DatedMetrics<T extends MetricType = MetricType> = {
	timestamp: string;
	metrics: Partial<Metric<T>>;
}

export type RangeMetrics<T extends MetricType = MetricType> = Array<DatedMetrics<T>>


export enum MetricType {
	// User sleep stages
	UserSleepstage = "user.sleep.stage",

	// User sleep quality details
	UserDailyTimeToFallAsleep = "user.daily.time.to.fall.asleep",
	UserDailyPercTimeToFallAsleep = "user.daily.perctime.to.fall.asleep",
	UserDailySleepDebt = "user.daily.sleep.debt",
	UserDailyPercSleepDebt = "user.daily.percsleep.debt",
	UserDailyTranquility = "user.daily.tranquility",
	UserDailyCircadianRhythm = "user.daily.circadian.rhythm",
	UserDailyTotalSleepDuration = "user.daily.total.sleep.duration",
	UserDailyRealSleepDuration = "user.daily.real.sleep.duration",
	UserDailyAwakeStageDuration = "user.daily.awake.stage.duration",
	UserDailyPercAwakeStageDuration = "user.daily.percawake.stage.duration",
	UserDailyPercREMStage = "user.daily.percrem.stage",
	UserDailyPercDeepStage = "user.daily.percdeep.stage",
	UserDailyPercRealSleep = "user.daily.percreal.sleep",
	UserDailyCorrectedPercREMStage = "user.daily.corrected.percrem.stage",
	UserDailyCorrectedPercDeepStage = "user.daily.corrected.percdeep.stage",
	UserDailySleepScore = "user.daily.sleep.score",

	// User sleep quality goal
	UserDailyPercAwakeStageDurationGoalMin = "user.daily.percawake.stage.duration.goal.min",
	UserDailyPercAwakeStageDurationGoalMax = "user.daily.percawake.stage.duration.goal.max",
	UserDailyPercRealSleepDurationGoalMin = "user.daily.percreal.sleep.duration.goal.min",
	UserDailyPercRealSleepDurationGoalMax = "user.daily.percreal.sleep.duration.goal.max",
	UserDailyTranquilityGoalMin = "user.daily.tranquility.goal.min",
	UserDailyTranquilityGoalMax = "user.daily.tranquility.goal.max",
	UserDailyCircadianRhythmGoalMin = "user.daily.circadian.rhythm.goal.min",
	UserDailyCircadianRhythmGoalMax = "user.daily.circadian.rhythm.goal.max",
	UserDailyPercREMStageScoreGoalMin = "user.daily.percrem.stage.score.goal.min",
	UserDailyPercREMStageScoreGoalMax = "user.daily.percrem.stage.score.goal.max",
	UserDailyPercDeepStageScoreGoalMin = "user.daily.percdeep.stage.score.goal.min",
	UserDailyPercDeepStageScoreGoalMax = "user.daily.percdeep.stage.score.goal.max",
	UserDailyPercTimeToFallAsleepGoalMin = "user.daily.perctime.to.fall.asleep.goal.min",
	UserDailyPercTimeToFallAsleepGoalMax = "user.daily.perctime.to.fall.asleep.goal.max",
	UserDailySleepDebtGoalMin = "user.daily.percsleep.debt.goal.min",
	UserDailySleepDebtGoalMax = "user.daily.percsleep.debt.goal.max",
	
	// Daily energy score details
	UserDailyScoreRecovery = "user.daily.score.recovery",
	UserDailyWakeUpScore = "user.daily.wake.up.score",
	UserDailySleepBR = "user.daily.sleep.br",
	UserDailyScoreBr = "user.daily.score.br",
	UserDailySleepHRV = "user.daily.sleep.hrv",
	UserDailyScoreHRV = "user.daily.score.hrv",
	UserDailyRHR = "user.daily.rhr",
	UserDailyScoreRHR = "user.daily.score.rhr",
	UserDailySleepVarTemperature = "user.daily.sleep.var.temperature",
	UserDailyScoreVarTemperature = "user.daily.score.var.temperature",
	UserDailyScoreSleepBalance = "user.daily.score.sleep.balance",
	UserDailyScoreActivityVolume = "user.daily.score.activity.volume",

	// User daily energy score details goal
	UserDailyScoreRecoveryGoalMin = "user.daily.score.recovery.goal.min",
	UserDailyScoreRecoveryGoalMax = "user.daily.score.recovery.goal.max",
	UserDailyWakeUpScoreGoalMin = "user.daily.wake.up.score.goal.min",
	UserDailyWakeUpScoreGoalMax = "user.daily.wake.up.score.goal.max",
	UserDailyScoreBRGoalMin = "user.daily.score.br.goal.min",
	UserDailyScoreBRGoalMax = "user.daily.sleep.br.goal.max",
	UserDailyScoreHRVGoalMin = "user.daily.score.hrv.goal.min",
	UserDailyScoreHRVGoalMax = "user.daily.score.hrv.goal.max",
	UserDailyScoreRHRGoalMin = "user.daily.score.rhr.goal.min",
	UserDailyScoreRHRGoalMax = "user.daily.score.rhr.goal.max",
	UserDailyScoreVarTemperatureGoalMin = "user.daily.score.var.temperature.goal.min",
	UserDailyScoreVarTemperatureGoalMax = "user.daily.score.var.temperature.goal.max",
	UserDailySleepScoreGoalMin = "user.daily.score.sleep.goal.min",
	UserDailySleepScoreGoalMax = "user.daily.score.sleep.goal.max",
	UserDailyScoreSleepBalanceGoalMin = "user.daily.score.sleep.balance.goal.min",
	UserDailyScoreSleepBalanceGoalMax = "user.daily.score.sleep.balance.goal.max",
	UserDailyScoreActivityVolumeGoalMin = "user.daily.score.activity.volume.goal.min",
	UserDailyScoreActivityVolumeGoalMax = "user.daily.score.activity.volume.goal.max",

	// User daily activity metrics
	UserDailySteps = "user.daily.steps",
	UserDailyWalkingEquivalency = "user.daily.walking.equivalency",
	UserDailyCaloriesBurned = "user.daily.calories.burned",
	UserDailyCardioPoints = "user.daily.cardio.points",
	UserDailyVO2Max = "user.daily.vo2max",
	UserDailyHRMax = "user.daily.hr.max",

	// User daily activity metrics goal
	UserDailyCaloriesBurnedGoalMin = "user.daily.calories.burned.goal.min",
	UserDailyCaloriesBurnedGoalMax = "user.daily.calories.burned.goal.max",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",
	UserWeeklyCardioPointsGoalMax = "user.weekly.cardio.points.goal.max",
	UserWeeklyCardioPointsGoalMin = "user.weekly.cardio.points.goal.min",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",

}