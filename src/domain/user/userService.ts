import { getLogger } from "@core/logger/logger";
import { round2Digits, toServerDate } from "@core/utils";
import { AuthService } from "@domain/auth/authService";
import { DateFormat, HeightUnit, HourFormat, WeightUnit } from "@domain/units";
import {
	AdvancedInfo,
	ChronoType,
	DietarySupplements,
	FemaleInfo,
	HrZone,
	PhysicalDisability,
	SleepDisorder,
	SleeperType,
	SleepingPills,
	WorkTime,
} from "@domain/user/advancedInfo";
import { TutorialInfo } from "@domain/user/tutorialInfo";
import { Sex, User } from "@domain/user/user";
import { UserApi, UserPutDto } from "@domain/user/userApi";
import { UserSettings } from "@domain/user/userSettings";
import { UserStorage } from "@domain/user/userStorage";
import { observable } from "micro-observables";
import * as RNLocalize from "react-native-localize";

const defaultSettings = {
	dateFormat: DateFormat.DMY,
	heightFormat: HeightUnit.cm,
	weightFormat: WeightUnit.kg,
	hourFormat: "12" as HourFormat,
	id: "default_settings",
};

export class UserService {
	private readonly logger = getLogger("UserService");

	private _justRegisteredUserEmail = observable<string | null>(null);
	private _authenticatedUserEmail = observable<string | null>(null);
	private _user = observable<User | null>(null);
	private _userSettings = observable<UserSettings | null>(null);
	private _userAdvancedInfo = observable<AdvancedInfo | null>(null);

	readonly justRegisteredUserEmail = this._justRegisteredUserEmail.readOnly();
	readonly authenticatedUserEmail = this._authenticatedUserEmail.readOnly();
	readonly user = this._user.readOnly();
	readonly userSettings = this._userSettings.readOnly();
	readonly userAdvancedInfo = this._userAdvancedInfo.readOnly();

	constructor(
		private readonly authService: AuthService,
		private readonly userApi: UserApi,
		private readonly userStorage: UserStorage
	) {}

	async init() {
		this._user.set(await this.userStorage.loadUser());
		this._userSettings.set(await this.userStorage.loadUserSettings());
		this._userAdvancedInfo.set(await this.userStorage.loadUserAdvancedInfo());
		const authenticatedEmail = this.authService.userEmail.get();
		if (!!authenticatedEmail) {
			try {
				await this.retrieveUser();
			} catch (error) {
				this.logger.warn("Authenticated but user does not exist on server");
			}
			this._authenticatedUserEmail.set(authenticatedEmail);
		}
	}

	/** Login & Auth management **/

	async loginWithEmail(email: string, password: string): Promise<void> {
		this.logger.debug("Calling authService");
		try {
			await this.authService.loginEmail(email, password);
			await this.retrieveUser();
			this._authenticatedUserEmail.set(email);
		} catch (error) {
			if ((error as { code: string }).code === "UserNotConfirmedException") {
				await this.userStorage.saveJustRegisteredUser(email, password);
				this._justRegisteredUserEmail.set(email);
			} else if ((error as { statusCode: number }).statusCode === 404) {
				this._authenticatedUserEmail.set(email);
			}
			throw error;
		}
	}

	async resetPassword(email: string): Promise<void> {
		await this.authService.forgotPassword(email);
	}

	async resendResetToken(email: string): Promise<void> {
		await this.authService.forgotPassword(email);
	}

	async newPassword(email: string, resetToken: string, newPassword: string): Promise<void> {
		await this.authService.newPassword(email, resetToken, newPassword);
	}

	async logout() {
		await this.authService.logout();
		this._user.set(null);
		this._authenticatedUserEmail.set(null);
		await this.userStorage.removeUser();
		await this.userStorage.removeUserSettings();
		await this.userStorage.removeUserAdvancedInfo();
	}

	/** Sign Up **/

	async signUpWithEmail(email: string, password: string) {
		await this.authService.signUpEmail(email, password);
		await this.userStorage.saveJustRegisteredUser(email, password);
		this._justRegisteredUserEmail.set(email);
	}

	async resendSignUpCode() {
		const justRegistered = await this.userStorage.loadJustRegisteredUser();
		if (justRegistered) {
			await this.authService.resendSignUpValidationCode(justRegistered.email);
		} else {
			throw Error("Cannot retrieve JustRegistered user credentials");
		}
	}

	async validateSignUp(code: string) {
		const justRegistered = await this.userStorage.loadJustRegisteredUser();
		if (justRegistered) {
			await this.authService.validateSignUpConfirmationCode(code, justRegistered.email);
			await this.loginWithEmail(justRegistered.email, justRegistered.password);
			await this.userStorage.removeJustRegisteredUser();
		} else {
			throw Error("Cannot retrieve JustRegistered user credentials");
		}
	}

	/** Circular user **/

	private async retrieveUser() {
		// get User
		try {
			const user = await this.userApi.getUser();
			this._user.set(user);
			await this.userStorage.saveUser(user);
		} catch (error) {
			this.logger.warn("Get user failed: " + JSON.stringify(error));
			if ((error as { statusCode: number }).statusCode !== 404) {
				// 404 == User does not exist on Circular yet => other error : logout
				await this.logout();
			}
			throw error;
		}

		// get User Settings
		try {
			const userSettings = await this.userApi.getUserSettings();
			this._userSettings.set(userSettings);
			await this.userStorage.saveUserSettings(userSettings);
		} catch (error) {
			this.logger.warn("Get user settings failed. Applying default settings.", JSON.stringify(error));
			this._userSettings.set(defaultSettings);
			await this.userStorage.saveUserSettings(defaultSettings);
		}

		// get User AdvancedInfo
		try {
			const userAdvancedInfo = await this.userApi.getAdvancedInfo();
			this._userAdvancedInfo.set(userAdvancedInfo);
			await this.userStorage.saveUserAdvancedInfo(userAdvancedInfo);
		} catch (error) {
			this.logger.warn("Get user settings failed: " + JSON.stringify(error));
		}
	}

	async updateUserSettings(dateFormat: string, heightUnit: HeightUnit, weightUnit: WeightUnit) {
		const timezone = RNLocalize.getTimeZone();
		try {
			const userSettings = await this.userApi.updateUserSettings({
				dateFormat,
				heightFormat: heightUnit.toString(),
				weightFormat: weightUnit === WeightUnit.kg ? "kg" : "lb",
				timezone,
			});
			this._userSettings.set(userSettings);
			await this.userStorage.saveUserSettings(userSettings);
		} catch (error) {
			this.logger.warn("Update user settings failed: " + JSON.stringify(error));
		}
	}

	async completeTutorial(tutorialInfo: TutorialInfo) {
		await this.updateUser({
			...tutorialInfo,
			height: round2Digits(tutorialInfo.height),
			weight: round2Digits(tutorialInfo.weight),
			sex: tutorialInfo.sex.toString(),
			bornDate: toServerDate(tutorialInfo.birthDate),
			phoneNumber: null,
			profilePictureUrl: null,
			language: "en",
			scorePublic: true,
			tutorialCompleted: true,
			stride: 0,
		});
	}

	// TODO : add the other fields while implementing edition
	async updateUserInfo(userInfo: {
		firstName?: string;
		lastName?: string;
		height?: number;
		weight?: number;
		sex?: Sex;
		bornDate?: Date;
	}) {
		const currentUser = this._user.get();
		if (currentUser) {
			await this.updateUser({
				firstName: userInfo.firstName ?? currentUser.firstName,
				lastName: userInfo.lastName ?? currentUser.lastName,
				country: currentUser.country,
				phoneNumber: currentUser.phoneNumber,
				profilePictureUrl: currentUser.profilePictureUrl,
				weight: round2Digits(userInfo.weight ?? currentUser.weight),
				height: round2Digits(userInfo.height ?? currentUser.height),
				sex: (userInfo.sex ?? currentUser.sex).toString(),
				bornDate: toServerDate(userInfo.bornDate ?? currentUser.bornDate),
				language: currentUser.language,
				scorePublic: currentUser.scorePublic,
				stride: 0, //currentUser.stride, => Server patch
				tutorialCompleted: currentUser.tutorialCompleted,
			});
		}
	}

	private async updateUser(userPutDto: UserPutDto) {
		try {
			const user = await this.userApi.updateUser(userPutDto);
			this._user.set(user);
			await this.userStorage.saveUser(user);
		} catch (error) {
			this.logger.warn("Update user failed: " + JSON.stringify(error));
			throw error;
		}
	}

	async updateUserAdvancedInfo(info: {
		bmi?: number;
		workTime?: WorkTime;
		chronoType?: ChronoType;
		physicalDisabilities?: PhysicalDisability;
		sleepDisorder?: SleepDisorder;
		sleepingPills?: SleepingPills;
		dietarySupplements?: DietarySupplements;
		sleeperType?: SleeperType;
		openForNap?: boolean;
		maxHr?: number;
		hrZone?: HrZone;
		vo2Max?: number;
		rhr?: number;
		female?: FemaleInfo;
		stride?: number;
		cycleLength?: number;
	}) {
		const currentInfo = this._userAdvancedInfo.get();
		if (currentInfo) {
			try {
				const userAdvancedInfo = await this.userApi.updateAdvancedInfo({
					...currentInfo,
					...info,
				});
				this._userAdvancedInfo.set(userAdvancedInfo);
				await this.userStorage.saveUserAdvancedInfo(userAdvancedInfo);
			} catch (error) {
				this.logger.warn("Update advanced-info failed: " + JSON.stringify(error));
				throw error;
			}
		}
	}
}
