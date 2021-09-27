import { useServices } from "@core/services";
import {
	DietarySupplements,
	PhysicalDisability,
	SleepDisorder,
	SleepingPills,
	WorkTime,
} from "@domain/user/advancedInfo";
import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import {
	AdvancedInfoEditionBottomSheet,
	AdvancedInfoEditionConfig,
	EditionInfoType,
} from "@ui/screens/profile/advancedInformation/advancedInfoEditionBottomSheet";
import {
	advanceInfoI18nKey,
	dietarySupplementsKeys,
	physicalDisabilityKeys,
	sleepDisorderKeys,
	sleepingPillsKeys,
	workTimeKeys,
} from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import React, { useRef, useState } from "react";

export const ProfileAdvancedInformationScreen = () => {
	const { format } = useI18n();
	const advancedInfo = useUserAdvancedInfo();
	const { userService } = useServices();

	const workTimeConfig: AdvancedInfoEditionConfig<EditionInfoType> = {
		title: format("profile_advanced_info.work_time.title"),
		description: undefined,
		options: [WorkTime.DAY, WorkTime.NIGHT],
		translationSet: workTimeKeys,
		saveProcess: async (option: EditionInfoType) => {
			await userService.updateUserAdvancedInfo({ workTime: option as WorkTime });
		},
	};
	const physicalDisabilitiesConfig: AdvancedInfoEditionConfig<EditionInfoType> = {
		title: format("profile_advanced_info.physical_disability.title"),
		description: undefined,
		options: [PhysicalDisability.NONE, PhysicalDisability.TOTAL, PhysicalDisability.MODERATE],
		translationSet: physicalDisabilityKeys,
		saveProcess: async (option: EditionInfoType) => {
			await userService.updateUserAdvancedInfo({ physicalDisabilities: option as PhysicalDisability });
		},
	};
	const sleepDisorderConfig: AdvancedInfoEditionConfig<EditionInfoType> = {
		title: format("profile_advanced_info.sleep_disorder.title"),
		description: undefined,
		options: [SleepDisorder.NONE, SleepDisorder.INSOMNIA, SleepDisorder.HYPERSOMNIA, SleepDisorder.OTHER],
		translationSet: sleepDisorderKeys,
		saveProcess: async (option: EditionInfoType) => {
			await userService.updateUserAdvancedInfo({ sleepDisorder: option as SleepDisorder });
		},
	};
	const sleepingPillsConfig: AdvancedInfoEditionConfig<EditionInfoType> = {
		title: format("profile_advanced_info.sleeping_pills.title"),
		description: format("profile_advanced_info.sleeping_pills.description"),
		options: [SleepingPills.NONE, SleepingPills.DAILY, SleepingPills.WEEKLY, SleepingPills.MONTHLY],
		translationSet: sleepingPillsKeys,
		saveProcess: async (option: EditionInfoType) => {
			await userService.updateUserAdvancedInfo({ sleepingPills: option as SleepingPills });
		},
	};
	const dietarySupplementsConfig: AdvancedInfoEditionConfig<EditionInfoType> = {
		title: format("profile_advanced_info.dietary_supplements.title"),
		description: format("profile_advanced_info.dietary_supplements.description"),
		options: [DietarySupplements.NONE, DietarySupplements.DAILY, DietarySupplements.WEEKLY, DietarySupplements.MONTHLY],
		translationSet: dietarySupplementsKeys,
		saveProcess: async (option: EditionInfoType) => {
			await userService.updateUserAdvancedInfo({ dietarySupplements: option as DietarySupplements });
		},
	};

	const [bottomSheetConfig, setBottomSheetConfig] =
		useState<AdvancedInfoEditionConfig<EditionInfoType>>(workTimeConfig);
	const [currentOption, setCurrentOption] = useState<EditionInfoType>(WorkTime.DAY);
	const editionBottomSheetRef = useRef<BottomSheetModal>(null);

	function configureEditionBottomSheet(config: AdvancedInfoEditionConfig<EditionInfoType>, option: EditionInfoType) {
		setBottomSheetConfig(config);
		setCurrentOption(option);
	}

	return !advancedInfo ? null : (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<InfoListHeader>{format("profile_advanced_info.about_you")}</InfoListHeader>
			<InfoListHeader>{format("profile_advanced_info.lifestyle_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_advanced_info.work_time.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(workTimeKeys, advancedInfo.workTime))}
				action={() => {
					configureEditionBottomSheet(workTimeConfig, advancedInfo?.workTime ?? WorkTime.DAY);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.physical_disability.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(physicalDisabilityKeys, advancedInfo.physicalDisabilities))}
				action={() => {
					configureEditionBottomSheet(physicalDisabilitiesConfig, advancedInfo.physicalDisabilities);
					editionBottomSheetRef.current?.present();
				}}
			/>
			{/*<InfoListItem*/}
			{/*	name={format("profile_advanced_info.stride.title")}*/}
			{/*	hasDisclosure={true}*/}
			{/*	value={"toto cm"}*/}
			{/*	// action={() => navigate(Routes.ProfileEditName)}*/}
			{/*/>*/}
			<InfoListItem
				name={format("profile_advanced_info.sleep_disorder.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(sleepDisorderKeys, advancedInfo.sleepDisorder))}
				action={() => {
					configureEditionBottomSheet(sleepDisorderConfig, advancedInfo.sleepDisorder);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.sleeping_pills.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(sleepingPillsKeys, advancedInfo.sleepingPills))}
				action={() => {
					configureEditionBottomSheet(sleepingPillsConfig, advancedInfo.sleepingPills);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.dietary_supplements.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(dietarySupplementsKeys, advancedInfo.dietarySupplements))}
				action={() => {
					configureEditionBottomSheet(dietarySupplementsConfig, advancedInfo.dietarySupplements);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.open_for_napping.title")}
				switchOptions={[format("global.yes"), format("global.no")]}
				switchValue={advancedInfo.openForNap ? format("global.yes") : format("global.no")}
				onSwitchSelect={(value) => {
					// TODO
				}}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={editionBottomSheetRef}>
				<AdvancedInfoEditionBottomSheet
					config={bottomSheetConfig}
					currentOption={currentOption}
					onClose={() => editionBottomSheetRef.current?.close()}
				/>
			</CircularBottomSheet>
		</ScrollScreen>
	);
};
