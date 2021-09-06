import { useUser } from "@domain/user/hooks/useUser";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import React from "react";

const SetupStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const isAuthenticated = useUser() !== undefined;

	return (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			{isAuthenticated ? (
				<SetupStack.Screen name="Pairing" component={RingSetupScreen} />
			) : (
				<SetupStack.Screen name="Login" component={LoginScreen} />
			)}
		</SetupStack.Navigator>
	);
};
