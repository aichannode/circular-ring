import { Lines } from "@domain/measure/representation/api";

export interface DataSet {
	lines: Lines;
	color: string;
}
export type MultipleDataSets = DataSet[];
