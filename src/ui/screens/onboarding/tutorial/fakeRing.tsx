import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React from "react";

import styled from "styled-components/native";
import { RingBatteryView } from "./fakeMyRingBattery";

interface MyRingBatteryProps {
	full?: boolean;
	stalled?: boolean;
}

export const MyRingBattery: React.FC<MyRingBatteryProps> = ({ full, stalled }) => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();

	return (
		<Container onPress={() => navigation.navigate(Routes.MyRing)}>
			<MyRingText>{format("header.my_ring")}asdsd</MyRingText>
			<RingBatteryView size={28} />
		</Container>
	);
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
