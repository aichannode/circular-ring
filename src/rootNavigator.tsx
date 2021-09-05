import { DeviceBondState } from "@domain/device/deviceService";
import { usePairingState } from "@domain/device/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import React from "react";
import { Text } from "react-native";

const SetupStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const bondState = usePairingState();

	return bondState === DeviceBondState.FINISHED ? (
		<MainStack.Navigator screenOptions={{ headerTitle: () => <Text>LOGO</Text>, headerRight: () => <MyRingBattery /> }}>
			<MainStack.Screen name="Home" component={HomeScreen} />
		</MainStack.Navigator>
	) : (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name="Pairing" component={RingSetupScreen} />
		</SetupStack.Navigator>
	);
};
