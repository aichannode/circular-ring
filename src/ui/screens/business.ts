import { WordingKey } from "src/wordings";
import { MetricColor } from "./type";
import { CircleEntity } from "@domain/circles/type";

export function getMetricColor({
	value: _value,
	thresholdLow,
	thresholdHigh,
}: {
	value: number;
	thresholdLow: number;
	thresholdHigh: number;
}): MetricColor {
	const value = Math.abs(_value);
	if (value >= thresholdHigh) {
		return MetricColor.GREEN;
	}
	if (value >= thresholdLow && value < thresholdHigh) {
		return MetricColor.ORANGE;
	} else return MetricColor.RED;
}

export const getGaugeColor =
	(getGaugeFilling?: boolean) =>
	({
		value: _value,
		thresholdLow,
		thresholdHigh,
		gaugeFilling,
	}: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		gaugeFilling: number;
	}): MetricColor => {
		const value = Math.abs(getGaugeFilling ? gaugeFilling : _value);
		if (value >= thresholdHigh) {
			return MetricColor.GREEN;
		}
		if (value >= thresholdLow && value < thresholdHigh) {
			return MetricColor.ORANGE;
		} else return MetricColor.RED;
	};

export const getInvertedGaugeColor =
	(getGaugeFilling?: boolean) =>
	({
		value: _value,
		thresholdLow,
		thresholdHigh,
		gaugeFilling,
	}: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		gaugeFilling: number;
	}): MetricColor => {
		const value = Math.abs(getGaugeFilling ? gaugeFilling : _value);
		if (value <= thresholdHigh) {
			return MetricColor.GREEN;
		}
		if (value <= thresholdLow && value > thresholdHigh) {
			return MetricColor.ORANGE;
		}
		return MetricColor.RED;
	};

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
		gaugeFilling: number;
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
