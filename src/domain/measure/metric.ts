export type Metric<T extends MetricType = MetricType> = {
	[key in T]: number | string;
};

export type DatedMetrics<T extends MetricType = MetricType> = {
	timestamp: string;
	metrics: Partial<Metric<T>>;
};

export type RangeMetrics<T extends MetricType = MetricType> = Array<DatedMetrics<T>>;

export enum MetricType {
	//////////////
	// Daily sleep
	//////////////
	UserSleepstage = "user.sleep.stage",
	UserCoreSleepBegin = "user.core.sleep.begin",
	UserCoreSleepEnd = "user.core.sleep.end",
	UserDailyLightStageDuration = "user.daily.light.stage.duration",
	UserDailyDeepStageDuration = "user.daily.deep.stage.duration",
	UserDailyREMStageDuration = "user.daily.rem.stage.duration",
	UserDailyTimeToFallAsleep = "user.daily.time.to.fall.asleep",
	UserDailyPercTimeToFallAsleep = "user.daily.perctime.to.fall.asleep",
	UserDailySleepDebt = "user.daily.sleep.debt",
	UserDailyPercSleepDebt = "user.daily.percsleep.debt",
	UserDailyTranquility = "user.daily.tranquility",
	UserDailyCircadianRhythm = "user.daily.circadian.rhythm",
	UserDailyTotalSleepDuration = "user.daily.total.sleep.duration",
	UserDailyRealSleepDuration = "user.daily.real.sleep.duration",
	UserDailyAwakeStageDuration = "user.daily.awake.stage.duration",
	UserDailyPercAwakeStage = "user.daily.percawake.stage",
	UserDailyPercLightStage = "user.daily.perclight.stage",
	UserDailyPercREMStage = "user.daily.percrem.stage",
	UserDailyPercDeepStage = "user.daily.percdeep.stage",
	UserDailyPercRealSleep = "user.daily.percreal.sleep",
	UserDailyCorrectedPercREMStage = "user.daily.corrected.percrem.stage",
	UserDailyCorrectedPercDeepStage = "user.daily.corrected.percdeep.stage",
	UserDailySleepScore = "user.daily.sleep.score",
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
	UserDailySleepBR = "user.daily.sleep.br",
	UserDailySleepVarTemperature = "user.daily.sleep.var.temperature",
	UserDailySleepScoreGoalMin = "user.daily.score.sleep.goal.min",
	UserDailySleepScoreGoalMax = "user.daily.score.sleep.goal.max",
	UserDailyScoreSleepBalanceGoalMin = "user.daily.score.sleep.balance.goal.min",
	UserDailyScoreSleepBalanceGoalMax = "user.daily.score.sleep.balance.goal.max",

	///////////////////
	// Daily metabolism
	///////////////////
	UserDailyScoreRecovery = "user.daily.score.recovery",
	UserDailyScoreBr = "user.daily.score.br",
	UserDailySleepHRV = "user.daily.sleep.hrv",
	UserDailyScoreHRV = "user.daily.score.hrv",
	UserDailyRHR = "user.daily.rhr",
	UserDailyScoreRHR = "user.daily.score.rhr",
	UserDailyScoreVarTemperature = "user.daily.score.var.temperature",
	UserDailyScoreSleepBalance = "user.daily.score.sleep.balance",
	UserDailyScoreActivityVolume = "user.daily.score.activity.volume",
	UserDailyScoreRecoveryGoalMin = "user.daily.score.recovery.goal.min",
	UserDailyScoreRecoveryGoalMax = "user.daily.score.recovery.goal.max",
	UserDailyWakeUpScore = "user.daily.wake.up.score",
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
	UserDailyScoreActivityVolumeGoalMin = "user.daily.score.activity.volume.goal.min",
	UserDailyScoreActivityVolumeGoalMax = "user.daily.score.activity.volume.goal.max",
	UserDailyCaloriesBurned = "user.daily.calories.burned",
	UserDailyCardioPoints = "user.daily.cardio.points",
	UserDailyVO2Max = "user.daily.vo2max",
	UserDailyHRMax = "user.daily.hr.max",
	UserDailyCaloriesBurnedGoalMin = "user.daily.calories.burned.goal.min",
	UserDailyCaloriesBurnedGoalMax = "user.daily.calories.burned.goal.max",
	UserWeeklyCardioPointsGoalMax = "user.weekly.cardio.points.goal.max",
	UserWeeklyCardioPointsGoalMin = "user.weekly.cardio.points.goal.min",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",

	/////////////////
	// Daily activity
	/////////////////
	UserDailySteps = "user.daily.steps",
	UserDailyWalkingEquivalency = "user.daily.walking.equivalency",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",
}
