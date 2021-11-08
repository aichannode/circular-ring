import { CalendarTag } from "@domain/calendar/calendar";
import { RingAlarm } from "@domain/ring/ringAlarm";
import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeightUnit, WeightUnit } from "@domain/units";
import { Sex } from "@domain/user/user";

export enum Routes {
	LoginOrSignUp = "LoginOrSignUp",
	Login = "Login",
	ForgotPassword = "ForgotPassword",
	ResetToken = "ResetCode",
	SignUpEmail = "SignUpEmail",
	SignUpConfirmationCode = "SignUpConfirmationCode",
	WebView = "WebView",

	RingSetupStart = "RingSetupStart",
	Pairing = "Pairing",
	OnboardingWearInfo = "OnboardingWearInfo",
	OnboardingPersonalInfo1 = "OnboardingPersonalInfo1",
	OnboardingPersonalInfo2 = "OnboardingPersonalInfo2",
	OnboardingTutorial = "OnboardingTutorial",

	HomeDrawer = "HomeDrawer",
	MainHome = "MainHome",
	Home = "Home",
	MyRing = "MyRing",
	ManageMyRings = "ManageMyRings",
	Activity = "Activity",
	Sleep = "Sleep",
	Alarm = "Alarm",
	EditAlarm = "EditAlarm",
	Profile = "Profile",
	Settings = "Settings",
	ProfileInformation = "ProfileInformation",
	ProfileEditName = "ProfileEditName",
	ProfileEditBirthday = "ProfileEditBirthday",
	ProfileAdvancedInformation = "ProfileAdvancedInformation",
	ProfileBirthControl = "ProfileBirthControl",
	Live = "Live",
	Calendar = "Calendar",
	CalendarEditNotes = "CalendarEditNotes",
	AllTags = "AllTags",

	QuickAccess = "QuickAccess",
}

export type AppRoutesParams = {
	[Routes.LoginOrSignUp]: undefined;
	[Routes.Login]: undefined;
	[Routes.ForgotPassword]: { email: string };
	[Routes.ResetToken]: { email: string };
	[Routes.SignUpEmail]: undefined;
	[Routes.SignUpConfirmationCode]: undefined;
	[Routes.WebView]: { uri: string; label?: string };
	[Routes.RingSetupStart]: undefined;
	[Routes.Pairing]: undefined;
	[Routes.OnboardingWearInfo]: undefined;
	[Routes.OnboardingPersonalInfo1]: undefined;
	[Routes.OnboardingPersonalInfo2]: { firstName: string; lastName: string; country: string };
	[Routes.OnboardingTutorial]: {
		firstName: string;
		lastName: string;
		country: string;
		birthDate: string;
		sex: Sex;
		weight: number;
		height: number;
		weightUnit: WeightUnit;
		heightUnit: HeightUnit;
	};
	[Routes.HomeDrawer]: undefined;
	[Routes.MainHome]: undefined;
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.ManageMyRings]: undefined;
	[Routes.Activity]: undefined;
	[Routes.Sleep]: undefined;
	[Routes.Alarm]: undefined;
	[Routes.EditAlarm]: { initialAlarm: RingAlarm } | undefined;
	[Routes.Profile]: undefined;
	[Routes.ProfileInformation]: undefined;
	[Routes.ProfileEditName]: undefined;
	[Routes.ProfileEditBirthday]: undefined;
	[Routes.ProfileAdvancedInformation]: undefined;
	[Routes.ProfileBirthControl]: undefined;
	[Routes.Settings]: undefined;
	[Routes.Live]: undefined;
	[Routes.Calendar]: undefined;
	[Routes.CalendarEditNotes]: { day: string; selectedTags?: CalendarTag[] };
	[Routes.AllTags]: { day: string; selectedTags: CalendarTag[] };
	[Routes.QuickAccess]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

export const useAppRoute = <Route extends Routes>() => useRoute<RouteProp<AppRoutesParams, Route>>();
