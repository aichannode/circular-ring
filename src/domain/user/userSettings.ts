import { HeightUnit, WeightUnit } from "@domain/units";

export interface UserSettings {
	id: string;
	dateFormat: string;
	heightFormat: HeightUnit;
	weightFormat: WeightUnit;
}
