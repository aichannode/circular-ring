import { WordingKey } from "src/wordings";

export enum MetricColor {
	RED,
	ORANGE,
	GREEN,
}

export type MetricDisplayConfig = {
	icon: string;
	labelKey: WordingKey;
};

export type GaugeDisplayConfig = {
	titleKey: WordingKey;
	descriptionKey: WordingKey;
	displaySegment?: [number, number];
	renderValue: (metrics: { value: number; thresholdLow: number; thresholdHigh: number; percent: number }) => string;
};
