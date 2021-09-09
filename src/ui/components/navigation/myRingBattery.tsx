import { DeviceAutoConnectState } from "@domain/device/deviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React from "react";
import { Image } from "react-native";

import styled from "styled-components/native";
import { RingBatteryView } from "../ring/ringBatteryView";
import { Spinner } from "../spinner";

export const MyRingBattery: React.FC = () => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();
	const autoConnectState = useAutoConnectState();

	switch (autoConnectState) {
		case DeviceAutoConnectState.DISABLED:
			return <Image source={require("@assets/images/bluetoothOff.png")} />;
		case DeviceAutoConnectState.SEARCHING:
		case DeviceAutoConnectState.CONNECTING:
		case DeviceAutoConnectState.DISCONNECTED:
			return <Spinner size={24} />;
		case DeviceAutoConnectState.CONNECTED:
			return (
				// TODO REMOVE
				<Container onPress={() => navigation.navigate(Routes.Activity)}>
					<MyRingText>{format("header.my_ring")}</MyRingText>
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
	margin-right: 10px;
`;
