import { useServices } from "@core/services";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { useObservable } from "micro-observables";
import React from "react";
import styled from "styled-components/native";

export const NotificationsScreen: React.FC = () => {
	const { format } = useI18n();
	const { navigate } = useRoutesNavigation();
	const options = [format("global.onShift"), format("global.offShift")];
	const { userService } = useServices();
	const notificationsSettings = useObservable(userService.userNotificationsSettings);

	return (
		<Container>
			<InfoListHeader>{format("notifications.appNotifications")}</InfoListHeader>
			<InfoListItem
				name={format("notifications.kira")}
				switchOptions={options}
				switchValue={notificationsSettings.kira}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ kira: val })}
				lightTheme
				forceRightOption
			/>
			<InfoListItem
				name={format("notifications.banner")}
				switchOptions={options}
				switchValue={notificationsSettings.banner}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ banner: val })}
				disabled
				lightTheme
			/>
			<InfoListItem
				name={format("notifications.update")}
				switchOptions={options}
				switchValue={notificationsSettings.update}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ update: val })}
				lightTheme
				forceRightOption
			/>
			<InfoListItem
				name={format("notifications.perdiodTiming")}
				switchOptions={options}
				switchValue={notificationsSettings.period}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ period: val })}
				lightTheme
				forceRightOption
			/>
			<InfoListItem
				name={format("notifications.PMSTiming")}
				switchOptions={options}
				switchValue={notificationsSettings.PMS}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ PMS: val })}
				lightTheme
				forceRightOption
			/>
			<InfoListItem
				name={format("notifications.fertility")}
				switchOptions={options}
				switchValue={notificationsSettings.fertility}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ fertility: val })}
				disabled
				lightTheme
			/>
			<InfoListItem
				name={format("notifications.hightHeartRate")}
				lightTheme
				hasDisclosure
				action={() => navigate(Routes.HighHR)}
			/>
			<InfoListItem
				name={format("notifications.lowHeartRate")}
				lightTheme
				hasDisclosure
				action={() => navigate(Routes.LowHr)}
			/>
			<InfoListItem
				name={format("notifications.lowBloodOxygenation")}
				disabled={true}
				lightTheme={false}
				hasDisclosure
				action={() => navigate(Routes.LowSpo2)}
			/>
		</Container>
	);
};

const Container = styled(ScrollScreen)``;
