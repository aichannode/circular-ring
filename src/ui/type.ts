import { Lines } from "@domain/measure/representation/api";

export interface DataSet {
	lines: Lines;
	color: string;
}
export type MultipleDataSets = DataSet[];
export type SelectEventPayload = { data: { x: number; y: number } };

export interface Average {
	/** value */
	value: number;
	/** color */
	color: string;
}
export type Averages = Average[];
