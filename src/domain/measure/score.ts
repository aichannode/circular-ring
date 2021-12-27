export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative" | "time" | "tranquility";

export enum ScoreQuality {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export function getScoreQuality(score: number) {
	return score == 0 ? ScoreQuality.POOR : ScoreQuality.OPTIMAL;
}