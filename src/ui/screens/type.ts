import { MetricType } from "@domain/measure/metric";
import { WordingKey } from "src/wordings";

export enum MetricColor {
	RED,
	ORANGE,
	GREEN,
}

export type MetricDisplayConfig = {
	metricsName: {
		value: MetricType;
		thresholdLow?: MetricType;
		thresholdHigh?: MetricType;
	};
	icon: string;
	labelKey: WordingKey;
	getColor?: ({
		value,
		thresholdLow,
		thresholdHigh,
	}: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
	}) => MetricColor;
};

export type GaugeDisplayConfig = {
	metricsName: {
		value: MetricType;
		thresholdLow: MetricType;
		thresholdHigh: MetricType;
		gaugeFilling: MetricType;
	};
	isInverted?: boolean;
	titleKey: WordingKey;
	descriptionKey: WordingKey;
	displaySegment?: [number, number];
	renderValue: (metrics: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		gaugeFilling: number;
	}) => string;
	getGaugeColor: ({
		value,
		thresholdLow,
		thresholdHigh,
	}: {
		value: number;
		thresholdLow: number;
		thresholdHigh: number;
		gaugeFilling: number;
	}) => MetricColor;
};
