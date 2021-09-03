import { UserDto } from "@domain/user/userDto";

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

export class UserImpl implements User {
	readonly id: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly email: string;
	readonly validated: boolean;
	readonly country: string;
	readonly phoneNumber: string;
	readonly profilePictureUrl: string;
	readonly weight: number;
	readonly height: number;
	readonly sex: string;
	readonly bornDate: Date;
	readonly language: string;
	readonly scorePublic: boolean;
	readonly stride: number;
	readonly tutorialCompleted: boolean;
	readonly createdAt: Date;

	constructor(userDto: UserDto) {
		this.id = userDto.id;
		this.firstName = userDto.firstName;
		this.lastName = userDto.lastName;
		this.email = userDto.email;
		this.validated = userDto.validated;
		this.country = userDto.country;
		this.phoneNumber = userDto.phoneNumber;
		this.profilePictureUrl = userDto.profilePictureUrl;
		this.weight = userDto.weight;
		this.height = userDto.height;
		this.sex = userDto.sex;
		this.bornDate = new Date(userDto.bornDate);
		this.language = userDto.language;
		this.scorePublic = userDto.scorePublic;
		this.stride = userDto.stride;
		this.tutorialCompleted = userDto.tutorialCompleted;
		this.createdAt = new Date(userDto.createdAt);
	}
}
