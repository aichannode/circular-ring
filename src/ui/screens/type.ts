import { Contributor } from "@domain/measure/representation/api";
import { Mode } from "@ui/type";
import { WordingKey } from "src/wordings";

export enum MetricColor {
	RED,
	ORANGE,
	GREEN,
}

export type MetricDisplayConfig = {
	icon: string;
	labelKey: WordingKey;
	decimalNb: number;
	renderValue?: (value?: string | number) => number | undefined;
};

export type GaugeDisplayConfig = {
	titleKey: WordingKey;
	descriptionKey: WordingKey;
	displaySegment?: [number, number];
	computeMode: (parentMode: Mode) => Mode;
	renderValue: (metrics: Contributor) => string | undefined;
	shouldForceDisplayValue?: boolean;
};
