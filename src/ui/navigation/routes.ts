import { UserSignUpDto } from "@domain/user/userSignUpDto";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum Routes {
	LoginOrSignUp = "LoginOrSignUp",
	Login = "Login",
	SignUpEmail = "SignUpEmail",
	SignUpPersonalInfo = "SignUpPersonalInfo",
	Home = "Home",
	MyRing = "MyRing",
	Pairing = "Pairing",
}

export type AppRoutesParams = {
	[Routes.LoginOrSignUp]: undefined;
	[Routes.Login]: undefined;
	[Routes.SignUpEmail]: undefined;
	[Routes.SignUpPersonalInfo]: { signUpData: UserSignUpDto };
	[Routes.Home]: undefined;
	[Routes.MyRing]: undefined;
	[Routes.Pairing]: undefined;
};

export const useRoutesNavigation = () => useNavigation<NativeStackNavigationProp<AppRoutesParams>>();
