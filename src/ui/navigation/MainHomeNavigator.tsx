import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StorybookScreen from "@stories";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { Header } from "@ui/navigation/header/header";
import { Routes } from "@ui/navigation/routes";
import { AllTagsScreen } from "@ui/screens/calendar/allTagsScreen";
import { CalendarEditNotesScreen } from "@ui/screens/calendar/calendarEditNotesScreen";
import { CalendarScreen } from "@ui/screens/calendar/calendarScreen";
import { CircleActivityScreen } from "@ui/screens/circleActivity/circleActivityScreen";
import { CircleAddScreen } from "@ui/screens/circleAdd/circleAddScreen";
import { CircleAlarmScreen } from "@ui/screens/circleAlarm/circleAlarmScreen";
import { EditAlarmScreen } from "@ui/screens/circleAlarm/editAlarmScreen";
import { CircleLiveScreen } from "@ui/screens/circleLive/circleLiveScreen";
import { CircleSleepScreen } from "@ui/screens/circleSleep/circleSleepScreen";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { LeaderboardScreen } from "@ui/screens/leaderboard/leaderboardScreen";
import { RingFirmwareUpdate } from "@ui/screens/myRing/firmwareUpdate/ringFirmwareUpdate";
import { ManageMyRingsScreen } from "@ui/screens/myRing/manageMyRingsScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { NewRingSetupScreen } from "@ui/screens/myRing/newRingSetupScreen";
import { HighHrScreen } from "@ui/screens/notifications/highHrScreen";
import { LowHrScreen } from "@ui/screens/notifications/lowHrScreen";
import { LowSpo2Screen } from "@ui/screens/notifications/lowSpo2Screen";
import { NotificationsScreen } from "@ui/screens/notifications/notificationsScreen";
import { SetUpCompleted } from "@ui/screens/onboarding/ringSetup/setUpCompleted";
import { BirthControlEditionScreen } from "@ui/screens/profile/advancedInformation/birthControlEditionScreen";
import { ProfileAdvancedInformationScreen } from "@ui/screens/profile/advancedInformation/profileAdvancedInformationScreen";
import { ProfileEditBirthdayScreen } from "@ui/screens/profile/basicInformation/profileEditBirthdayScreen";
import { ProfileEditNameScreen } from "@ui/screens/profile/basicInformation/profileEditNameScreen";
import { ProfileInformationScreen } from "@ui/screens/profile/basicInformation/profileInformationScreen";
import { ChangePasswordScreen } from "@ui/screens/profile/changePasswordScreen";
import { ProfileScreen } from "@ui/screens/profile/profileScreen";
import { QuickAccess } from "@ui/screens/quickaccess/quickAccess";
import { SettingsScreen } from "@ui/screens/settings/settingsScreen";
import { WebViewScreen } from "@ui/screens/webViewScreen";
import React from "react";
import styled from "styled-components/native";

const MainStack = createNativeStackNavigator();

const CircleIcon = styled.Image`
	width: 54px;
	height: 54px;
`;

export const MainHomeNavigator = () => {
	const { format } = useI18n();

	return (
		<MainStack.Navigator
			screenOptions={{
				header: (props) => <Header {...props} />,
			}}
		>
			<MainStack.Screen
				name={Routes.Home}
				component={HomeScreen}
				options={{
					headerRight: () => <MyRingBattery full />,
				}}
			/>
			<MainStack.Screen
				name={Routes.MyRing}
				component={MyRingScreen}
				options={{ title: format("header.my_ring"), headerRight: undefined }}
			/>
			<MainStack.Screen
				name={Routes.RingFirmwareUpdate}
				component={RingFirmwareUpdate}
				options={{ title: format("header.ringUpdateFirmware"), headerRight: undefined }}
			/>

			<MainStack.Screen
				name={Routes.ManageMyRings}
				component={ManageMyRingsScreen}
				options={{ title: format("header.manage_my_rings"), headerRight: () => <MyRingBattery stalled /> }}
			/>
			<MainStack.Screen
				name={Routes.Activity}
				component={CircleActivityScreen}
				options={{
					title: format("header.activity"),
					headerRight: undefined,
					headerLeft: () => <CircleIcon source={require("@assets/images/circleActivity.png")} />,
				}}
			/>
			<MainStack.Screen
				name={Routes.Live}
				component={CircleLiveScreen}
				options={{
					title: format("header.live"),
					headerRight: undefined,
					headerLeft: () => <CircleIcon source={require("@assets/images/circleLive.png")} />,
				}}
			/>
			<MainStack.Screen
				name={Routes.CircleAdd}
				component={CircleAddScreen}
				options={{
					title: format("header.circle_add"),
					headerRight: undefined,
				}}
			/>
			<MainStack.Screen
				name={Routes.Alarm}
				component={CircleAlarmScreen}
				options={{
					title: format("header.alarm"),
					headerRight: undefined,
					headerLeft: () => <CircleIcon source={require("@assets/images/circleAlarm.png")} />,
				}}
			/>
			<MainStack.Screen
				name={Routes.Sleep}
				component={CircleSleepScreen}
				options={{
					title: format("header.sleep"),
					headerRight: undefined,
					headerLeft: () => <CircleIcon source={require("@assets/images/circleSleep.png")} />,
				}}
			/>
			<MainStack.Screen
				name={Routes.EditAlarm}
				component={EditAlarmScreen}
				options={{
					title: format("header.alarm"),
					headerRight: undefined,
					headerLeft: () => <CircleIcon source={require("@assets/images/circleAlarm.png")} />,
				}}
			/>

			<MainStack.Screen
				name={Routes.Profile}
				component={ProfileScreen}
				options={{
					title: format("header.profile"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileInformation}
				component={ProfileInformationScreen}
				options={{
					title: format("header.profile_information"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileEditName}
				component={ProfileEditNameScreen}
				options={{ headerShown: false }}
			/>
			<MainStack.Screen
				name={Routes.ProfileEditBirthday}
				component={ProfileEditBirthdayScreen}
				options={{ headerShown: false }}
			/>
			<MainStack.Screen
				name={Routes.ChangePassword}
				component={ChangePasswordScreen}
				options={{
					title: format("change_password.title"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileAdvancedInformation}
				component={ProfileAdvancedInformationScreen}
				options={{
					title: format("header.profile_advanced_information"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileBirthControl}
				component={BirthControlEditionScreen}
				options={{
					title: format("header.birth_control"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.Settings}
				component={SettingsScreen}
				options={{
					title: format("header.settings"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.Calendar}
				component={CalendarScreen}
				options={{
					title: format("header.calendar"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.CalendarEditNotes}
				component={CalendarEditNotesScreen}
				options={{
					title: format("header.calendar"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.AllTags}
				component={AllTagsScreen}
				options={{
					title: format("header.all_tags"),
					headerBackImageSource: require("@assets/images/crossBig.png"),
				}}
			/>

			<MainStack.Screen
				name={Routes.QuickAccess}
				component={QuickAccess}
				options={{
					title: format("header.quickaccess"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.NewRingSetupScreen}
				component={NewRingSetupScreen}
				options={{ headerShown: false }}
			/>

			<MainStack.Screen
				name={Routes.Leaderboard}
				component={LeaderboardScreen}
				options={{
					title: format("header.leaderboard"),
					headerRight: () => <MyRingBattery />,
				}}
			/>

			<MainStack.Screen name={Routes.SetUpCompleted} component={SetUpCompleted} options={{ headerShown: false }} />

			<MainStack.Screen name={Routes.WebView} component={WebViewScreen} />

			<MainStack.Screen
				name={Routes.Notifications}
				component={NotificationsScreen}
				options={{
					title: format("header.notifications"),
					headerRight: () => <MyRingBattery />,
				}}
			/>

			<MainStack.Screen
				name={Routes.HighHR}
				component={HighHrScreen}
				options={{
					title: format("header.highHr"),
					headerRight: () => <MyRingBattery />,
				}}
			/>

			<MainStack.Screen
				name={Routes.LowHr}
				component={LowHrScreen}
				options={{
					title: format("header.lowHr"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.LowSpo2}
				component={LowSpo2Screen}
				options={{
					title: format("header.lowSPO2"),
					headerRight: () => <MyRingBattery />,
				}}
			/>
			<MainStack.Screen
				name={Routes.Storybook}
				component={StorybookScreen}
				options={{
					title: format("header.storybook"),
				}}
			/>
		</MainStack.Navigator>
	);
};
