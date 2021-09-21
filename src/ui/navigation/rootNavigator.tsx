import { useAuth } from "@domain/auth/hooks/useAuth";
import { useAccountLinked } from "@domain/device/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginOrSignUpScreen } from "@ui/screens/loginOrRegister/loginOrSignUpScreen";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { Routes } from "@ui/navigation/routes";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { ForgotPasswordScreen } from "@ui/screens/login/forgotPasswordScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { ResetTokenScreen } from "@ui/screens/login/resetTokenScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { RingSetupStartScreen } from "@ui/screens/ringSetup/ringSetupStartScreen";
import React from "react";
import { Image } from "react-native";
import { CircleActivityScreen } from "@ui/screens/circleActivity/circleActivityScreen";
import { CircleAlarmScreen } from "@ui/screens/circleAlarm/circleAlarmScreen";
import { NewAlarmScreen } from "@ui/screens/circleAlarm/newAlarmScreen";

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
				<MainStack.Screen
					name={Routes.Activity}
					component={CircleActivityScreen}
					options={{ title: format("header.activity"), headerRight: undefined }}
				/>
				<MainStack.Screen
					name={Routes.Alarm}
					component={CircleAlarmScreen}
					options={{ title: format("header.alarm"), headerRight: undefined }}
				/>
				<MainStack.Screen
					name={Routes.NewAlarm}
					component={NewAlarmScreen}
					options={{ title: format("header.alarm"), headerRight: undefined }}
				/>
			</MainStack.Navigator>
		) : (
			<SetupStack.Navigator screenOptions={{ headerShown: false }}>
				<SetupStack.Screen name={Routes.RingSetupStart} component={RingSetupStartScreen} />
				<SetupStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
			</SetupStack.Navigator>
		)
	) : (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name={Routes.LoginOrSignUp} component={LoginOrSignUpScreen} />
			<SetupStack.Screen name={Routes.Login} component={LoginScreen} />
			<SetupStack.Screen name={Routes.ForgotPassword} component={ForgotPasswordScreen} />
			<SetupStack.Screen name={Routes.ResetToken} component={ResetTokenScreen} />
			<SetupStack.Screen name={Routes.SignUpEmail} component={SignUpEmailScreen} />
			<SetupStack.Screen name={Routes.SignUpConfirmationCode} component={SignUpConfirmationCodeScreen} />
		</SetupStack.Navigator>
	);
};
