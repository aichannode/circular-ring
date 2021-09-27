export enum Sex {
	Male = "male",
	Female = "female",
}

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
	language: string;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
	createdAt: Date;
}
