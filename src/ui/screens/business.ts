import { CircleEntity } from "@domain/circles/type";
import { WordingKey } from "src/wordings";

export const getScoreQualityLabel =
	(format: (v: WordingKey) => string) =>
	({
		value,
		thresholdLow,
		thresholdHigh,
	}: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		percent: number;
	}): string => {
		if (value >= thresholdHigh) {
			return format("score.quality.optimal");
		}
		if (value < thresholdHigh && value >= thresholdLow) {
			return format("score.quality.good");
		}
		return format("score.quality.poor");
	};

export const parseEmail = (email: string) => {
	return email.trim();
};

export const mergeDefaultAndUserCirle = (userCircles: CircleEntity[], defaultCircles: CircleEntity[]) => {
	const mergedCircle = [];
	for (const circle of defaultCircles) {
		const c = userCircles.find((c) => c.id === circle.id);
		if (c) mergedCircle.push(c);
		else mergedCircle.push({ ...circle, enabled: false });
	}
	console.log("mergedCircle", mergedCircle);
	return mergedCircle;
};
