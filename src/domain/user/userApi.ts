import { ApiService } from "@core/api/apiService";
import { DateFormat, HeightUnit, HourFormat, WeightUnit } from "@domain/units";
import { AdvancedInfo } from "@domain/user/advancedInfo";
import { Sex, User } from "@domain/user/user";
import { UserSettings } from "@domain/user/userSettings";
import axios, { AxiosInstance } from "axios";
import { addAuthorizationInterceptor } from "@core/api/interceptors/addAuthorizationInterceptor";
import { logResponseInterceptor } from "@core/api/interceptors/logResponseInterceptor";
import { getLogger } from "@core/logger/logger";
import { Logger } from "@betomorrow/logging-core";

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
	dateFormat: DateFormat;
	heightFormat: string;
	hourFormat: HourFormat;
	weightFormat: string;
}

export class UserApi {
	private readonly instance: AxiosInstance;
	private logger: Logger = getLogger("UserApi");

	constructor(private readonly apiService: ApiService) {
		// this.instance = axios.create();
		// addRequestInterceptor(this.instance, serializeArrayParametersInterceptor);
		// addAuthorizationInterceptor(this.instance);
		// addResponseInterceptor(this.instance, logResponseInterceptor(this.logger));
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
			hourFormat: (userSettingsDto.hourFormat === "12" ? "12" : "24") as HourFormat,
			weightFormat: userSettingsDto.weightFormat === "kg" ? WeightUnit.kg : WeightUnit.lbs,
			heightFormat: userSettingsDto.heightFormat === "cm" ? HeightUnit.cm : HeightUnit.ft,
		};
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
		console.log("type.split('/')[1]", type.split("/")[1]);
		try {
			const splitType = type.split("/")[1];
			console.log("Type", type);
			const data = (
				await this.apiService.post<{ url: string; fields: Record<string, any>; taskId: string }>("/user/me/avatar", {
					type: splitType,
				})
			).data;
			console.log("data", data);
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
			console.log("Data.url", data.url, " formData", formData);
			await this.apiService.post(data.url, formData);
		} catch (err) {
			console.log("Err", JSON.stringify(err));
			throw err;
		}
	}
}
