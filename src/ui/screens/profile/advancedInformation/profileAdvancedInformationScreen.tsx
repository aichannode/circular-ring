import { useServices } from "@core/services";
import { BirthControl, FertilityState, WorkTime } from "@domain/user/advancedInfo";
import { useUser, useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { Sex } from "@domain/user/user";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { AdvancedInfoBottomSheetConfig } from "@ui/screens/profile/advancedInformation/advancedInfoBottomSheetConfig";
import {
	AdvancedInfoEditionBottomSheet,
	AdvancedInfoEditionConfig,
	EditionInfoType,
} from "@ui/screens/profile/advancedInformation/advancedInfoEditionBottomSheet";
import { BMICard } from "@ui/screens/profile/advancedInformation/bmiCard";
import { ChronotypeCard } from "@ui/screens/profile/advancedInformation/chronotypeCard";
import { HeartRateCard } from "@ui/screens/profile/advancedInformation/heartRateCard";
import {
	advanceInfoI18nKey,
	birthControlKeys,
	dietarySupplementsKeys,
	fertilityStateKeys,
	physicalDisabilityKeys,
	pillPackFormatKeys,
	sleepDisorderKeys,
	sleepingPillsKeys,
	workTimeKeys,
} from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

export const ProfileAdvancedInformationScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const { userService } = useServices();
	const user = useUser();
	const advancedInfo = useUserAdvancedInfo();

	const configsRef = useRef(new AdvancedInfoBottomSheetConfig(userService, format, advancedInfo));
	const [bottomSheetConfig, setBottomSheetConfig] = useState<AdvancedInfoEditionConfig<EditionInfoType>>(
		configsRef.current.workTimeConfig
	);
	const [currentOption, setCurrentOption] = useState<EditionInfoType>(WorkTime.DAY);
	const editionBottomSheetRef = useRef<BottomSheetModal>(null);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const [isLoading, setLoading] = useState(false);

	function configureEditionBottomSheet(config: AdvancedInfoEditionConfig<EditionInfoType>, option: EditionInfoType) {
		setBottomSheetConfig(config);
		setCurrentOption(option);
	}

	return !advancedInfo ? null : (
		<ScrollScreen contentContainerStyle={{ paddingTop: 0 }}>
			<InfoListHeader>{format("profile_advanced_info.about_you")}</InfoListHeader>
			<HeartRateCard />
			<BMIChronoContainer>
				<BMICard />
				<View style={{ width: 20 }} />
				<ChronotypeCard />
			</BMIChronoContainer>
			<InfoListHeader>{format("profile_advanced_info.lifestyle_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_advanced_info.work_time.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(workTimeKeys, advancedInfo.workTime))}
				action={() => {
					configureEditionBottomSheet(configsRef.current.workTimeConfig, advancedInfo?.workTime ?? WorkTime.DAY);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.physical_disability.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(physicalDisabilityKeys, advancedInfo.physicalDisabilities))}
				action={() => {
					configureEditionBottomSheet(configsRef.current.physicalDisabilitiesConfig, advancedInfo.physicalDisabilities);
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
					configureEditionBottomSheet(configsRef.current.sleepDisorderConfig, advancedInfo.sleepDisorder);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.sleeping_pills.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(sleepingPillsKeys, advancedInfo.sleepingPills))}
				action={() => {
					configureEditionBottomSheet(configsRef.current.sleepingPillsConfig, advancedInfo.sleepingPills);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.dietary_supplements.title")}
				hasDisclosure={true}
				value={format(advanceInfoI18nKey(dietarySupplementsKeys, advancedInfo.dietarySupplements))}
				action={() => {
					configureEditionBottomSheet(configsRef.current.dietarySupplementsConfig, advancedInfo.dietarySupplements);
					editionBottomSheetRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("profile_advanced_info.open_for_napping.title")}
				switchOptions={[format("global.yes"), format("global.no")]}
				switchValue={advancedInfo.openForNap ? format("global.yes") : format("global.no")}
				onSwitchSelect={async (value) => {
					setLoading(true);
					setErrorMessage(undefined);
					const isTrue = value === format("global.yes");
					try {
						await userService.updateUserAdvancedInfo({ openForNap: isTrue });
					} catch (error) {
						setErrorMessage(format("global.default_error"));
					}
					setLoading(false);
				}}
				loading={isLoading}
				errorMessage={errorMessage}
			/>
			{(user?.sex === Sex.Female ?? false) && (
				<>
					<InfoListHeader>{format("profile_advanced_info.period_tracking_info")}</InfoListHeader>
					<InfoListItem
						name={format("profile_advanced_info.fertility_state.title")}
						hasDisclosure={true}
						value={format(advanceInfoI18nKey(fertilityStateKeys, advancedInfo.female.fertilityState))}
						action={() => {
							configureEditionBottomSheet(configsRef.current.fertilityStateConfig, advancedInfo.female.fertilityState);
							editionBottomSheetRef.current?.present();
						}}
					/>
					<InfoListItem
						name={format("profile_advanced_info.cycle_length.title")}
						hasDisclosure={true}
						value={"TODO"}
						action={() => {
							// configureEditionBottomSheet(configsRef.current.dietarySupplementsConfig, advancedInfo.dietarySupplements);
							// editionBottomSheetRef.current?.present();
						}}
						disabled={advancedInfo.female.fertilityState === FertilityState.MENOPAUSE}
					/>
					<InfoListItem
						name={format("profile_advanced_info.birth_control.title")}
						hasDisclosure={true}
						value={format(advanceInfoI18nKey(birthControlKeys, advancedInfo.female.birthControl))}
						action={() => {
							navigate(Routes.ProfileBirthControl);
						}}
						disabled={advancedInfo.female.fertilityState !== FertilityState.MENSTRUAL_CYCLE}
					/>
					<InfoListItem
						name={format("profile_advanced_info.pill_pack_format.title")}
						hasDisclosure={true}
						value={format(advanceInfoI18nKey(pillPackFormatKeys, advancedInfo.female.pillPackFormat))}
						action={() => {
							configureEditionBottomSheet(configsRef.current.pillPackFormatConfig, advancedInfo.female.pillPackFormat);
							editionBottomSheetRef.current?.present();
						}}
						disabled={
							advancedInfo.female.fertilityState !== FertilityState.MENSTRUAL_CYCLE ||
							advancedInfo.female.birthControl !== BirthControl.PILLS
						}
					/>
					<InfoListItem
						name={format("profile_advanced_info.conceiving.title")}
						switchOptions={[format("global.yes"), format("global.no")]}
						switchValue={advancedInfo.female.conceiving ? format("global.yes") : format("global.no")}
						onSwitchSelect={async (value) => {
							setLoading(true);
							setErrorMessage(undefined);
							const isTrue = value === format("global.yes");
							try {
								await userService.updateUserAdvancedInfo({
									female: { ...advancedInfo.female, conceiving: isTrue },
								});
							} catch (error) {
								setErrorMessage(format("global.default_error"));
							}
							setLoading(false);
						}}
						loading={isLoading}
						errorMessage={errorMessage}
						disabled={
							advancedInfo.female.fertilityState !== FertilityState.MENSTRUAL_CYCLE ||
							advancedInfo.female.birthControl !== BirthControl.NONE
						}
					/>
				</>
			)}
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

const BMIChronoContainer = styled.View`
	flex-direction: row;
	margin: 20px 20px 0;
`;
