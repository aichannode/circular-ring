import { ApiService } from "@core/api/apiService";
import { getLogger } from "@core/logger/logger";
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

type UserPutDto = UserDtoBase;

export class UserApi {
	private readonly logger = getLogger("UserApi");

	constructor(private readonly apiService: ApiService) {}

	async getUser(): Promise<User> {
		const result = await this.apiService.get<UserDto>("/user");
		const userDto = result.data;
		return UserApi.userFromDto(userDto);
	}

	async updateUser(userPutDto: UserPutDto): Promise<User> {
		const result = await this.apiService.put<UserDto>("/user", userPutDto);
		const userDto = result.data;
		this.logger.debug("GET USER : " + JSON.stringify(userDto));
		return UserApi.userFromDto(userDto);
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
		this.logger.debug("GET USER SETTINGS : " + JSON.stringify(result.data));
		return result.data;
	}

	async updateUserSettings(userSettings: {
		dateFormat: string;
		heightFormat: string;
		weightFormat: string;
		timezone: string;
	}): Promise<UserSettings> {
		const result = await this.apiService.put<UserSettings>("/user/setting", userSettings);
		return result.data;
	}
}
