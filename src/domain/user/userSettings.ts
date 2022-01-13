import { DateFormat, HeightUnit, HourFormat, WeightUnit } from "@domain/units";

export interface UserSettings {
	id: string;
	dateFormat: DateFormat;
	heightFormat: HeightUnit;
	weightFormat: WeightUnit;
	hourFormat: HourFormat;
}
