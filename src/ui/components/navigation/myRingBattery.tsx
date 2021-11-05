import { DeviceAutoConnectState } from "@domain/device/bleDeviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React from "react";
import { Image } from "react-native";

import styled from "styled-components/native";
import { RingBatteryView } from "../ring/ringBatteryView";
import { Spinner } from "../spinner";

interface MyRingBatteryProps {
	full?: boolean;
	stalled?: boolean;
}

export const MyRingBattery: React.FC<MyRingBatteryProps> = ({ full, stalled }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();
	const autoConnectState = useAutoConnectState();
	console.log("Stalled", stalled);

	switch (autoConnectState) {
		case DeviceAutoConnectState.DISABLED:
			return <Image source={require("@assets/images/bluetoothOff.png")} />;
		case DeviceAutoConnectState.SEARCHING:
		case DeviceAutoConnectState.CONNECTING:
		case DeviceAutoConnectState.DISCONNECTED:
			return (
				<Container
					onPress={() => (stalled !== true ? navigation.navigate(Routes.MyRing) : console.log("Stalled true", stalled))}
				>
					<Spinner size={24} />
				</Container>
			);
		case DeviceAutoConnectState.CONNECTED:
			return (
				<Container onPress={() => navigation.navigate(Routes.MyRing)}>
					{full && <MyRingText>{format("header.my_ring")}</MyRingText>}
					<RingBatteryView size={28} />
				</Container>
			);
	}
};

const Container = styled.Pressable`
	flex-direction: row;
	align-items: center;
`;

const MyRingText = styled.Text`
	font-size: 14px;
	font-weight: 500;
	margin-right: 10px;
`;
