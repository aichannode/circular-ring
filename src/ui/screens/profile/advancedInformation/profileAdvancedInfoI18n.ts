import {
	BirthControl,
	ChronoType,
	DietarySupplements,
	FertilityState,
	PhysicalDisability,
	PillPackFormat,
	SleepDisorder,
	SleeperType,
	SleepingPills,
	WorkTime,
} from "@domain/user/advancedInfo";
import { WordingKey } from "../../../../wordings";

export function advanceInfoI18nKey<T>(keys: Map<T, WordingKey>, infoKey: T | undefined): WordingKey {
	if (infoKey) {
		return keys.get(infoKey) ?? "profile_advanced_info.unknown_option";
	}
	return "profile_advanced_info.unknown_option";
}

export const workTimeKeys = new Map<WorkTime, WordingKey>([
	[WorkTime.DAY, "profile_advanced_info.work_time.day"],
	[WorkTime.NIGHT, "profile_advanced_info.work_time.night"],
]);

export const chronoTypeKeys = new Map<ChronoType, WordingKey>([
	[ChronoType.MORNING, "profile_advanced_info.chrono_type.morning"],
	[ChronoType.SOLAR, "profile_advanced_info.chrono_type.solar"],
	[ChronoType.NIGHT, "profile_advanced_info.chrono_type.night"],
	[ChronoType.MORNING_ERRATIC, "profile_advanced_info.chrono_type.morning_erratic"],
	[ChronoType.SOLAR_ERRATIC, "profile_advanced_info.chrono_type.solar_erratic"],
	[ChronoType.NIGHT_ERRATIC, "profile_advanced_info.chrono_type.night_erratic"],
]);

export const physicalDisabilityKeys = new Map<PhysicalDisability, WordingKey>([
	[PhysicalDisability.NONE, "profile_advanced_info.physical_disability.none"],
	[PhysicalDisability.MODERATE, "profile_advanced_info.physical_disability.moderate"],
	[PhysicalDisability.TOTAL, "profile_advanced_info.physical_disability.total"],
]);

export const sleepDisorderKeys = new Map<SleepDisorder, WordingKey>([
	[SleepDisorder.NONE, "profile_advanced_info.sleep_disorder.none"],
	[SleepDisorder.INSOMNIA, "profile_advanced_info.sleep_disorder.insomnia"],
	[SleepDisorder.HYPERSOMNIA, "profile_advanced_info.sleep_disorder.hypersomnia"],
	[SleepDisorder.OTHER, "profile_advanced_info.sleep_disorder.other"],
]);

export const sleepingPillsKeys = new Map<SleepingPills, WordingKey>([
	[SleepingPills.NONE, "profile_advanced_info.sleeping_pills.none"],
	[SleepingPills.DAILY, "profile_advanced_info.sleeping_pills.daily"],
	[SleepingPills.WEEKLY, "profile_advanced_info.sleeping_pills.weekly"],
	[SleepingPills.MONTHLY, "profile_advanced_info.sleeping_pills.monthly"],
]);

export const dietarySupplementsKeys = new Map<DietarySupplements, WordingKey>([
	[DietarySupplements.NONE, "profile_advanced_info.dietary_supplements.none"],
	[DietarySupplements.DAILY, "profile_advanced_info.dietary_supplements.daily"],
	[DietarySupplements.WEEKLY, "profile_advanced_info.dietary_supplements.weekly"],
	[DietarySupplements.MONTHLY, "profile_advanced_info.dietary_supplements.monthly"],
]);

export const sleeperTypeKeys = new Map<SleeperType, WordingKey>([
	[SleeperType.LIGHT, "profile_advanced_info.sleeper_type.light"],
	[SleeperType.NIGHT, "profile_advanced_info.sleeper_type.night"],
]);

export const fertilityStateKeys = new Map<FertilityState, WordingKey>([
	[FertilityState.MENSTRUAL_CYCLE, "profile_advanced_info.fertility_state.menstrual_cycle"],
	[FertilityState.MENOPAUSE, "profile_advanced_info.fertility_state.menopause"],
	[FertilityState.PERIMENOPAUSE, "profile_advanced_info.fertility_state.perimenopause"],
]);

export const birthControlKeys = new Map<BirthControl, WordingKey>([
	[BirthControl.NONE, "profile_advanced_info.birth_control.none"],
	[BirthControl.PILLS, "profile_advanced_info.birth_control.pills"],
	[BirthControl.CONDOMS, "profile_advanced_info.birth_control.condoms"],
	[BirthControl.VAGINAL_RING, "profile_advanced_info.birth_control.vaginal_ring"],
	[BirthControl.PATCH, "profile_advanced_info.birth_control.patch"],
	[BirthControl.IUD, "profile_advanced_info.birth_control.iud"],
	[BirthControl.IMPLANT, "profile_advanced_info.birth_control.implant"],
	[BirthControl.FERTILITY_AWARENESS, "profile_advanced_info.birth_control.fertility_awareness"],
	[BirthControl.OTHER, "profile_advanced_info.birth_control.other"],
]);

export const pillPackFormatKeys = new Map<PillPackFormat, WordingKey>([
	[PillPackFormat.DAYS_28, "profile_advanced_info.pill_pack_format.days_28"],
	[PillPackFormat.DAYS_24, "profile_advanced_info.pill_pack_format.days_24"],
	[PillPackFormat.DAYS_21, "profile_advanced_info.pill_pack_format.days_21"],
]);
