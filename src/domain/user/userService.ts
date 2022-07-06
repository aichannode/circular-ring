import { getLogger } from "@core/logger/logger";
import { apiService, resetServices } from "@core/services";
import { Storage } from "@core/storage";
import { round2Digits, toServerDate } from "@core/utils";
import { AppStateService } from "@domain/appState/appStateService";
import { AuthService } from "@domain/auth/authService";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { DateFormat, HeightUnit, HourFormat, NotificationsFormat, TemperatureFormat, WeightUnit } from "@domain/units";
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
import { Language, Sex, User } from "@domain/user/user";
import { UserApi } from "@domain/user/userApi";
import { UserNotificationsSettings } from "@domain/user/userNotificationsSettings";
import { UserSettings } from "@domain/user/userSettings";
import { UserStorage } from "@domain/user/userStorage";
import { observable } from "micro-observables";
import { dtoFromUserSettings } from "./business";
import { UserPutDto } from "./type";

const defaultNotificationsSettings = {
	kira: "On",
	banner: "On",
	update: "On",
	period: "On",
	PMS: "On",
	fertility: "On",
	highHRAlert: "Off",
	lowHRAlert: "Off",
	lowSPO2Alert: "Off",
	highHR: 190,
	lowHR: 50,
	SPO2: 90,
};

const defaultSettings = {
	dateFormat: DateFormat.SI,
	heightFormat: HeightUnit.cm,
	weightFormat: WeightUnit.kg,
	hourFormat: HourFormat.TWELVE,
	temperatureFormat: TemperatureFormat.CELSIUS,
	notifications: [NotificationsFormat.BANNER],
};

export class UserService {
	private readonly logger = getLogger("UserService");

	private _justRegisteredUserEmail = observable<string | null>(null);
	private _authenticatedUserEmail = observable<string | null>(null);
	private _connectionStartTime = observable<string | null>(null);
	private _user = observable<User | null>(null);
	private _userSettings = observable<UserSettings | null>(null);
	private _userNotificationsSettings = observable<UserNotificationsSettings>(defaultNotificationsSettings);
	private _userAdvancedInfo = observable<AdvancedInfo | null>(null);

	readonly justRegisteredUserEmail = this._justRegisteredUserEmail.readOnly();
	readonly authenticatedUserEmail = this._authenticatedUserEmail.readOnly();
	readonly connectionStartTime = this._connectionStartTime.readOnly();
	readonly user = this._user.readOnly();
	readonly userSettings = this._userSettings.readOnly();
	readonly userNotificationsSettings = this._userNotificationsSettings.readOnly();
	readonly userAdvancedInfo = this._userAdvancedInfo.readOnly();

	constructor(
		private readonly authService: AuthService,
		private readonly userApi: UserApi,
		private readonly userStorage: UserStorage,
		private readonly bleDeviceService: BleDeviceService,
		private readonly appStateService: AppStateService
	) {}

	async init() {
		this._user.set(await this.userStorage.loadUser());
		this._userSettings.set(await this.userStorage.loadUserSettings());
		const loadedNotificationsSettings = await this.userStorage.loadUserNotificationsSettings();
		if (loadedNotificationsSettings !== null) this._userNotificationsSettings.set(loadedNotificationsSettings);
		this._userAdvancedInfo.set(await this.userStorage.loadUserAdvancedInfo());
		const authenticatedEmail = this.authService.userEmail.get();
		if (!!authenticatedEmail) {
			this._authenticatedUserEmail.set(authenticatedEmail);
			this._connectionStartTime.set(new Date().toISOString());

			// Async refresh user informations
			this.retrieveUser().catch(() => {
				this.logger.warn("Authenticated but user does not exist on server");
			});
		}
	}

	async reset() {
		/** Clean user observable **/
		this._user.set(null);
		this._userSettings.set(null);
		this._userNotificationsSettings.set(defaultNotificationsSettings);
		this._userAdvancedInfo.set(null);
		this._authenticatedUserEmail.set(null);
		this._connectionStartTime.set(null);
		this._justRegisteredUserEmail.set(null);

		/** Clean user Storage **/
		this.userStorage.removeJustRegisteredUser();
		this.userStorage.removeUser();
		this.userStorage.removeUserAdvancedInfo();
		this.userStorage.removeUserNotificationsSettings();
		this.userStorage.removeUserSettings();
	}

	/** Login & Auth management **/

	async loginWithEmail(email: string, password: string): Promise<void> {
		this.logger.debug("Calling authService");
		try {
			await this.authService.loginEmail(email, password);
			await this.retrieveUser();
			this._authenticatedUserEmail.set(email);
			Storage.save("lastAuthenticatedUserEmail", email);
			this._connectionStartTime.set(new Date().toISOString());
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

	async changePassword(oldPassword: string, newPassword: string): Promise<void> {
		await this.authService.changePassword(oldPassword, newPassword);
	}

	async logout() {
		// const appDataIds = await Storage.getAllKeys();
		// Storage.multiRemove(appDataIds);

		await apiService.reset();
		await this.bleDeviceService.reset();
		await this.reset();
		await this.appStateService.reset();
		await resetServices();
		await this.authService.logout();
	}

	async deleteMe() {
		await this.userApi.deleteMe();
		this.logout();
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

	async retrieveUser() {
		// get User
		try {
			// Fetch Language from Async Storage because this property isn't in the database

			const user = await this.userApi.getUser();
			user.language = (await this.userStorage.loadUser())?.language ?? user.language;
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
			throw error;
		}
	}

	async updateUserNotificationsSettings(newValue: any) {
		this._userNotificationsSettings.update((notifications) => {
			return { ...notifications, ...newValue };
		});
		await this.userStorage.saveUserNotificationsSettings({ ...this._userNotificationsSettings.get(), ...newValue });
		const userNotifications = this._userNotificationsSettings.get();
		if ("lowHR" in newValue || "lowHRAlert" in newValue) {
			console.log("userNotifications.lowHRAlert", userNotifications.lowHRAlert);
			const activated = userNotifications.lowHRAlert === "On" ? "01" : "00";
			const value = userNotifications.lowHR.toString(16);
			await this.bleDeviceService.write(`ALT01${activated}${value}`);
		} else if ("highHR" in newValue || "highHRAlert" in newValue) {
			const activated = userNotifications.highHRAlert === "On" ? "01" : "00";
			const value = userNotifications.highHR.toString(16);
			await this.bleDeviceService.write(`ALT02${activated}${value}`);
		} else if ("SPO2" in newValue || "SPO2Alert") {
			const activated = userNotifications.lowSPO2Alert === "On" ? "01" : "00";
			const value = userNotifications.SPO2.toString(16);
			await this.bleDeviceService.write(`ALT00${activated}${value}`);
		}
	}

	async updateUserSettings(settings: Partial<UserSettings>) {
		try {
			const dtoSettings = dtoFromUserSettings({ ...defaultSettings, ...settings });
			const userSettings = await this.userApi.updateUserSettings(dtoSettings);
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
			phoneNumber: "+33666666666",
			profilePictureUrl: null,
			language: Language.EN,
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
		language?: Language;
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
				language: userInfo.language ?? currentUser.language,
				scorePublic: currentUser.scorePublic,
				stride: 0, //currentUser.stride, => Server patch
				tutorialCompleted: currentUser.tutorialCompleted,
			});
		}
	}

	private async updateUser(userPutDto: UserPutDto) {
		try {
			const user = await this.userApi.updateUser(userPutDto);
			user.language = userPutDto.language;
			await this.userStorage.saveUser(user);
			this._user.set(user);
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
		const defaultUserAdvancedInfo = {
			workTime: "DAY",
			chronoType: "MORNING",
			physicalDisabilities: "NONE",
			sleepDisorder: "NONE",
			dietarySupplements: "NONE",
			sleeperType: "LIGHT",
			sleepingPills: "NONE",
		};
		const currentInfo = this._userAdvancedInfo.get();
		if (currentInfo) {
			try {
				const userAdvancedInfo = await this.userApi.updateAdvancedInfo({
					...defaultUserAdvancedInfo,
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

	async uploadProfilPicture(uri: string, name: string, type: string) {
		try {
			await this.userApi.uploadUserProfilPic(uri, name, type);
			this.retrieveUser();
		} catch (err) {
			throw err;
		}
	}

	async getGoals() {
		return this.userApi.getGoals();
	}
}
