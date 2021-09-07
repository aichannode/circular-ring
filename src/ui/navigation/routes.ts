import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	Login = "Login",
	ForgotPassword = "ForgotPassword",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
}

export type AppRoutesParams = {
	[Routes.Login]: undefined;
	[Routes.ForgotPassword]: { email?: string };
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
