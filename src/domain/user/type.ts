import { NotificationsFormat } from "@domain/units";
import { LocaleType } from "src/wordings";

export enum WeightUnitDto {
	kg = "KG",
	lbs = "LB",
}

export enum HeightUnitDto {
	cm = "CM",
	ft = "FT",
}

export enum DateFormatDto {
	USCS = "USCS",
	SI = "SI",
}

export enum TemperatureFormatDto {
	CELSIUS = "CELSIUS",
	FAHRENHEIT = "FAHRENHEIT",
}

export enum NotificationsFormatDto {
	BANNER = "BANNER",
	UPDATE = " UPDATE",
	PERIODS = " PERIODS",
	PMS = "PMS",
	FERTILITY_WINDOW = "FERTILITY_WINDOW",
	HIGH_HR = "HIGH_HR",
	LOW_HR = "LOW_HR",
	LOW_SPO2 = "LOW_SPO2",
}

export enum HourFormatDto {
	TWELVE = "12",
	TWENTY_FOUR = "24",
}

export interface UserDtoBase {
	firstName: string;
	lastName: string;
	country: string;
	phoneNumber: string | null;
	profilePictureUrl: string | null;
	weight: number;
	height: number;
	sex: string;
	bornDate: string;
	language: LocaleType;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
}

export interface UserDto extends UserDtoBase {
	id: string;
	email: string;
	validated: boolean;
	createdAt: string;
	calibrationRemainingDays: number;
}

export type UserPutDto = UserDtoBase;

export interface UserSettingsDto {
	dateFormat: DateFormatDto;
	heightFormat: HeightUnitDto;
	weightFormat: WeightUnitDto;
	hourFormat: HourFormatDto;
	temperatureFormat: TemperatureFormatDto;
	notifications?: NotificationsFormat[];
}
