import { DeviceBondState } from "@domain/device/deviceService";
import { usePairingState } from "@domain/device/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyRingBattery } from "@ui/components/navigation/myRingBattery";
import { Routes } from "@ui/components/navigation/routes";
import { useI18n } from "@ui/i18n";
import { HomeScreen } from "@ui/screens/home/homeScreen";
import { MyRingScreen } from "@ui/screens/myRing/myRingScreen";
import { RingSetupScreen } from "@ui/screens/ringSetup/ringSetupScreen";
import React from "react";
import { Text } from "react-native";

const SetupStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
	const bondState = usePairingState();
	const { format } = useI18n();

	return bondState === DeviceBondState.FINISHED ? (
		<MainStack.Navigator screenOptions={{ headerRight: () => <MyRingBattery />, headerTitleAlign: "center" }}>
			<MainStack.Screen name={Routes.Home} component={HomeScreen} options={{ headerTitle: () => <Text>LOGO</Text> }} />
			<MainStack.Screen
				name={Routes.MyRing}
				component={MyRingScreen}
				options={{ title: format("header.my_ring"), headerRight: undefined }}
			/>
		</MainStack.Navigator>
	) : (
		<SetupStack.Navigator screenOptions={{ headerShown: false }}>
			<SetupStack.Screen name={Routes.Pairing} component={RingSetupScreen} />
		</SetupStack.Navigator>
	);
};
