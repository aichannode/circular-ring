import { isToday } from "@domain/feed/business";
import { MetricType } from "../metric";

/**
 * Return either we can display the data of this day or not
 * @implements spec [00000](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWIm9aec)
 */
export function canDisplay(isoDay: string, userCoreSleepEnd: number) {
	return isToday(new Date(userCoreSleepEnd).toISOString(), isoDay);
}

export enum SleepScoreControlStates {
	Optimal,
	Good,
	Poor,
}

/**
 * Compute the control states for the sleep score
 * @implements spec [00001](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWInQrBs)
 */
export function getScoreControlStates(
	model: Record<
		MetricType.UserDailySleepScore | MetricType.UserDailySleepScoreGoalMin | MetricType.UserDailySleepScoreGoalMax,
		number
	>
) {
	if (
		model["user.daily.sleep.score"] >= model["user.daily.score.sleep.goal.min"] &&
		model["user.daily.sleep.score"] < model["user.daily.score.sleep.goal.max"]
	) {
		return SleepScoreControlStates.Good;
	} else if (model["user.daily.sleep.score"] < model["user.daily.score.sleep.goal.min"]) {
		return SleepScoreControlStates.Poor;
	} else {
		return SleepScoreControlStates.Optimal;
	}
}
