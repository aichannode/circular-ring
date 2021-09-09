import { useNavigation } from "@react-navigation/core";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	Login = "Login",
	ForgotPassword = "ForgotPassword",
	ResetToken = "ResetCode",
	NewPassword = "NewPassword",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
}

export type AppRoutesParams = {
	[Routes.Login]: undefined;
	[Routes.ForgotPassword]: { email: string };
	[Routes.ResetToken]: { email: string };
	[Routes.NewPassword]: { email: string };
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();

export const useAppRoute = <Route extends Routes>() => useRoute<RouteProp<AppRoutesParams, Route>>();
