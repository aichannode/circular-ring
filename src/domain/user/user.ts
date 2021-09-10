export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	validated: boolean;
	country: string;
	phoneNumber: string;
	profilePictureUrl: string;
	weight: number;
	height: number;
	sex: string;
	bornDate: Date;
	language: string;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
	createdAt: Date;
}
