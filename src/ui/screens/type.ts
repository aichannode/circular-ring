import { MetricType } from "@domain/measure/metric";
import { WordingKey } from "src/wordings";

export enum GaugeColor {
	RED,
	ORANGE,
	GREEN
}

export type GaugeDisplayConfig = {
    metricsName: {
        value: MetricType,
        thresholdLow: MetricType
        thresholdHigh: MetricType
        gaugeFilling: MetricType,
    },
    isInverted?: boolean,
    titleKey: WordingKey,
    descriptionKey: WordingKey,
	displaySegment?: [number, number],
    renderValue: (metrics: {
        value: number,
        thresholdLow: number,
        thresholdHigh: number,
        gaugeFilling: number,
    }) => string
	getGaugeColor: ({
        value,
        thresholdLow,
        thresholdHigh,
    }: {
        value: number,
        thresholdLow: number,
        thresholdHigh: number,
        gaugeFilling: number,
    }) => GaugeColor,
}