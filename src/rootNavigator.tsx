import { useServices } from "@core/services";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import { useObservable } from "micro-observables";
import React from "react";

const SetupStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const { userService } = useServices();
	const isAuthenticated = useObservable(userService.user) !== undefined;

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
