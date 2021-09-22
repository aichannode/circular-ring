import { cmToFt, HeightUnit, kgToLbs, WeightUnit } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { Sex } from "@domain/user/user";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import dayjs from "dayjs";
import React, { useState } from "react";

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
	const displayedHeight = (heightUnit === HeightUnit.ft ? cmToFt(height) : height).toFixed(0);

	const weight = user.weight || 0;
	const weightUnit = userSettings?.weightFormat || WeightUnit.kg;
	const displayedWeight = (weightUnit === WeightUnit.lbs ? kgToLbs(weight) : weight).toFixed(0);

	const [sex, setSex] = useState(user.sex === Sex.Male ? "M" : "F");

	return !user ? null : (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<InfoListHeader>{format("profile_info.basic_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_info.name")}
				hasDisclosure={true}
				value={`${user.firstName} ${user.lastName}`}
				action={() => navigate(Routes.ProfileEditName)}
			/>
			<InfoListItem name={format("profile_info.birthday")} hasDisclosure={true} value={displayedBirthday} />
			<InfoListItem
				name={format("profile_info.height")}
				hasDisclosure={true}
				value={`${displayedHeight} ${heightUnit}`}
			/>
			<InfoListItem
				name={format("profile_info.weight")}
				hasDisclosure={true}
				value={`${displayedWeight} ${weightUnit}`}
			/>
			<InfoListItem
				name={format("profile_info.sex")}
				switchOptions={["M", "F"]}
				switchValue={sex}
				onSwitchSelect={setSex}
			/>
			{/*<InfoListItem name={format("profile_info.leaderboard")} />*/}
			<InfoListItem name={format("profile_info.advanced_info")} hasDisclosure={true} />
		</ScrollScreen>
	);
};
