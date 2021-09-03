import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@ui/screens/login/loginScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import React from "react";

const SetupStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	return (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name="Login" component={LoginScreen} />
			<SetupStack.Screen name="Pairing" component={RingSetupScreen} />
		</SetupStack.Navigator>
	);
};
