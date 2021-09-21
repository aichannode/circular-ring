import { ApiService } from "@core/api/apiService";
import { Sex, User } from "@domain/user/user";

interface UserDto {
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
	bornDate: string;
	language: string;
	scorePublic: boolean;
	stride: number;
	tutorialCompleted: boolean;
	createdAt: string;
}

export class UserApi {
	constructor(private readonly apiService: ApiService) {}

	async getUser(): Promise<User> {
		const result = await this.apiService.get<UserDto>("/user");
		const userDto = result.data;
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
}
