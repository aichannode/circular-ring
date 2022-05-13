export type DatedMetrics<T extends MetricType = MetricType> = {
	timestamp: string;
	metrics: Metrics<T>;
};

export type Metrics<M extends MetricType> = {
	[k in M]: number | string | null;
};

/**
 * Structure for measure model data for efficient search
 * Each range contains:
 * - the data evolution over range time for the given T metrics
 * - the last value of the range for the given F metrics
 */
export type RangeMetrics<T extends MetricType = MetricType, F extends MetricType = MetricType> = {
	// le premier varie au cours du temps le deuxieme valeur fixes
	timeSeries: ReadonlyArray<DatedMetrics<T>>;
	constant: Metrics<F>;
};

export enum MetricType {
	/////////////////////
	// Score per domain
	/////////////////////
	UserDailyGlobalScore = "user.daily.global.score",
	UserDailyEnergyScore = "user.daily.energy.score",
	User7DaysEnergyScore = "user.7days.energy.score",
	User7DaysSleepScore = "user.7days.sleep.score",
	UserDailySleepScore = "user.daily.sleep.score",
	User2DaysSleepScore = "user.2days.sleep.score",

	///////////////////
	// 7 Days RHR
	///////////////////
	User7DaysAverageRHR = "user.7days.rhr",
	User7DaysReferenceRHR = "user.reference.rhr",

	///////////////////
	// 7 Days sleep
	///////////////////
	User7DaysAwakeStageDuration = "user.7days.awake.stage.duration",
	User7DaysPercawakeStage = "user.7days.percawake.stage",
	User7DaysLightStageDuration = "user.7days.light.stage.duration",
	User7DaysPerclightStage = "user.7days.perclight.stage",
	User7DaysDeepStageDuration = "user.7days.deep.stage.duration",
	User7DaysPercdeepStage = "user.7days.percdeep.stage",
	User7DaysRemStageDuration = "user.7days.rem.stage.duration",
	User7DaysPercremStage = "user.7days.percrem.stage",

	///////////////////
	// All Months sleep
	///////////////////
	UserMonthlyAwakeStageDuration = "user.monthly.awake.stage.duration",
	UserMonthlyLightStageDuration = "user.monthly.light.stage.duration",
	UserMonthlyDeepStageDuration = "user.monthly.deep.stage.duration",
	UserMonthlyRemStageDuration = "user.monthly.rem.stage.duration",

	///////////////////
	// Lifetime sleep
	///////////////////
	UserLifetimeAwakeTimeDuration = "user.lifetime.awake.stage.duration",
	UserLifetimeAwakeTimePercent = "user.lifetime.percawake.stage",
	UserLifetimeLightStageDuration = "user.lifetime.light.stage.duration",
	UserLifetimeLightStagePercent = "user.lifetime.perclight.stage",
	UserLifetimeDeepStageDuration = "user.lifetime.deep.stage.duration",
	UserLifetimeDeepStagePercent = "user.lifetime.percdeep.stage",
	UserLifetimeREMStageDuration = "user.lifetime.rem.stage.duration",
	UserLifetimeREMStagePercent = "user.lifetime.percrem.stage",

	///////////////////
	// Daily metabolism
	///////////////////
	UserDailyBodyRecovery = "user.daily.body.recovery",
	UserDailyBodyRecoveryGoalMin = "user.daily.body.recovery.goal.min",
	UserDailyBodyRecoveryGoalMax = "user.daily.body.recovery.goal.max",

	UserDailyWakeUpScore = "user.daily.wake.up.score",
	UserDailyWakeUpScoreGoalMin = "user.daily.wake.up.score.goal.min",
	UserDailyWakeUpScoreGoalMax = "user.daily.wake.up.score.goal.max",

	UserDailyAsleepBR = "user.daily.asleep.br",
	UserDailyAsleepBRReference = "user.reference.asleep.br",
	UserDailyScoreBR = "user.daily.score.br",
	UserDailyScoreBRGoalMin = "user.daily.score.br.goal.min",
	UserDailyScoreBRGoalMax = "user.daily.score.br.goal.max",

	UserDailySPO2 = "user.spo2",
	UserDailyAsleepSPO2 = "user.daily.asleep.spo2",
	UserDailyAsleepSPO2Reference = "user.reference.asleep.spo2",
	UserDailyScoreSPO2 = "user.daily.score.spo2",
	UserDailyScoreSPO2GoalMin = "user.daily.score.spo2.goal.min",
	UserDailyScoreSPO2GoalMax = "user.daily.score.spo2.goal.max",

	UserDailyAsleepHRV = "user.daily.asleep.hrv",
	UserDailyReferenceHRV = "user.reference.sleep.hrv",
	UserDailyScoreHRV = "user.daily.score.hrv",
	UserDailyScoreHRVGoalMin = "user.daily.score.hrv.goal.min",
	UserDailyScoreHRVGoalMax = "user.daily.score.hrv.goal.max",
	UserHRV = "user.hrv",
	UserHRVTrend = "user.asleep.hrv.trend",
	UserHRTrend = "user.asleep.hr.trend",

	User7DaysTotalSleepDuration = "user.7days.total.sleep.duration",
	User7DaysRealSleepDuration = "user.7days.real.sleep.duration",
	UserIdealSleepDuration = "user.ideal.sleep.duration",

	UserDailyRHR = "user.daily.rhr",
	UserDailyScoreRHR = "user.daily.score.rhr",
	UserDailyScoreRHRGoalMin = "user.daily.score.rhr.goal.min",
	UserDailyScoreRHRGoalMax = "user.daily.score.rhr.goal.max",

	UserDailySleepVarTemperature = "user.daily.sleep.var.temperature",
	UserDailySleepScoreVarTemperature = "user.daily.sleep.score.var.temperature",
	UserDailySleepScoreVarTemperatureGoalMin = "user.daily.sleep.score.var.temperature.goal.min",
	UserDailySleepScoreVarTemperatureGoalMax = "user.daily.sleep.score.var.temperature.goal.max",

	UserDailySleepScoreGoalMin = "user.daily.sleep.score.goal.min",
	UserDailySleepScoreGoalMax = "user.daily.sleep.score.goal.max",

	UserDailySleepBalance = "user.daily.sleep.balance",
	UserDailySleepBalanceGoalMin = "user.daily.sleep.balance.goal.min",
	UserDailySleepBalanceGoalMax = "user.daily.sleep.balance.goal.max",

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
	UserDailyPercDeepStageScore = "user.daily.percdeep.stage.score",
	UserDailyPercDeepStageScoreGoalMin = "user.daily.percdeep.stage.score.goal.min",
	UserDailyPercDeepStageScoreGoalMax = "user.daily.percdeep.stage.score.goal.max",

	UserDailyCoreTimeToFallAsleep = "user.daily.core.time.to.fall.asleep",
	UserDailyCorePercTimeToFallAsleep = "user.daily.core.perctime.to.fall.asleep",
	UserDailyCorePercTimeToFallAsleepGoalMin = "user.daily.core.perctime.to.fall.asleep.goal.min",
	UserDailyCorePercTimeToFallAsleepGoalMax = "user.daily.core.perctime.to.fall.asleep.goal.max",

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
	UserDailyActiveMinute = "user.daily.active.minute",
	UserDailySportBegin = "user.daily.sport.begin",
	UserDailySportEnd = "user.daily.sport.end",

	UserDailyHighActivityIntensityDuration = "user.daily.high.activity.intensity.duration",
	UserDailyMediumActivityIntensityDuration = "user.daily.medium.activity.intensity.duration",
	UserDailyLowActivityIntensityDuration = "user.daily.low.activity.intensity.duration",

	/////////////////
	// 7D activity duration
	/////////////////
	User7DaysAverageHighIntensityDuration = "user.7days.average.high.intensity.duration",
	User7DaysAverageMediumIntensityDuration = "user.7days.average.medium.intensity.duration",
	User7DaysAverageLowIntensityDuration = "user.7days.average.low.intensity.duration",

	/////////////////
	// Monthly activity duration
	/////////////////
	UserMonthlyAverageHighIntensityDuration = "user.monthly.average.high.intensity.duration",
	UserMonthlyAverageMediumIntensityDuration = "user.monthly.average.medium.intensity.duration",
	UserMonthlyAverageLowIntensityDuration = "user.monthly.average.low.intensity.duration",

	///////////////////
	// Daily activities
	///////////////////
	UserDailySteps = "user.daily.steps",
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",
	UserStepsAverage = "user.7days.everage.steps",
	UserStepsBaseline = "user.baseline.steps",
	UserStepsTotal = "user.7days.total.steps",

	UserDailyWalkingEquivalency = "user.daily.walking.equivalency",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",

	UserDailyCaloriesBurned = "user.daily.calories.burned",
	UserDailyCaloriesBurnedGoal = "user.daily.calories.burned.goal",
	UserCalorieBurnedAverage = "user.7days.average.calories.burned",
	UserCalorieBurnedBaseline = "user.baseline.calories.burned",
	UserCalorieBurnedTotal = "user.7days.total.calories.burned",

	UserDailyCardioPoints = "user.daily.cardio.points",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",

	UserCardioPointAverage = "user.7days.average.cardio.points",
	UserCardioPointBaseline = "user.baseline.cardio.points",
	UserCardioPointTotal = "user.7days.total.cardio.points",

	UserDailyVO2Max = "user.daily.vo2max",

	///////////////////
	// HR
	///////////////////
	UserHR = "user.hr",
	UserDailyHRMax = "user.daily.hr.max",
	UserDailyAwakeHRMax = "user.daily.awake.hr.max",
	UserDailyAwakeHRMin = "user.daily.awake.hr.min",
	UserDailyAwakeHRAverage = "user.daily.awake.hr",
	UserDailyAwakeHRReference = "user.reference.awake.hr",

	///////////////////
	// BR
	///////////////////
	UserBR = "user.br",

	///////////////////
	// HR night
	///////////////////
	UserDailySleepHR = "user.reference.asleep.hr",
	UserDailySleepHRMax = "user.daily.asleep.hr.max",
	UserDailySleepHRMin = "user.daily.asleep.hr.min",
	// temperature variation
	///////////////////
	UserDailyTemperature = "user.daily.asleep.temperature",
	UserDailyTemperatureScore = "user.daily.sleep.var.temperature",
	UserDailyVarTemperature = "user.7days.sleep.var.temperature",
}
