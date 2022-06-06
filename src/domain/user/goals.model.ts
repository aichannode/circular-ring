export enum Goals {
	UserDailyStepsGoalMax = "user.daily.steps.goal.max",
	UserDailyStepsGoalMin = "user.daily.steps.goal.min",
	UserDailyWalkingEquivalencyGoalMax = "user.daily.walking.equivalency.goal.max",
	UserDailyWalkingEquivalencyGoalMin = "user.daily.walking.equivalency.goal.min",
	UserDailyCardioPointsGoalMax = "user.daily.cardio.points.goal.max",
	UserDailyCardioPointsGoalMin = "user.daily.cardio.points.goal.min",
}

export type DailyGoals = {
	goals: Record<Goals, number>;
};
