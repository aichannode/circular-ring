export type DatedMetrics<T extends MetricType = MetricType> = {
	timestamp: string;
	metrics: Metrics<T>;
};

export type Metrics<M extends MetricType> = Partial<{
	[k in M]: number | string;
}>;

/**
 * Structure for measure model data for efficient search
 * Each range contains:
 * - the data evolution over range time for the given T metrics
 * - the last value of the range for the given F metrics
 */
export type RangeMetrics<T extends MetricType = MetricType, F extends MetricType = MetricType> = {
	// le premier varie au cours du temps le deuxieme valeur fixes
	timeSeries: Array<DatedMetrics<T>>;
	constant: Metrics<F>;
};

export enum MetricType {
	/////////////////////
	// Score per domain
	/////////////////////
	UserDailyGlobalScore = "user.daily.global.score",
	UserDailyEnergyScore = "user.daily.energy.score",
	UserDailySleepScore = "user.daily.sleep.score",
	User2DaysSleepScore = "user.2days.sleep.score",

	/////////////////////
	// Score contributors
	/////////////////////
	UserDailyBodyRecovery = "user.daily.body.recovery",
	UserDailyBodyRecoveryGoalMin = "user.daily.body.recovery.goal.min",
	UserDailyBodyRecoveryGoalMax = "user.daily.body.recovery.goal.max",

	UserDailyWakeUpScore = "user.daily.wake.up.score",
	UserDailyWakeUpScoreGoalMin = "user.daily.wake.up.score.goal.min",
	UserDailyWakeUpScoreGoalMax = "user.daily.wake.up.score.goal.max",

	UserDailyAsleepBR = "user.daily.asleep.br",
	UserDailyScoreBR = "user.daily.score.br",
	UserDailyScoreBRGoalMin = "user.daily.score.br.goal.min",
	UserDailyScoreBRGoalMax = "user.daily.score.br.goal.max",

	UserDailyAsleepSPO2 = "user.daily.asleep.spo2",
	UserDailyScoreSPO2 = "user.daily.score.spo2",
	UserDailyScoreSPO2GoalMin = "user.daily.score.spo2.goal.min",
	UserDailyScoreSPO2GoalMax = "user.daily.score.spo2.goal.max",

	UserDailyAsleepHRV = "user.daily.asleep.hrv",
	UserDailyScoreHRV = "user.daily.score.hrv",
	UserDailyScoreHRVGoalMin = "user.daily.score.hrv.goal.min",
	UserDailyScoreHRVGoalMax = "user.daily.score.hrv.goal.max",

	UserDailyRHR = "user.daily.rhr",
	UserDailyScoreRHR = "user.daily.score.rhr",
	UserDailyScoreRHRGoalMin = "user.daily.score.rhr.goal.min",
	UserDailyScoreRHRGoalMax = "user.daily.score.rhr.goal.max",

	UserDailySleepVarTemperature = "user.daily.sleep.var.temperature",
	UserDailyScoreVarTemperature = "user.daily.score.var.temperature",
	UserDailyScoreVarTemperatureGoalMin = "user.daily.score.var.temperature.goal.min",
	UserDailyScoreVarTemperatureGoalMax = "user.daily.score.var.temperature.goal.max",

	UserDailySleepScoreGoalMin = "user.daily.sleep.score.goal.min",
	UserDailySleepScoreGoalMax = "user.daily.sleep.score.goal.max",

	UserDailySleepBalance = "user.daily.sleep.balance",
	UserDailySleepBalanceGoalMin = "user.daily.sleep.balance.goal.min",
	UserDailySleepBalanceGoalMax = "user.daily.sleep.balance.goal.max",
	UserDailyScoreSleepBalance = "user.daily.score.sleep.balance",

	UserDailyActivityVolume = "user.daily.activity.volume",
	UserDailyActivityVolumeGoalMin = "user.daily.activity.volume.goal.max",
	UserDailyActivityVolumeGoalMax = "user.daily.activity.volume.goal.min",

	UserDailyAwakeStageDuration = "user.daily.awake.stage.duration",
	UserDailyPercAwakeStage = "user.daily.percawake.stage",

	UserDailyRealSleepDuration = "user.daily.real.sleep.duration",
	UserDailyPercRealSleep = "user.daily.percreal.sleep",

	UserDailyTranquility = "user.daily.tranquility",
	UserDailyTranquilityGoalMin = "user.daily.tranquility.goal.min",
	UserDailyTranquilityGoalMax = "user.daily.tranquility.goal.max",

	UserDailyCircadianRhythm = "user.daily.circadian.rhythm",
	UserDailyCircadianRhythmGoalMin = "user.daily.circadian.rhythm.goal.min",
	UserDailyCircadianRhythmGoalMax = "user.daily.circadian.rhythm.goal.max",

	UserDailyPercREMStageScore = "user.daily.percrem.stage.score",
	UserDailyPercREMStageScoreGoalMin = "user.daily.percrem.stage.score.goal.min",
	UserDailyPercREMStageScoreGoalMax = "user.daily.percrem.stage.score.goal.max",

	UserDailyPercDeepStage = "user.daily.percdeep.stage",
	UserDailyPercDeepStageScoreGoalMin = "user.daily.percdeep.stage.score.goal.min",
	UserDailyPercDeepStageScoreGoalMax = "user.daily.percdeep.stage.score.goal.max",

	UserDailyCoreTimeToFallAsleep = "user.daily.core.time.to.fall.asleep",
	UserDailyPercTimeToFallAsleep = "user.daily.perctime.to.fall.asleep",
	UserDailyPercTimeToFallAsleepGoalMin = "user.daily.perctime.to.fall.asleep.goal.min",
	UserDailyPercTimeToFallAsleepGoalMax = "user.daily.perctime.to.fall.asleep.goal.max",

	UserDailySleepDebt = "user.daily.sleep.debt",
	UserDailyPercSleepDebt = "user.daily.percsleep.debt",
	UserDailyPercSleepDebtGoalMin = "user.daily.percsleep.debt.goal.min",
	UserDailyPercSleepDebtGoalMax = "user.daily.percsleep.debt.goal.max",

	//////////////
	// Daily sleep stages
	//////////////
	UserSleepStage = "user.sleep.stage",
	UserCoreSleepBegin = "user.core.sleep.begin",
	UserCoreSleepEnd = "user.core.sleep.end",
	UserNapSleepBegin = "user.nap.sleep.begin",
	UserNapSleepEnd = "user.nap.sleep.end",
	UserDailyTotalSleepDuration = "user.daily.total.sleep.duration",
	UserDailyLightStageDuration = "user.daily.light.stage.duration",
	UserDailyDeepStageDuration = "user.daily.deep.stage.duration",
	UserDailyREMStageDuration = "user.daily.rem.stage.duration",
	UserDailyPercREMStage = "user.daily.percrem.stage",
	UserDailyPercLightStage = "user.daily.perclight.stage",

	/////////////////
	// Daily activity duration
	/////////////////
	UserDataActivityIntensity = "user.data.activity.intensity",
	UserDailyActivityTotal = "user.daily.activity.total",
	UserDailySportBegin = "user.daily.sport.begin",
	UserDailySportEnd = "user.daily.sport.end",

	///////////////////
	// Daily activities
	///////////////////
	UserDailySteps = "user.daily.steps",
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",

	UserDailyWalkingEquivalency = "user.daily.walking.equivalency",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",

	UserDailyCaloriesBurned = "user.daily.calories.burned",
	UserDailyCaloriesBurnedGoal = "user.daily.calories.burned.goal",

	UserDailyCardioPoints = "user.daily.cardio.points",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",

	UserDailyVO2Max = "user.daily.V02max",

	///////////////////
	// HR
	///////////////////
	UserHR = "user.hr",
	UserDailyHRMax = "user.daily.hr.max",
	UserDailyAwakeHRMax = "user.daily.awake.hr.max",
	UserDailyAwakeHRMin = "user.daily.awake.hr.min",
	UserDailyAwakeHRAverage = "user.daily.awake.hr",
	UserDailyAwakeHRReference = "user.reference.awake.hr",
}
