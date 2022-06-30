import { useServices } from "@core/services";
import { DateFormat, HeightUnit, HourFormat, TemperatureFormat, WeightUnit } from "@domain/units";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { version } from "../../../../package.json";
import { DateFormatBottomSheet } from "./dateFormatBottomSheet";

export const SettingsScreen: React.FC = () => {
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const { userService } = useServices();
	const { navigate } = useRoutesNavigation();

	const [dateFormat, setDateFormat] = useState(userSettings?.dateFormat ?? DateFormat.USCS);
	const [heightFormat, setHeightFormat] = useState(userSettings?.heightFormat);
	const [weightFormat, setWeightFormat] = useState(userSettings?.weightFormat);
	const [temperatureFormat, setTemperatureFormat] = useState(userSettings?.temperatureFormat);
	const [hourFormat, setHourFormat] = useState(userSettings?.hourFormat);

	const dateFormatBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const onSwitchSelectDateFormat = async (option: DateFormat) => {
		if (option !== userSettings?.dateFormat) {
			await userService.updateUserSettings({
				heightFormat,
				weightFormat,
				temperatureFormat,
				hourFormat,
				dateFormat: option,
			});
			setDateFormat(option);
		}
		dateFormatBottomSheet.current?.close();
	};

	const onSwitchSelectHourFormat = async (option: HourFormat) => {
		if (option !== userSettings?.hourFormat) {
			await userService.updateUserSettings({
				dateFormat,
				heightFormat,
				weightFormat,
				temperatureFormat,
				hourFormat: option,
			});
			setHourFormat(option);
		}
	};

	const onSwitchSelectHeightFormat = async (option: HeightUnit) => {
		if (option !== userSettings?.heightFormat) {
			await userService.updateUserSettings({
				dateFormat,
				weightFormat,
				temperatureFormat,
				hourFormat,
				heightFormat: option,
			});
			setHeightFormat(option);
		}
	};

	const onSwitchSelectWeightFormat = async (option: WeightUnit) => {
		if (option !== userSettings?.weightFormat) {
			await userService.updateUserSettings({
				dateFormat,
				heightFormat,
				temperatureFormat,
				hourFormat,
				weightFormat: option,
			});
			setWeightFormat(option);
		}
	};

	const onSwitchSelectTemperatureFormat = async (option: TemperatureFormat) => {
		if (option !== userSettings?.temperatureFormat) {
			await userService.updateUserSettings({
				dateFormat,
				heightFormat,
				weightFormat,
				hourFormat,
				temperatureFormat: option,
			});
			setTemperatureFormat(option);
		}
	};

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
				onSwitchSelect={onSwitchSelectHourFormat}
			/>
			<InfoListItem
				name={format("settings.height_format")}
				switchOptions={[HeightUnit.cm, HeightUnit.ft]}
				switchValue={heightFormat}
				onSwitchSelect={onSwitchSelectHeightFormat}
			/>
			<InfoListItem
				name={format("settings.weight_format")}
				switchOptions={[WeightUnit.kg, WeightUnit.lbs]}
				switchValue={weightFormat}
				onSwitchSelect={onSwitchSelectWeightFormat}
			/>
			<InfoListItem
				name={format("settings.temperature_format")}
				switchOptions={[TemperatureFormat.CELSIUS, TemperatureFormat.FAHRENHEIT]}
				switchValue={temperatureFormat}
				onSwitchSelect={onSwitchSelectTemperatureFormat}
			/>
			{/* <InfoListItem name={format("settings.dark_mode")} /> */}
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
			<InfoListItem name={format("settings.app_version")} value={version} />
			<InfoListHeader>{format("settings.support")}</InfoListHeader>
			<InfoListItem
				name={format("settings.help")}
				hasDisclosure
				action={() => navigate(Routes.WebView, { uri: format("url.help"), label: format("settings.help") })}
			/>
			{/* <InfoListItem name={format("settings.support")} />*/}
			<CircularBottomSheet ref={dateFormatBottomSheet} snapPoints={[480]}>
				<DateFormatBottomSheet {...{ dateFormat, setDateFormat, onSaved: onSwitchSelectDateFormat }} />
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled(ScrollScreen)``;
