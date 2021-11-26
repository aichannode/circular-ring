import { AllTagsScreen } from "@ui/screens/calendar/allTagsScreen";
import { CalendarEditNotesScreen } from "@ui/screens/calendar/calendarEditNotesScreen";
import { Header } from "@ui/navigation/header/header";
import { CircleSleepScreen } from "@ui/screens/circleSleep/circleSleepScreen";
import { useAccountLinked, useDeviceStored } from "@domain/device/hooks";
import { useAuthenticatedUserEmail, useUser } from "@domain/user/hooks/useUser";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { DrawerContent } from "@ui/navigation/drawer/drawerContent";
import { Routes } from "@ui/navigation/routes";
import { CircleActivityScreen } from "@ui/screens/circleActivity/circleActivityScreen";
import { CircleAlarmScreen } from "@ui/screens/circleAlarm/circleAlarmScreen";
import { EditAlarmScreen } from "@ui/screens/circleAlarm/editAlarmScreen";
import { CircleLiveScreen } from "@ui/screens/circleLive/circleLiveScreen";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { ForgotPasswordScreen } from "@ui/screens/login/forgotPasswordScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { ResetTokenScreen } from "@ui/screens/login/resetTokenScreen";
import { LoginOrSignUpScreen } from "@ui/screens/loginOrRegister/loginOrSignUpScreen";
import { ManageMyRingsScreen } from "@ui/screens/myRing/manageMyRingsScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { OnboardingPersonalInfo1Screen } from "@ui/screens/onboarding/personalInfo/onboardingPersonalInfo1Screen";
import { OnboardingPersonalInfo2Screen } from "@ui/screens/onboarding/personalInfo/onboardingPersonalInfo2Screen";
import { OnboardingWearInfoScreen } from "@ui/screens/onboarding/personalInfo/onboardingWearInfoScreen";
import { RingSetupScreen } from "@ui/screens/onboarding/ringSetup/ringSetupScreen";
import { RingSetupStartScreen } from "@ui/screens/onboarding/ringSetup/ringSetupStartScreen";
import { BirthControlEditionScreen } from "@ui/screens/profile/advancedInformation/birthControlEditionScreen";
import { ProfileAdvancedInformationScreen } from "@ui/screens/profile/advancedInformation/profileAdvancedInformationScreen";
import { ProfileEditBirthdayScreen } from "@ui/screens/profile/basicInformation/profileEditBirthdayScreen";
import { ProfileEditNameScreen } from "@ui/screens/profile/basicInformation/profileEditNameScreen";
import { ProfileInformationScreen } from "@ui/screens/profile/basicInformation/profileInformationScreen";
import { ProfileScreen } from "@ui/screens/profile/profileScreen";
import { SettingsScreen } from "@ui/screens/settings/settingsScreen";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import styled from "styled-components/native";
import { WebViewScreen } from "@ui/screens/webViewScreen";
import React, { useState } from "react";
import { CalendarScreen } from "@ui/screens/calendar/calendarScreen";
import { Tutorial } from "@ui/screens/onboarding/tutorial/tutorial";
import { QuickAccess } from "@ui/screens/quickaccess/quickAccess";
import { RingFirmwareUpdate } from "@ui/screens/myRing/ringFirmwareUpdate";

const SetupStack = createNativeStackNavigator();

const OnboardingStack = createNativeStackNavigator();

const HomeDrawer = createDrawerNavigator();
const MainStack = createNativeStackNavigator();

const MainHomeNavigator = () => {
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

			<MainStack.Screen name={Routes.WebView} component={WebViewScreen} />
		</MainStack.Navigator>
	);
};

const CircleIcon = styled.Image`
	width: 54px;
	height: 54px;
`;

export const RootNavigator: React.FC = () => {
	const [wait, setWait] = useState(false);
	const isAuthenticated = !!useAuthenticatedUserEmail();

	const accountLinkedToDevice = useAccountLinked();
	const hasUser = !!useUser();
	const deviceStored = useDeviceStored();

	const isOnboardingDone = isAuthenticated && accountLinkedToDevice && hasUser;

	if (!isAuthenticated) {
		return (
			<SetupStack.Navigator screenOptions={{ headerShown: false }}>
				<SetupStack.Screen name={Routes.LoginOrSignUp} component={LoginOrSignUpScreen} />
				<SetupStack.Screen name={Routes.Login} component={LoginScreen} />
				<SetupStack.Screen name={Routes.ForgotPassword} component={ForgotPasswordScreen} />
				<SetupStack.Screen name={Routes.ResetToken} component={ResetTokenScreen} />
				<SetupStack.Screen name={Routes.SignUpEmail} component={SignUpEmailScreen} />
				<SetupStack.Screen name={Routes.SignUpConfirmationCode} component={SignUpConfirmationCodeScreen} />
				<SetupStack.Screen name={Routes.WebView} component={WebViewScreen} />
			</SetupStack.Navigator>
		);
	}

	if (wait || !deviceStored || !accountLinkedToDevice) {
		return (
			<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
				{!hasUser && <OnboardingStack.Screen name={Routes.RingSetupStart} component={RingSetupStartScreen} />}
				<OnboardingStack.Screen name={Routes.Pairing} initialParams={{ setWait }} component={RingSetupScreen} />
			</OnboardingStack.Navigator>
		);
	}

	const isTutorialDone = false;

	console.log("!isTutorialDone && isOnboardingDone", !isTutorialDone && isOnboardingDone);

	return isOnboardingDone ? (
		<HomeDrawer.Navigator
			screenOptions={{ headerShown: false, drawerStyle: { width: "100%" } }}
			drawerContent={() => <DrawerContent />}
		>
			<HomeDrawer.Screen name={Routes.MainHome} component={MainHomeNavigator} options={{ swipeEnabled: false }} />
		</HomeDrawer.Navigator>
	) : (
		<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
			<OnboardingStack.Screen name={Routes.OnboardingWearInfo} component={OnboardingWearInfoScreen} />
			<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo1} component={OnboardingPersonalInfo1Screen} />
			<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo2} component={OnboardingPersonalInfo2Screen} />
			<OnboardingStack.Screen name={Routes.OnboardingTutorial} component={Tutorial} />
		</OnboardingStack.Navigator>
	);
};
