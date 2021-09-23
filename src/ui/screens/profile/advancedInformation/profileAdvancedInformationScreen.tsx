import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import React from "react";

export const ProfileAdvancedInformationScreen = () => {
	const { format } = useI18n();

	return (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<InfoListHeader>{format("profile_advanced_info.about_you")}</InfoListHeader>
			<InfoListHeader>{format("profile_advanced_info.lifestyle_info")}</InfoListHeader>
			<InfoListItem
				name={format("profile_advanced_info.work_time.title")}
				hasDisclosure={true}
				// value={`${user.firstName} ${user.lastName}`}
				// action={() => navigate(Routes.ProfileEditName)}
			/>
		</ScrollScreen>
	);
};
