import { ApiService } from "@core/api/apiService";
import { addRequestInterceptor } from "@core/api/interceptors/interceptor";
import { serializeArrayParametersInterceptor } from "@core/api/interceptors/serializeArrayParametersInterceptor";
import { AdvancedInfo } from "@domain/user/advancedInfo";
import { Sex, User } from "@domain/user/user";
import { UserSettings } from "@domain/user/userSettings";
import axios, { AxiosInstance } from "axios";
import { userSettingsFromDto } from "./business";
import { UserDto, UserPutDto, UserSettingsDto } from "./type";

export class UserApi {
	private readonly instance: AxiosInstance;

	constructor(private readonly apiService: ApiService) {
		this.instance = axios.create();
		addRequestInterceptor(this.instance, serializeArrayParametersInterceptor);
	}

	/** User **/

	async getUser(): Promise<User> {
		const result = await this.apiService.get<UserDto>("/user");
		return UserApi.userFromDto(result.data);
	}

	async updateUser(userPutDto: UserPutDto): Promise<User> {
		const result = await this.apiService.put<UserDto>("/user", userPutDto);
		return UserApi.userFromDto(result.data);
	}

	async deleteMe(): Promise<any> {
		const result = await this.apiService.delete("/user/me");
		return result.data;
	}

	private static userFromDto(userDto: UserDto): User {
		return {
			...userDto,
			bornDate: new Date(userDto.bornDate),
			createdAt: new Date(userDto.createdAt),
			sex: userDto.sex === "male" ? Sex.Male : Sex.Female,
			stride: 80,
		};
	}

	/** User Settings **/

	async getUserSettings(): Promise<UserSettings> {
		const result = await this.apiService.get<UserSettingsDto>("/user/setting");
		return userSettingsFromDto(result.data);
	}

	async updateUserSettings(userSettings: UserSettingsDto): Promise<UserSettings> {
		const result = await this.apiService.put<UserSettingsDto>("/user/setting", userSettings);
		return userSettingsFromDto(result.data);
	}

	/** User Advanced Info **/

	async getAdvancedInfo(): Promise<AdvancedInfo> {
		const result = await this.apiService.get<AdvancedInfo>("/user/advanced");
		return result.data;
	}

	async updateAdvancedInfo(info: AdvancedInfo): Promise<AdvancedInfo> {
		const result = await this.apiService.put<AdvancedInfo>("/user/advanced", info);
		return result.data;
	}

	async uploadUserProfilPic(uri: string, name: string, type: string) {
		const splitType = type.split("/")[1];
		const data = (
			await this.apiService.post<{ url: string; fields: Record<string, any>; taskId: string }>("/user/me/avatar", {
				type: splitType,
			})
		).data;
		const formData = new FormData();
		Object.entries(data.fields).forEach(([k, v]) => {
			formData.append(k, v);
		});
		formData.append("Content-Type", type);
		formData.append("file", {
			uri,
			type,
			name,
		});
		await this.instance.post(data.url, formData);
	}
}
