import { useServices } from "@core/services";
import { HeightUnit, HourFormat, TemperatureFormat, WeightUnit } from "@domain/units";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { useUnmount } from "@ui/utils/lifecycleHooks";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components/native";
import { DateFormatBottomSheet } from "./dateFormatBottomSheet";

export const SettingsScreen: React.FC = () => {
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const [heightFormat, setHeightFormat] = useState(userSettings?.heightFormat);
	const [weightFormat, setWeightFormat] = useState(userSettings?.weightFormat);
	const [temperatureFormat, setTemperatureFormat] = useState(userSettings?.temperatureFormat);
	const [hourFormat, setHourFormat] = useState(userSettings?.hourFormat);

	const updateSettings = useCallback(() => {
		heightFormat &&
			weightFormat &&
			userService.updateUserSettings({
				dateFormat: userSettings?.dateFormat,
				heightFormat,
				weightFormat,
				temperatureFormat,
				hourFormat,
			});
	}, [heightFormat, weightFormat, hourFormat, temperatureFormat, userSettings?.dateFormat]);

	const dateFormatBottomSheet = useRef<CircularBottomSheetHandle>(null);

	useUnmount(([updater]) => updater(), [updateSettings]);

	return (
		<Container>
			<InfoListHeader>{format("settings.general")}</InfoListHeader>
			{/* <InfoListItem name={format("settings.notifications.title")} /> */}
			<InfoListItem
				name={format("settings.notifications")}
				hasDisclosure
				action={() => navigate(Routes.Notifications)}
			/>
			<InfoListItem
				name={format("settings.date_format.title")}
				action={() => dateFormatBottomSheet.current?.present()}
				value={userSettings?.dateFormat}
				hasDisclosure
			/>
			<InfoListItem
				name={format("settings.time_format")}
				switchOptions={[HourFormat.TWELVE, HourFormat.TWENTY_FOUR]}
				switchValue={hourFormat}
				onSwitchSelect={setHourFormat}
			/>
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
			<InfoListItem
				name={format("settings.temperature_format")}
				switchOptions={[TemperatureFormat.CELSIUS, TemperatureFormat.FAHRENHEIT]}
				switchValue={temperatureFormat}
				onSwitchSelect={setTemperatureFormat}
			/>
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
			<InfoListItem name={format("settings.app_version")} value={"alpha1.0"} />
			<InfoListHeader>{format("settings.help")}</InfoListHeader>
			<InfoListItem
				name={format("settings.faq")}
				hasDisclosure
				action={() => navigate(Routes.WebView, { uri: format("url.faq"), label: format("settings.faq") })}
			/>
			{/* <InfoListItem name={format("settings.support")} />*/}
			<CircularBottomSheet ref={dateFormatBottomSheet} snapPoints={[480]}>
				<DateFormatBottomSheet onSaved={() => dateFormatBottomSheet.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled(ScrollScreen)``;
