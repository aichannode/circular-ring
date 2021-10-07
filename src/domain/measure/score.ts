export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative" | "time" | "tranquility";

export enum ScoreQuality {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export function getScoreQuality(score: number, goodThreshold: number, optimalThreshold: number) {
	return score > optimalThreshold
		? ScoreQuality.OPTIMAL
		: score > goodThreshold
		? ScoreQuality.GOOD
		: ScoreQuality.POOR;
}

export const goodGlobalScoreThreshold = 80;
export const optimalGlobalScoreThreshold = 90;
