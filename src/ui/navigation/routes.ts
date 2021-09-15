import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	LoginOrSignUp = "LoginOrSignUp",
	Login = "Login",
	ForgotPassword = "ForgotPassword",
	ResetToken = "ResetCode",
	SignUpEmail = "SignUpEmail",
	SignUpConfirmationCode = "SignUpConfirmationCode",
	TermsAndConditions = "TermsAndConditions",

	RingSetupStart = "RingSetupStart",

	HomeDrawer = "HomeDrawer",
	MainHome = "MainHome",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
	Activity = "Activity",
	Profile = "Profile",
	Live = "Live",
}

export type AppRoutesParams = {
	[Routes.LoginOrSignUp]: undefined;
	[Routes.Login]: undefined;
	[Routes.ForgotPassword]: { email: string };
	[Routes.ResetToken]: { email: string };
	[Routes.SignUpEmail]: undefined;
	[Routes.SignUpConfirmationCode]: undefined;
	[Routes.TermsAndConditions]: undefined;
	[Routes.RingSetupStart]: undefined;
	[Routes.HomeDrawer]: undefined;
	[Routes.MainHome]: undefined;
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
	[Routes.Activity]: undefined;
	[Routes.Profile]: undefined;
	[Routes.Live]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

export const useAppRoute = <Route extends Routes>() => useRoute<RouteProp<AppRoutesParams, Route>>();
