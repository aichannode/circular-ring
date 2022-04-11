import { NotificationsFormat, TemperatureFormat } from "../units";
import { DateFormat, HeightUnit, HourFormat, WeightUnit } from "@domain/units";

export interface UserSettings {
	dateFormat: DateFormat;
	heightFormat: HeightUnit;
	weightFormat: WeightUnit;
	hourFormat: HourFormat;
	temperatureFormat: TemperatureFormat;
	notifications: NotificationsFormat[];
}
