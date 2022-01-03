import { WordingKey } from "src/wordings"

enum GaugeColor {
	RED,
	ORANGE,
	GREEN
}

export const getGaugeColor = (getGaugeFilling?: boolean) => ({
	value: _value,
	thresholdLow,
	thresholdHigh,
	gaugeFilling
}: {
	value: number,
	thresholdLow: number,
	thresholdHigh: number,
	gaugeFilling: number,
}): GaugeColor => {
	const value = Math.abs(getGaugeFilling ? gaugeFilling : _value)
	if (value >= thresholdHigh) {
		return GaugeColor.GREEN
	}
	if ((value >=  thresholdLow) && (value < thresholdHigh)) {
		return GaugeColor.ORANGE
	}
	else return GaugeColor.RED
}

export const getInvertedGaugeColor = (getGaugeFilling?: boolean) => ({
	value: _value,
	thresholdLow,
	thresholdHigh,
	gaugeFilling,
}: {
	value: number,
	thresholdLow: number,
	thresholdHigh: number,
	gaugeFilling: number,
}): GaugeColor => {
	const value = Math.abs(getGaugeFilling ? gaugeFilling : _value)
	if (value <= thresholdHigh) {
		return GaugeColor.GREEN
	}
	if ((value <= thresholdLow) && (value > thresholdHigh)) {
		return GaugeColor.ORANGE
	}
	return GaugeColor.RED
}


export const getScoreQualityLabel = (format: (v: WordingKey) => string) => ({
	value,
	thresholdLow,
	thresholdHigh,
}: {
	value: number,
	thresholdLow: number,
	thresholdHigh: number,
	gaugeFilling: number,
}): string => {
	if (value >= thresholdHigh) {
		return format("score.quality.optimal")
	}
	if (value < thresholdHigh && value >= thresholdLow) {
		return format("score.quality.good")
	}
	return format("score.quality.poor")
}
