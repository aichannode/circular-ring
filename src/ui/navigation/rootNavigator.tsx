import { useAuth } from "@domain/auth/hooks/useAuth";
import { useAccountLinked } from "@domain/device/hooks";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerContent } from "@ui/navigation/drawer/drawerContent";
import { LoginOrSignUpScreen } from "@ui/screens/loginOrRegister/loginOrSignUpScreen";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { useI18n } from "@ui/i18n";
import { Routes } from "@ui/navigation/routes";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { ForgotPasswordScreen } from "@ui/screens/login/forgotPasswordScreen";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { ResetTokenScreen } from "@ui/screens/login/resetTokenScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { ProfileScreen } from "@ui/screens/profile/profileScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import { SignUpConfirmationCodeScreen } from "@ui/screens/signup/signUpConfirmationCodeScreen";
import { SignUpEmailScreen } from "@ui/screens/signup/signUpEmailScreen";
import { RingSetupStartScreen } from "@ui/screens/ringSetup/ringSetupStartScreen";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable } from "react-native";
import { CircleActivityScreen } from "@ui/screens/circleActivity/circleActivityScreen";

const SetupStack = createNativeStackNavigator();

const AuthenticatedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
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
	const isAuthenticated = useAuth();
	const accountLinked = useAccountLinked();

	const HomeDrawerNavigator = () => (
		<HomeDrawer.Navigator
			screenOptions={{ headerShown: false, drawerStyle: { width: "100%" } }}
			drawerContent={() => <DrawerContent />}
		>
			<HomeDrawer.Screen name={Routes.MainHome} component={MainHomeNavigator} />
		</HomeDrawer.Navigator>
	);

	const MainHomeNavigator = () => (
		<MainStack.Navigator
			screenOptions={{
				headerRight: () => <MyRingBattery />,
				headerTitleAlign: "center",
				headerTitleStyle: headerTitleStyle,
			}}
		>
			<MainStack.Screen
				name={Routes.Home}
				component={HomeScreen}
				options={{
					headerTitle: () => <Image source={require("@assets/images/logoHeader.png")} />,
					headerLeft: () => (
						<Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer)}>
							<Image source={require("@assets/images/menu.png")} />
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
		</MainStack.Navigator>
	);

	const ProfileNavigator = () => (
		<ProfileStack.Navigator
			screenOptions={{
				headerRight: () => <MyRingBattery />,
			}}
		>
			<ProfileStack.Screen
				name={Routes.Profile}
				component={ProfileScreen}
				options={{
					title: format("profile.header.title"),
					headerTitleAlign: "center",
					headerTitleStyle: headerTitleStyle,
				}}
			/>
		</ProfileStack.Navigator>
	);

	return isAuthenticated ? (
		accountLinked ? (
			<AuthenticatedStack.Navigator screenOptions={{ headerShown: false }}>
				<AuthenticatedStack.Screen name={Routes.HomeDrawer} component={HomeDrawerNavigator} />
				<AuthenticatedStack.Screen name={Routes.Profile} component={ProfileNavigator} />
			</AuthenticatedStack.Navigator>
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
