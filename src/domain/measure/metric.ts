export interface MetricInfo<T extends Metric = Metric> {
	date: string;
	metrics: {
		[key in T]?: number;
	};
}

export type Metric =
	| "user.daily.energy.score"
	| "user.start.of.sport"
	| "user.end.of.sport"
	| "user.non.active.activity"
	| "user.low.intensity.activity"
	| "user.medium.intensity.activity"
	| "user.high.intensity.activity"
	| "user.daily.total.activity"
	| "user.daily.steps"
	| "user.daily.steps.goal.min"
	| "user.daily.steps.goal.max"
	| "user.daily.walking.equivalency"
	| "user.daily.walking.equivalency.goal.min"
	| "user.daily.walking.equivalency.goal.max"
	| "user.daily.calories.burned"
	| "user.daily.calories.burned.goal.min"
	| "user.daily.calories.burned.goal.max"
	| "user.daily.cardio.points"
	| "user.daily.cardio.points.goal.min"
	| "user.daily.cardio.points.goal.max"
	| "user.daily.vo2max"
	| "user.daily.awake.hr.max"
	| "user.daily.score.recovery"
	| "user.daily.wake.up.score"
	| "user.daily.sleep.hrv"
	| "user.daily.score.hrv"
	| "user.daily.rhr"
	| "user.daily.score.rhr"
	| "user.daily.sleep.br"
	| "user.score.daily.br"
	| "user.daily.sleep.var.temperature"
	| "user.score.daily.var.temperature"
	| "user.2days.sleep.score"
	| "user.daily.score.sleep.balance"
	| "user.daily.score.activity.volume"
	| "user.max.hr"
	| "user.schedule.low.intensity.activity"
	| "user.schedule.medium.intensity.activity"
	| "user.schedule.high.intensity.activity"
	| "user.daily.low.intensity.activity"
	| "user.daily.medium.intensity.activity"
	| "user.daily.high.intensity.activity"
	| "user.7days.average.low.intensity.activity"
	| "user.7days.average.medium.intensity.activity"
	| "user.7days.average.high.intensity.activity"
	| "user.monthly.average.low.intensity.activity"
	| "user.monthly.average.medium.intensity.activity"
	| "user.monthly.average.high.intensity.activity"
	| "user.lifetime.average.low.intensity.activity"
	| "user.lifetime.average.medium.intensity.activity"
	| "user.lifetime.average.high.intensity.activity"
	| "user.7days.average.steps"
	| "user.baseline.steps"
	| "user.7days.total.steps"
	| "user.30days.average.steps"
	| "user.baseline.steps"
	| "user.30days.total.steps"
	| "user.monthly.average.steps"
	| "user.lifetime.average.steps"
	| "user.7days.average.calories.burned"
	| "user.baseline.calories.burned"
	| "user.7days.total.calories.burned"
	| "user.30days.average.calories.burned"
	| "user.30days.total.calories.burned"
	| "user.monthly.average.calories.burned"
	| "user.lifetime.average.calories.burned"
	| "user.daily.cardio.points"
	| "user.7days.average.cardio.points"
	| "user.baseline.cardio.points"
	| "user.7days.total.cardio.points"
	| "user.30days.average.cardio.points"
	| "user.monthly.average.cardio.points"
	| "user.lifetime.average.cardio.points"
	| "user.awake.hr"
	| "user.daily.awake.hr"
	| "user.reference.awake.hr"
	| "user.daily.awake.hr.max"
	| "user.daily.awake.hr.min"
	| "user.daily.awake.hr"
	| "user.7days.awake.hr"
	| "user.reference.awake.hr"
	| "user.30days.awake.hr.max"
	| "user.30days.awake.hr.min"
	| "user.monthly.awake.hr"
	| "user.lifetime.awake.hr"
	| "user.reference.awake.hr"
	| "user.lifetime.awake.hr.max"
	| "user.lifetime.awake.hr.min"
	| "user.awake.hrv"
	| "user.daily.awake.hrv"
	| "user.reference.awake.hrv"
	| "user.7days.awake.hrv"
	| "user.reference.awake.hrv"
	| "user.monthly.awake.hrv"
	| "user.lifetime.awake.hrv"
	| "user.reference.awake.hrv"
	| "user.7days.energy.score"
	| "user.30days.energy.score"
	| "user.monthly.energy.score"
	| "user.lifetime.energy.score"
	| "user.7days.rhr"
	| "user.reference.rhr"
	| "user.30days.rhr"
	| "user.monthly.rhr"
	| "user.lifetime.rhr"
	| "user.awake.br"
	| "user.daily.awake.br"
	| "user.7days.awake.br"
	| "user.reference.awake.br"
	| "user.monthly.awake.br"
	| "user.lifetime.awake.br"
	| "user.awake.var.temperature"
	| "user.nowear.ring.period"
	| "user.daily.awake.var.temperature"
	| "user.daily.awake.var.temperature"
	| "user.30days.awake.var.temperature"
	| "user.monthly.awake.var.temperature"
	| "user.lifetime.awake.var.temperature"
	| "user.awake.spo2"
	| "user.daily.awake.spo2"
	| "user.reference.awake.spo2"
	| "user.daily.awake.spo2"
	| "user.7days.awake.spo2"
	| "user.monthly.awake.spo2"
	| "user.lifetime.awake.spo2"
	| "user.daily.awake.stage.duration"
	| "user.daily.%awake.stage.duration"
	| "user.daily.%real.sleep"
	| "user.daily.real.sleep.duration"
	| "user.daily.%rem.stage.score"
	| "user.daily.%deep.stage.score"
	| "user.daily.%time.to.fall.asleep"
	| "user.daily.%sleep.debt"
	| "user.daily.tranquility"
	| "user.daily.circadian.rhythm"
	| "user.daily.%rem.stage"
	| "user.daily.%deep.stage"
	| "user.daily.time.to.fall.asleep"
	| "user.daily.sleep.debt";

export const alldailyActivityMetrics = [
	"user.daily.steps",
	"user.daily.walking.equivalency",
	"user.daily.calories.burned",
	"user.daily.cardio.points",
	"user.daily.vo2max",
	"user.daily.awake.hr.max",
] as const;
export type DailyActivityMetric = typeof alldailyActivityMetrics[number];

export const allDailyActivityGoalMetrics = [
	"user.daily.steps.goal.min",
	"user.daily.steps.goal.max",
	"user.daily.walking.equivalency.goal.min",
	"user.daily.walking.equivalency.goal.max",
	"user.daily.calories.burned.goal.min",
	"user.daily.calories.burned.goal.max",
	"user.daily.cardio.points.goal.min",
	"user.daily.cardio.points.goal.max",
] as const;
export type DailyActivityGoalMetric = typeof allDailyActivityGoalMetrics[number];

export const allEnergyScoreMetrics = [
	"user.daily.score.recovery",
	"user.daily.wake.up.score",
	"user.daily.sleep.br",
	"user.daily.sleep.hrv",
	"user.daily.rhr",
	"user.daily.sleep.var.temperature",
	"user.2days.sleep.score",
	"user.daily.score.sleep.balance",
	"user.daily.score.activity.volume",
] as const;
export type EnergyScoreMetric = typeof allEnergyScoreMetrics[number];

export const allEnergyScoreGaugeMetrics = [
	"user.daily.score.hrv",
	"user.daily.score.rhr",
	"user.score.daily.br",
	"user.score.daily.var.temperature",
] as const;
export type EnergyScoreGaugeMetric = typeof allEnergyScoreGaugeMetrics[number];

export const allSleepQualityMetrics = [
	"user.daily.awake.stage.duration",
	"user.daily.real.sleep.duration",
	"user.daily.tranquility",
	"user.daily.circadian.rhythm",
	"user.daily.%rem.stage",
	"user.daily.%deep.stage",
	"user.daily.time.to.fall.asleep",
	"user.daily.sleep.debt",
] as const;
export type SleepQualityMetric = typeof allSleepQualityMetrics[number];

export const allSleepQualityGaugeMetrics = [
	"user.daily.%awake.stage.duration",
	"user.daily.%real.sleep",

	"user.daily.%rem.stage.score",
	"user.daily.%deep.stage.score",
	"user.daily.%time.to.fall.asleep",
	"user.daily.%sleep.debt",
] as const;
export type SleepQualityGaugeMetric = typeof allSleepQualityGaugeMetrics[number];
