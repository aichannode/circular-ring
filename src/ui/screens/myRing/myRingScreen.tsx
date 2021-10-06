import { useServices } from "@core/services";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import React from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";

export const MyRingScreen: React.FC = () => {
	const { deviceService } = useServices();
	return (
		<Container>
			<RingBatteryView size={140} detailed />
			<PrimaryText
				onLongPress={() => {
					deviceService.write("RWF1S10");
					Alert.alert("Data added");
				}}
			>
				My Ring
			</PrimaryText>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px;
`;
