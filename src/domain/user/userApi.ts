import { ApiService } from "@core/api/apiService";
import { User, UserImpl } from "@domain/user/user";
import { UserDto } from "@domain/user/userDto";

export class UserApi {
	constructor(private readonly apiService: ApiService) {}

	async getUser(): Promise<User> {
		const result = await this.apiService.get<UserDto>("/user");
		const userDto = result.data;
		return new UserImpl(userDto);
	}
}
