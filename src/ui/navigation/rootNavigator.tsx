import { useUser } from "@domain/user/hooks/useUser";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Routes } from "@ui/navigation/routes";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { LoginOrRegisterScreen } from "@ui/screens/loginOrRegister/loginOrRegisterScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import React from "react";

const SetupStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const isAuthenticated = useUser() !== undefined;

	return (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<SetupStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
			) : (
				<>
					<SetupStack.Screen name={Routes.LoginOrRegister} component={LoginOrRegisterScreen} />
					<SetupStack.Screen name={Routes.Login} component={LoginScreen} />
				</>
			)}
		</SetupStack.Navigator>
	);
};
