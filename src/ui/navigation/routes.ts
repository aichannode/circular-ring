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
	Pairing = "Pairing",
	OnboardingWearInfo = "OnboardingWearInfo",
	OnboardingPersonalInfo1 = "OnboardingPersonalInfo1",
	OnboardingPersonalInfo2 = "OnboardingPersonalInfo2",

	HomeDrawer = "HomeDrawer",
	MainHome = "MainHome",
	Home = "Home",
	MyRing = "MyRing",
	Activity = "Activity",
	Alarm = "Alarm",
	NewAlarm = "NewAlarm",
	Profile = "Profile",
	ProfileInformation = "ProfileInformation",
	ProfileEditName = "ProfileEditName",
	ProfileEditBirthday = "ProfileEditBirthday",
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
	[Routes.Pairing]: undefined;
	[Routes.OnboardingWearInfo]: undefined;
	[Routes.OnboardingPersonalInfo1]: undefined;
	[Routes.OnboardingPersonalInfo2]: { firstName: string; lastName: string; country: string };
	[Routes.HomeDrawer]: undefined;
	[Routes.MainHome]: undefined;
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Activity]: undefined;
	[Routes.Alarm]: undefined;
	[Routes.NewAlarm]: undefined;
	[Routes.Profile]: undefined;
	[Routes.ProfileInformation]: undefined;
	[Routes.ProfileEditName]: undefined;
	[Routes.ProfileEditBirthday]: undefined;
	[Routes.Live]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

export const useAppRoute = <Route extends Routes>() => useRoute<RouteProp<AppRoutesParams, Route>>();
