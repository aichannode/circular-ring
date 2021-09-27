import { ApiService } from "@core/api/apiService";
import { HeightUnit, WeightUnit } from "@domain/units";
import { Sex, User } from "@domain/user/user";
import { UserSettings } from "@domain/user/userSettings";

interface UserDtoBase {
	firstName: string;
	lastName: string;
	country: string;
	phoneNumber: string | null;
	profilePictureUrl: string | null;
	weight: number;
	height: number;
	sex: string;
	bornDate: string;
	language: string;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
}

interface UserDto extends UserDtoBase {
	id: string;
	email: string;
	validated: boolean;
	createdAt: string;
}

export type UserPutDto = UserDtoBase;

interface UserSettingsDto {
	id: string;
	dateFormat: string;
	heightFormat: string;
	weightFormat: string;
}

export class UserApi {
	constructor(private readonly apiService: ApiService) {}

	async getUser(): Promise<User> {
		const result = await this.apiService.get<UserDto>("/user");
		return UserApi.userFromDto(result.data);
	}

	async updateUser(userPutDto: UserPutDto): Promise<User> {
		const result = await this.apiService.put<UserDto>("/user", userPutDto);
		return UserApi.userFromDto(result.data);
	}

	private static userFromDto(userDto: UserDto): User {
		return {
			...userDto,
			bornDate: new Date(userDto.bornDate),
			createdAt: new Date(userDto.createdAt),
			sex: userDto.sex === "male" ? Sex.Male : Sex.Female,
		};
	}

	async getUserSettings(): Promise<UserSettings> {
		const result = await this.apiService.get<UserSettings>("/user/setting");
		return UserApi.userSettingsFromDto(result.data);
	}

	async updateUserSettings(userSettings: {
		dateFormat: string;
		heightFormat: string;
		weightFormat: string;
		timezone: string;
	}): Promise<UserSettings> {
		const result = await this.apiService.put<UserSettingsDto>("/user/setting", userSettings);
		return UserApi.userSettingsFromDto(result.data);
	}

	private static userSettingsFromDto(userSettingsDto: UserSettingsDto): UserSettings {
		return {
			...userSettingsDto,
			weightFormat: userSettingsDto.weightFormat === "kg" ? WeightUnit.kg : WeightUnit.lbs,
			heightFormat: userSettingsDto.heightFormat === "cm" ? HeightUnit.cm : HeightUnit.ft,
		};
	}
}
