import { useAuth } from "@domain/auth/hooks/useAuth";
import { useAccountLinked } from "@domain/device/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { Routes } from "@ui/navigation/routes";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { ForgotPasswordScreen } from "@ui/screens/login/forgotPasswordScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { NewPasswordScreen } from "@ui/screens/login/newPasswordScreen";
import { ResetTokenScreen } from "@ui/screens/login/resetTokenScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
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
			<SetupStack.Screen name={Routes.Login} component={LoginScreen} />
			<SetupStack.Screen name={Routes.ForgotPassword} component={ForgotPasswordScreen} />
			<SetupStack.Screen name={Routes.ResetToken} component={ResetTokenScreen} />
			<SetupStack.Screen name={Routes.NewPassword} component={NewPasswordScreen} />
		</SetupStack.Navigator>
	);
};
