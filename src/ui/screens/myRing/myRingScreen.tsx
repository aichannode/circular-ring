import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import React from "react";
import styled from "styled-components/native";

export const MyRingScreen: React.FC = () => {
	return (
		<Container>
			<RingBatteryView size={140} detailed />
			<PrimaryText>My Ring</PrimaryText>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px;
`;
