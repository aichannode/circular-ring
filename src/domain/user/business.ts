import { DateFormat, HeightUnit, HourFormat, NotificationsFormat, TemperatureFormat, WeightUnit } from "@domain/units";
import {
	DateFormatDto,
	HeightUnitDto,
	HourFormatDto,
	TemperatureFormatDto,
	WeightUnitDto,
	UserSettingsDto,
} from "./type";
import { UserSettings } from "./userSettings";

export const dtoFromUserSettings = (userSettings: UserSettings): UserSettingsDto => {
	return {
		temperatureFormat:
			userSettings.temperatureFormat === TemperatureFormat.CELSIUS
				? TemperatureFormatDto.CELSIUS
				: TemperatureFormatDto.FAHRENHEIT,
		dateFormat: userSettings.dateFormat === DateFormat.SI ? DateFormatDto.SI : DateFormatDto.USCS,
		hourFormat: userSettings.hourFormat === HourFormat.TWELVE ? HourFormatDto.TWELVE : HourFormatDto.TWENTY_FOUR,
		weightFormat: userSettings.weightFormat === WeightUnit.kg ? WeightUnitDto.kg : WeightUnitDto.lbs,
		heightFormat: userSettings.heightFormat === HeightUnit.cm ? HeightUnitDto.cm : HeightUnitDto.ft,
		notifications: userSettings.notifications ?? [NotificationsFormat.BANNER],
	};
};

export const userSettingsFromDto = (userSettingsDto: UserSettingsDto): UserSettings => {
	return {
		temperatureFormat:
			userSettingsDto.temperatureFormat === TemperatureFormatDto.CELSIUS
				? TemperatureFormat.CELSIUS
				: TemperatureFormat.FAHRENHEIT,
		dateFormat: userSettingsDto.dateFormat === DateFormatDto.SI ? DateFormat.SI : DateFormat.USCS,
		hourFormat: userSettingsDto.hourFormat === HourFormatDto.TWELVE ? HourFormat.TWELVE : HourFormat.TWENTY_FOUR,
		weightFormat: userSettingsDto.weightFormat === WeightUnitDto.kg ? WeightUnit.kg : WeightUnit.lbs,
		heightFormat: userSettingsDto.heightFormat === HeightUnitDto.cm ? HeightUnit.cm : HeightUnit.ft,
		notifications: userSettingsDto.notifications ?? [NotificationsFormat.BANNER],
	};
};
