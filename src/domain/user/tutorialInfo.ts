import { Sex } from "@domain/user/user";

export interface TutorialInfo {
	firstName: string;
	lastName: string;
	country: string;
	sex: Sex;
	birthDate: Date;
	weight: number;
	height: number;
}
