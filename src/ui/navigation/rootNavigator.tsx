import { useAccountLinked } from "@domain/device/hooks";
import { useUser, useAuthenticatedUserEmail } from "@domain/user/hooks/useUser";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { DrawerContent } from "@ui/navigation/drawer/drawerContent";
import { Routes } from "@ui/navigation/routes";
import { CircleActivityScreen } from "@ui/screens/circleActivity/circleActivityScreen";
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
import { ProfileEditNameScreen } from "@ui/screens/profile/profileEditNameScreen";
import { ProfileInformationScreen } from "@ui/screens/profile/profileInformationScreen";
import { ProfileScreen } from "@ui/screens/profile/profileScreen";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { TermsAndConditionsScreen } from "@ui/screens/signup/termsAndConditionsScreen";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable } from "react-native";

const SetupStack = createNativeStackNavigator();

const OnboardingStack = createNativeStackNavigator();

const HomeDrawer = createDrawerNavigator();
const MainStack = createNativeStackNavigator();

const headerTitleStyle = {
	fontSize: 18,
	fontWeight: "500",
	color: colors.textPrimary,
} as const;

export const RootNavigator: React.FC = () => {
	const { format } = useI18n();
	const navigation = useNavigation();

	const isAuthenticated = !!useAuthenticatedUserEmail();

	const accountLinkedToDevice = useAccountLinked();
	const hasUser = !!useUser();

	const isOnboardingDone = isAuthenticated && accountLinkedToDevice && hasUser;

	const MainHomeNavigator = () => (
		<MainStack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: colors.lightgray },
				headerRight: () => <MyRingBattery />,
				headerTitleAlign: "center",
				headerTitleStyle: headerTitleStyle,
				headerBackTitleVisible: false,
				headerBackImageSource: require("@assets/images/menuBackArrow.png"),
				headerTintColor: colors.textPrimary,
			}}
		>
			<MainStack.Screen
				name={Routes.Home}
				component={HomeScreen}
				options={{
					headerTitle: () => <Image source={require("@assets/images/logoHeader.png")} />,
					headerLeft: () => (
						<Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer)}>
							<Image source={require("@assets/images/menu.png")} style={{ marginLeft: 10 }} />
						</Pressable>
					),
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
				options={{ title: format("header.activity"), headerRight: undefined }}
			/>
			<MainStack.Screen
				name={Routes.Live}
				component={CircleLiveScreen}
				options={{ title: format("header.live"), headerRight: undefined }}
			/>
			<MainStack.Screen
				name={Routes.Profile}
				component={ProfileScreen}
				options={{
					title: format("header.profile"),
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileInformation}
				component={ProfileInformationScreen}
				options={{
					title: format("header.profile_information"),
				}}
			/>
			<MainStack.Screen
				name={Routes.ProfileEditName}
				component={ProfileEditNameScreen}
				options={{
					headerShown: false,
					gestureEnabled: false,
				}}
			/>
		</MainStack.Navigator>
	);

	return isOnboardingDone ? (
		<HomeDrawer.Navigator
			screenOptions={{ headerShown: false, drawerStyle: { width: "100%" } }}
			drawerContent={() => <DrawerContent />}
		>
			<HomeDrawer.Screen name={Routes.MainHome} component={MainHomeNavigator} />
		</HomeDrawer.Navigator>
	) : isAuthenticated ? (
		accountLinkedToDevice ? (
			<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
				<OnboardingStack.Screen name={Routes.OnboardingWearInfo} component={OnboardingWearInfoScreen} />
				<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo1} component={OnboardingPersonalInfo1Screen} />
				<OnboardingStack.Screen name={Routes.OnboardingPersonalInfo2} component={OnboardingPersonalInfo2Screen} />
			</OnboardingStack.Navigator>
		) : (
			<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
				<OnboardingStack.Screen name={Routes.RingSetupStart} component={RingSetupStartScreen} />
				<OnboardingStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
			</OnboardingStack.Navigator>
		)
	) : (
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
};
