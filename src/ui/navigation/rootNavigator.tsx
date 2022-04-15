import { useServices } from "@core/services";
import { UpdateState } from "@domain/device/bleDeviceService";
import { useDeviceStored } from "@domain/device/hooks";
import { UserRing } from "@domain/ring/ring";
import { useAuthenticatedUserEmail, useUser } from "@domain/user/hooks/useUser";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerContent } from "@ui/navigation/drawer/drawerContent";
import { MainHomeNavigator } from "@ui/navigation/MainHomeNavigator";
import { Routes } from "@ui/navigation/routes";
import { ForgotPasswordScreen } from "@ui/screens/login/forgotPasswordScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { ResetTokenScreen } from "@ui/screens/login/resetTokenScreen";
import { LoginOrSignUpScreen } from "@ui/screens/loginOrRegister/loginOrSignUpScreen";
import { RingFirmwareUpdate } from "@ui/screens/myRing/firmwareUpdate/ringFirmwareUpdate";
import { OnboardingPersonalInfo1Screen } from "@ui/screens/onboarding/personalInfo/onboardingPersonalInfo1Screen";
import { OnboardingPersonalInfo2Screen } from "@ui/screens/onboarding/personalInfo/onboardingPersonalInfo2Screen";
import { OnboardingWearInfoScreen } from "@ui/screens/onboarding/personalInfo/onboardingWearInfoScreen";
import { RingSetupScreen } from "@ui/screens/onboarding/ringSetup/ringSetupScreen";
import { RingSetupStartScreen } from "@ui/screens/onboarding/ringSetup/ringSetupStartScreen";
import { SetUpCompleted } from "@ui/screens/onboarding/ringSetup/setUpCompleted";
import { Tutorial } from "@ui/screens/onboarding/tutorial/tutorial";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { WebViewScreen } from "@ui/screens/webViewScreen";
import { useObservable } from "micro-observables";
import React, { useState } from "react";

const SetupStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const HomeDrawer = createDrawerNavigator();

export const RootNavigator: React.FC = () => {
	const [wait, setWait] = useState(false);
	const isAuthenticated = !!useAuthenticatedUserEmail();
	const { appStateService, ringApi, bleDeviceService } = useServices();
	const hasUser = !!useUser();
	const deviceStored = useDeviceStored(); // useObservable(useServices().bleDeviceService.favoriteDevice);
	const userRings = useObservable(appStateService.userRings);
	const currentRing: UserRing = userRings.filter((ring) => ring.connected)[0];
	const lastFirmwareVersion = useObservable(ringApi.firmwareVersion);
	const [useByPass, setByPass] = useState(false);
	const updateState = useObservable(bleDeviceService.updateState);

	const isOnboardingDone = isAuthenticated && hasUser;
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

	if (!useByPass && (wait || !deviceStored)) {
		return (
			<OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
				{!hasUser && <OnboardingStack.Screen name={Routes.RingSetupStart} component={RingSetupStartScreen} />}
				<OnboardingStack.Screen
					name={Routes.Pairing}
					initialParams={{ setWait, onByPass: () => setByPass(true) }}
					component={RingSetupScreen}
				/>
				<OnboardingStack.Screen name={Routes.SetUpCompleted} initialParams={{ setWait }} component={SetUpCompleted} />
			</OnboardingStack.Navigator>
		);
	}
	if (updateState.status !== UpdateState.IDLE.status || (currentRing && lastFirmwareVersion !== currentRing.firmware)) {
		return <RingFirmwareUpdate></RingFirmwareUpdate>;
	}

	return isOnboardingDone || useByPass ? (
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
