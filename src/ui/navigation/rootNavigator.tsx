import { useAuth } from "@domain/auth/hooks/useAuth";
import { useAccountLinked } from "@domain/device/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginOrSignUpScreen } from "@ui/screens/loginOrRegister/loginOrSignUpScreen";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { Routes } from "@ui/navigation/routes";
import { useI18n } from "@ui/i18n";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { SignUpSuccessScreen } from "@ui/screens/signup/signUpSuccessScreen";
import React from "react";
import { Image } from "react-native";

const SetupStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const accountLinked = useAccountLinked();
	const { format } = useI18n();
	const isAuthenticated = useAuth();

	return isAuthenticated ? (
		accountLinked ? (
			<MainStack.Navigator screenOptions={{ headerRight: () => <MyRingBattery />, headerTitleAlign: "center" }}>
				<MainStack.Screen
					name={Routes.Home}
					component={HomeScreen}
					options={{ headerTitle: () => <Image source={require("@assets/images/logoHeader.png")} /> }}
				/>
				<MainStack.Screen
					name={Routes.MyRing}
					component={MyRingScreen}
					options={{ title: format("header.my_ring"), headerRight: undefined }}
				/>
			</MainStack.Navigator>
		) : (
			<SetupStack.Navigator screenOptions={{ headerShown: false }}>
				<SetupStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
			</SetupStack.Navigator>
		)
	) : (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name={Routes.LoginOrSignUp} component={LoginOrSignUpScreen} />
			<SetupStack.Screen name={Routes.Login} component={LoginScreen} />
			<SetupStack.Screen name={Routes.SignUpEmail} component={SignUpEmailScreen} />
			<SetupStack.Screen name={Routes.SignUpConfirmationCode} component={SignUpConfirmationCodeScreen} />
			<SetupStack.Screen name={Routes.SignUpSuccess} component={SignUpSuccessScreen} />
		</SetupStack.Navigator>
	);
};
