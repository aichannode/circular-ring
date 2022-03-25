export enum WorkTime {
	DAY = "DAY",
	NIGHT = "NIGHT",
}

export enum ChronoType {
	MORNING = "MORNING",
	SOLAR = "SOLAR",
	NIGHT = "NIGHT",
	MORNING_ERRATIC = "MORNING_ERRATIC",
	SOLAR_ERRATIC = "SOLAR_ERRATIC",
	NIGHT_ERRATIC = "NIGHT_ERRATIC",
}

export enum PhysicalDisability {
	NONE = "NONE",
	MODERATE = "MODERATE",
	TOTAL = "TOTAL",
}

export enum SleepDisorder {
	NONE = "NONE",
	INSOMNIA = "INSOMNIA",
	HYPERSOMNIA = "HYPERSOMNIA",
	OTHER = "OTHER",
}

export enum SleepingPills {
	NONE = "NONE",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
}

export enum DietarySupplements {
	NONE = "NONE",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
}

export enum SleeperType {
	LIGHT = "LIGHT",
	NIGHT = "NIGHT",
}

export interface HrZone {
	min: number;
	max: number;
}

export enum FertilityState {
	MENSTRUAL_CYCLE = "MENSTRUAL_CYCLE",
	MENOPAUSE = "MENOPAUSE",
	PERIMENOPAUSE = "PERIMENOPAUSE",
}

export enum BirthControl {
	NONE = "NONE",
	PILLS = "PILLS",
	CONDOMS = "CONDOMS",
	VAGINAL_RING = "VAGINAL_RING",
	PATCH = "PATCH",
	IUD = "IUD",
	IMPLANT = "IMPLANT",
	FERTILITY_AWARENESS = "FERTILITY_AWARENESS",
	OTHER = "OTHER",
}

export enum PillPackFormat {
	DAYS_28 = "28_DAYS",
	DAYS_24 = "24_DAYS",
	DAYS_21 = "21_DAYS",
}

export interface FemaleInfo {
	fertilityState: FertilityState;
	cycleLength: number;
	birthControl: BirthControl;
	pillPackFormat: PillPackFormat;
	conceiving: boolean;
}

export interface AdvancedInfo {
	bmi: number;
	workTime: WorkTime;
	chronoType: ChronoType;
	physicalDisabilities: PhysicalDisability;
	sleepDisorder: SleepDisorder;
	sleepingPills: SleepingPills;
	dietarySupplements: DietarySupplements;
	sleeperType: SleeperType;
	openForNap: boolean;
	maxHr: number;
	hrZone: HrZone;
	comparativeVo2Max: number;
	comparativeRhr: number;
	female: FemaleInfo;
	stride: number;
}
