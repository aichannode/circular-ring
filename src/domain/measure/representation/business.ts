import { isToday } from "@domain/common/business";
import { ScoreQuality } from "./api";

/**
 * Return either we can display the data of this day or not
 * @implements spec [00000](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWIm9aec)
 */
export function canDisplay(isoDay: string, userCoreSleepEnd: number) {
	return isToday(new Date(userCoreSleepEnd).toISOString(), isoDay);
}

/**
 * Compute the control states for the sleep score
 * @implements spec [00001](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWInQrBs)
 */
export function getScoreControlStates(model: {
	lowThreshold: number;
	highThreshold: number;
	score: number;
	isInverted?: boolean;
}) {
	if (model.score >= model.lowThreshold && model.score < model.highThreshold) {
		return ScoreQuality.GOOD;
	} else if (model.score < model.lowThreshold) {
		return model.isInverted ? ScoreQuality.OPTIMAL : ScoreQuality.POOR;
	} else {
		return model.isInverted ? ScoreQuality.POOR : ScoreQuality.OPTIMAL;
	}
}
