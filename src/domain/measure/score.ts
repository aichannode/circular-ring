export type ScoreUnit = "%" | "rpm" | "ms" | "bpm" | "°C" | "qualitative" | "time" | "tranquility";

export enum SignalQuality {
	POOR = "POOR",
	GOOD = "GOOD",
}

export function getSignalQuality(score: number) {
	return score === 0 ? SignalQuality.POOR : SignalQuality.GOOD;
}
