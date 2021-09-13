import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	LoginOrSignUp = "LoginOrSignUp",
	Login = "Login",
	ForgotPassword = "ForgotPassword",
	ResetToken = "ResetCode",
	NewPassword = "NewPassword",
	SignUpEmail = "SignUpEmail",
	SignUpConfirmationCode = "SignUpConfirmationCode",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
}

export type AppRoutesParams = {
	[Routes.LoginOrSignUp]: undefined;
	[Routes.Login]: undefined;
	[Routes.ForgotPassword]: { email: string };
	[Routes.ResetToken]: { email: string };
	[Routes.NewPassword]: { email: string };
	[Routes.SignUpEmail]: undefined;
	[Routes.SignUpConfirmationCode]: undefined;
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

export const useAppRoute = <Route extends Routes>() => useRoute<RouteProp<AppRoutesParams, Route>>();
