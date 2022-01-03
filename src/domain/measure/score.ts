export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative" | "time" | "tranquility";

export enum ScoreQuality {
	POOR = "POOR",
	GOOD = "GOOD",
	OPTIMAL = "OPTIMAL",
}

export enum SignalQuality {
	POOR = "POOR",
	GOOD = "GOOD",
}

export function getScoreQuality(score: number) {
	return score < 50 ? ScoreQuality.POOR : ScoreQuality.OPTIMAL;
}

export function getSignalQuality(score: number) {
	return score === 0 ? ScoreQuality.POOR : ScoreQuality.GOOD;
}
