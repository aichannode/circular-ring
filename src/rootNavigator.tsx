import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PairingScreen } from "@ui/pairingScreen/pairingScreen";
import React from "react";

const SetupStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	return (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name="Pairing" component={PairingScreen} />
		</SetupStack.Navigator>
	);
};
