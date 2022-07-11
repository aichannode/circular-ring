import { LocaleType, WordingKey } from "../../wordings";

export enum Sex {
	Male = "male",
	Female = "female",
}

export enum Language {
	EN = "en",
	FR = "fr",
	ES = "es",
	DE = "de",
	IT = "it",
	NL = "nl",
}

export const languageKeys = new Map<Language, WordingKey>([
	[Language.EN, "profile_info.english"],
	[Language.FR, "profile_info.french"],
	[Language.ES, "profile_info.spanish"],
	[Language.DE, "profile_info.german"],
	[Language.IT, "profile_info.italian"],
	[Language.NL, "profile_info.dutch"],
]);

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	validated: boolean;
	country: string;
	phoneNumber: string | null;
	profilePictureUrl: string | null;
	weight: number;
	height: number;
	sex: Sex;
	bornDate: Date;
	language: LocaleType;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
	createdAt: Date;
	calibrationRemainingDays: number;
	leaderboardRank?: string;
}
