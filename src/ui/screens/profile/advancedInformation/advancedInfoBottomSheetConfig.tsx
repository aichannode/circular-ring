import {
	DietarySupplements,
	PhysicalDisability,
	SleepDisorder,
	SleepingPills,
	WorkTime,
} from "@domain/user/advancedInfo";
import { UserService } from "@domain/user/userService";
import {
	AdvancedInfoEditionConfig,
	EditionInfoType,
} from "@ui/screens/profile/advancedInformation/advancedInfoEditionBottomSheet";
import {
	dietarySupplementsKeys,
	physicalDisabilityKeys,
	sleepDisorderKeys,
	sleepingPillsKeys,
	workTimeKeys,
} from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import { WordingKey } from "../../../../wordings";

export class AdvancedInfoBottomSheetConfig {
	workTimeConfig: AdvancedInfoEditionConfig<EditionInfoType>;
	physicalDisabilitiesConfig: AdvancedInfoEditionConfig<EditionInfoType>;
	sleepDisorderConfig: AdvancedInfoEditionConfig<EditionInfoType>;
	sleepingPillsConfig: AdvancedInfoEditionConfig<EditionInfoType>;
	dietarySupplementsConfig: AdvancedInfoEditionConfig<EditionInfoType>;

	constructor(private userService: UserService, private format: (key: WordingKey) => string) {
		this.workTimeConfig = {
			title: this.format("profile_advanced_info.work_time.title"),
			description: undefined,
			options: [WorkTime.DAY, WorkTime.NIGHT],
			translationSet: workTimeKeys,
			saveProcess: async (option: EditionInfoType) => {
				await this.userService.updateUserAdvancedInfo({ workTime: option as WorkTime });
			},
		};
		this.physicalDisabilitiesConfig = {
			title: this.format("profile_advanced_info.physical_disability.title"),
			description: undefined,
			options: [PhysicalDisability.NONE, PhysicalDisability.TOTAL, PhysicalDisability.MODERATE],
			translationSet: physicalDisabilityKeys,
			saveProcess: async (option: EditionInfoType) => {
				await this.userService.updateUserAdvancedInfo({ physicalDisabilities: option as PhysicalDisability });
			},
		};
		this.sleepDisorderConfig = {
			title: this.format("profile_advanced_info.sleep_disorder.title"),
			description: undefined,
			options: [SleepDisorder.NONE, SleepDisorder.INSOMNIA, SleepDisorder.HYPERSOMNIA, SleepDisorder.OTHER],
			translationSet: sleepDisorderKeys,
			saveProcess: async (option: EditionInfoType) => {
				await this.userService.updateUserAdvancedInfo({ sleepDisorder: option as SleepDisorder });
			},
		};
		this.sleepingPillsConfig = {
			title: this.format("profile_advanced_info.sleeping_pills.title"),
			description: this.format("profile_advanced_info.sleeping_pills.description"),
			options: [SleepingPills.NONE, SleepingPills.DAILY, SleepingPills.WEEKLY, SleepingPills.MONTHLY],
			translationSet: sleepingPillsKeys,
			saveProcess: async (option: EditionInfoType) => {
				await this.userService.updateUserAdvancedInfo({ sleepingPills: option as SleepingPills });
			},
		};
		this.dietarySupplementsConfig = {
			title: this.format("profile_advanced_info.dietary_supplements.title"),
			description: this.format("profile_advanced_info.dietary_supplements.description"),
			options: [
				DietarySupplements.NONE,
				DietarySupplements.DAILY,
				DietarySupplements.WEEKLY,
				DietarySupplements.MONTHLY,
			],
			translationSet: dietarySupplementsKeys,
			saveProcess: async (option: EditionInfoType) => {
				await this.userService.updateUserAdvancedInfo({ dietarySupplements: option as DietarySupplements });
			},
		};
	}
}
