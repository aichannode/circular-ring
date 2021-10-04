import { Header } from "@ui/navigation/header/header";
import { CircleSleepScreen } from "@ui/screens/circleSleep/circleSleepScreen";
import { useAccountLinked, useDeviceStored } from "@domain/device/hooks";
import { useAuthenticatedUserEmail, useUser } from "@domain/user/hooks/useUser";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
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
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { TermsAndConditionsScreen } from "@ui/screens/signup/termsAndConditionsScreen";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

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
		</MainStack.Navigator>
	);
};

const CircleIcon = styled.Image`
	width: 54px;
	height: 54px;
`;

export const RootNavigator: React.FC = () => {
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
				<SetupStack.Screen name={Routes.TermsAndConditions} component={TermsAndConditionsScreen} />
			</SetupStack.Navigator>
		);
	}
	if (!deviceStored || !accountLinkedToDevice) {
		return (
			<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
				<OnboardingStack.Screen name={Routes.RingSetupStart} component={RingSetupStartScreen} />
				<OnboardingStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
			</OnboardingStack.Navigator>
		);
	}

	return isOnboardingDone ? (
		<HomeDrawer.Navigator
			screenOptions={{ headerShown: false, drawerStyle: { width: "100%" } }}
			drawerContent={() => <DrawerContent />}
		>
			<HomeDrawer.Screen name={Routes.MainHome} component={MainHomeNavigator} />
		</HomeDrawer.Navigator>
	) : (
		<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
			<OnboardingStack.Screen name={Routes.OnboardingWearInfo} component={OnboardingWearInfoScreen} />
			<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo1} component={OnboardingPersonalInfo1Screen} />
			<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo2} component={OnboardingPersonalInfo2Screen} />
		</OnboardingStack.Navigator>
	);
};
