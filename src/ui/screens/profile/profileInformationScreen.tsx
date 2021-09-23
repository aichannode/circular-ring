import { cmToFt, HeightUnit, kgToLbs, WeightUnit } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { Sex } from "@domain/user/user";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ConfirmSexBottomSheet } from "@ui/screens/profile/confirmSexBottomSheet";
import { HeightBottomSheet } from "@ui/screens/profile/heightBottomSheet";
import { WeightBottomSheet } from "@ui/screens/profile/weightBottomSheet";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

export const ProfileInformationScreen = () => {
	const user = useUser();
	if (!user) {
		return null;
	}

	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const userSettings = useUserSettings();

	const displayedBirthday = dayjs(user?.bornDate || new Date()).format("DD/MM/YYYY");

	const height = user.height || 0;
	const heightUnit = userSettings?.heightFormat || HeightUnit.cm;
	const displayedHeight = (heightUnit === HeightUnit.ft ? Math.round(cmToFt(height)) : height).toFixed(0);

	const weight = user.weight || 0;
	const weightUnit = userSettings?.weightFormat || WeightUnit.kg;
	const displayedWeight = (weightUnit === WeightUnit.lbs ? Math.round(kgToLbs(weight)) : weight).toFixed(0);

	const [newSex, setNewSex] = useState(user.sex);

	const heightBottomSheetRef = useRef<BottomSheetModal>(null);
	const weightBottomSheetRef = useRef<BottomSheetModal>(null);
	const confirmSexBottomSheetRef = useRef<BottomSheetModal>(null);

	return !user ? null : (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<InfoListHeader>{format("profile_info.basic_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_info.name")}
				hasDisclosure={true}
				value={`${user.firstName} ${user.lastName}`}
				action={() => navigate(Routes.ProfileEditName)}
			/>
			<InfoListItem
				name={format("profile_info.birthday")}
				hasDisclosure={true}
				value={displayedBirthday}
				action={() => navigate(Routes.ProfileEditBirthday)}
			/>
			<InfoListItem
				name={format("profile_info.height")}
				hasDisclosure={true}
				value={`${displayedHeight} ${heightUnit}`}
				action={() => heightBottomSheetRef.current?.present()}
			/>
			<InfoListItem
				name={format("profile_info.weight")}
				hasDisclosure={true}
				value={`${displayedWeight} ${weightUnit}`}
				action={() => weightBottomSheetRef.current?.present()}
			/>
			<InfoListItem
				name={format("profile_info.sex")}
				switchOptions={["F", "M"]}
				switchValue={user.sex === Sex.Male ? "M" : "F"}
				onSwitchSelect={(value) => {
					const sex2 = value === "M" ? Sex.Male : Sex.Female;
					console.log("> setting new Sex : " + sex2);
					setNewSex(sex2);
					confirmSexBottomSheetRef.current?.present();
				}}
			/>
			{/*<InfoListItem name={format("profile_info.leaderboard")} />*/}
			{/*<InfoListItem name={format("profile_info.advanced_info")} hasDisclosure={true} />*/}
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
