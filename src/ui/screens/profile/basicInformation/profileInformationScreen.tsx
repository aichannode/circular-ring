import { round2Digits } from "@core/utils";
import { cmToFt, HeightUnit, kgToLbs, UNDEFINED_HEIGHT, UNDEFINED_WEIGHT, WeightUnit } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { Sex } from "@domain/user/user";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ConfirmSexBottomSheet } from "@ui/screens/profile/basicInformation/confirmSexBottomSheet";
import { HeightBottomSheet } from "@ui/screens/profile/basicInformation/heightBottomSheet";
import { WeightBottomSheet } from "@ui/screens/profile/basicInformation/weightBottomSheet";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

export const ProfileInformationScreen = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const userSettings = useUserSettings();
	const user = useUser();

	const displayedBirthday = dayjs(user?.bornDate || new Date()).format("DD/MM/YYYY");

	const height = user?.height ?? UNDEFINED_HEIGHT;
	const heightUnit = userSettings?.heightFormat || HeightUnit.cm;
	const displayedHeight = heightUnit === HeightUnit.ft ? round2Digits(cmToFt(height)) : Math.round(height);

	const weight = user?.weight ?? UNDEFINED_WEIGHT;
	const weightUnit = userSettings?.weightFormat || WeightUnit.kg;
	const displayedWeight = (weightUnit === WeightUnit.lbs ? Math.round(kgToLbs(weight)) : weight).toFixed(0);

	const [newSex, setNewSex] = useState(user?.sex ?? Sex.Male);

	const heightBottomSheetRef = useRef<BottomSheetModal>(null);
	const weightBottomSheetRef = useRef<BottomSheetModal>(null);
	const confirmSexBottomSheetRef = useRef<BottomSheetModal>(null);

	return !user ? null : (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<InfoListHeader>{format("profile_info.basic_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_info.name")}
				hasDisclosure
				value={`${user.firstName} ${user.lastName}`}
				action={() => navigate(Routes.ProfileEditName)}
			/>
			<InfoListItem
				name={format("profile_info.birthday")}
				hasDisclosure
				value={displayedBirthday}
				action={() => navigate(Routes.ProfileEditBirthday)}
			/>
			<InfoListItem
				name={format("profile_info.height")}
				hasDisclosure
				value={`${displayedHeight} ${heightUnit}`}
				action={() => heightBottomSheetRef.current?.present()}
			/>
			<InfoListItem
				name={format("profile_info.weight")}
				hasDisclosure
				value={`${displayedWeight} ${weightUnit}`}
				action={() => weightBottomSheetRef.current?.present()}
			/>
			<InfoListItem
				name={format("profile_info.sex")}
				switchOptions={["F", "M"]}
				switchValue={user.sex === Sex.Male ? "M" : "F"}
				onSwitchSelect={(value) => {
					const sex2 = value === "M" ? Sex.Male : Sex.Female;
					setNewSex(sex2);
					confirmSexBottomSheetRef.current?.present();
				}}
			/>
			{/*<InfoListItem name={format("profile_info.leaderboard")} />*/}
			<InfoListItem
				name={format("profile_info.advanced_info")}
				hasDisclosure={true}
				action={() => navigate(Routes.ProfileAdvancedInformation)}
			/>

			<CircularBottomSheet snapPoints={[480]} ref={heightBottomSheetRef}>
				<HeightBottomSheet onSaved={() => heightBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[480]} ref={weightBottomSheetRef}>
				<WeightBottomSheet onSaved={() => weightBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[480]} ref={confirmSexBottomSheetRef}>
				<ConfirmSexBottomSheet
					sex={newSex}
					onClose={() => {
						confirmSexBottomSheetRef.current?.close();
					}}
				/>
			</CircularBottomSheet>
		</ScrollScreen>
	);
};
