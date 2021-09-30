import { useServices } from "@core/services";
import { HeightUnit, WeightUnit } from "@domain/units";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { useUnmount } from "@ui/utils/lifecycleHooks";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components/native";
import { getVersion } from "react-native-device-info";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";

export const SettingsScreen: React.FC = () => {
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const [heightFormat, setHeightFormat] = useState(userSettings?.heightFormat);
	const [weightFormat, setWeightFormat] = useState(userSettings?.weightFormat);

	const appVersion = useMemo(() => getVersion(), []);

	const updateSettings = useCallback(() => {
		if (heightFormat === userSettings?.heightFormat && weightFormat === userSettings?.weightFormat) {
			return;
		}
		heightFormat && weightFormat && userService.updateUserSettings("DD/MM/YYYY", heightFormat, weightFormat);
	}, [heightFormat, weightFormat]);

	useUnmount(([updater]) => updater(), [updateSettings]);

	return (
		<Container>
			<InfoListHeader>{format("settings.general")}</InfoListHeader>
			{/* <InfoListItem name={format("settings.notifications.title")} /> */}
			{/* <InfoListItem name={format("settings.date_format")} />
			<InfoListItem name={format("settings.time_format")} /> */}
			<InfoListItem
				name={format("settings.height_format")}
				switchOptions={[HeightUnit.cm, HeightUnit.ft]}
				switchValue={heightFormat}
				onSwitchSelect={setHeightFormat}
			/>
			<InfoListItem
				name={format("settings.weight_format")}
				switchOptions={[WeightUnit.kg, WeightUnit.lbs]}
				switchValue={weightFormat}
				onSwitchSelect={setWeightFormat}
			/>
			{/* <InfoListItem name={format("settings.temperature_format")} /> */}
			{/* <InfoListItem name={format("settings.dark_mode")} /> */}
			{/* <InfoListHeader>{format("settings.security")}</InfoListHeader> */}
			{/* <InfoListItem name={format("settings.logged_in")} /> */}
			{/* <InfoListItem name={format("settings.2fa")} /> */}
			<InfoListHeader>{format("settings.other")}</InfoListHeader>
			{/* <InfoListItem name={format("settings.clear_history")} /> */}
			<InfoListItem
				name={format("settings.terms")}
				hasDisclosure
				action={() =>
					navigate(Routes.WebView, { uri: format("url.terms_and_conditions"), label: format("settings.terms") })
				}
			/>
			<InfoListItem
				name={format("settings.privacy")}
				hasDisclosure
				action={() => navigate(Routes.WebView, { uri: format("url.privacy"), label: format("settings.privacy") })}
			/>
			<InfoListItem name={format("settings.app_version")} value={appVersion} />
			<InfoListHeader>{format("settings.help")}</InfoListHeader>
			<InfoListItem
				name={format("settings.faq")}
				hasDisclosure
				action={() => navigate(Routes.WebView, { uri: format("url.faq"), label: format("settings.faq") })}
			/>
			{/* <InfoListItem name={format("settings.support")} />*/}
		</Container>
	);
};

const Container = styled(ScrollScreen)``;
