import { useObservable } from "micro-observables";
import React from "react";
import { Text } from "react-native";
import { useServices } from "@core/services";
import styled from "styled-components/native";
import { useEffect } from "react";

// interface PairingScreenProps {}

export const PairingScreen: React.FC/*<PairingScreenProps>*/ = ({}) => {
	const { bluetoothService } = useServices();

	const bluetoothState = useObservable(bluetoothService.state);
	const bluetoothEnabled = useObservable(bluetoothService.enabled);

	useEffect(() => {
		bluetoothService.init();
	}, []);

	return (
		<Container>
			<Text onPress={() => bluetoothService.enable()}>{bluetoothState}</Text>
			{bluetoothEnabled && <Text onPress={() => bluetoothService.scan()}>SCAN</Text>}
			{bluetoothEnabled && <Text onPress={() => bluetoothService.stopScan()}>STOP</Text>}
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	background-color: white;
	align-items: center;
	justify-content: center;
`;
