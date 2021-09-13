import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	Login = "Login",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
	Activity = "Activity",
}

export type AppRoutesParams = {
	[Routes.Login]: undefined;
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
	[Routes.Activity]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
