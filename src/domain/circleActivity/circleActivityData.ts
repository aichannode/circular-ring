export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative";

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
