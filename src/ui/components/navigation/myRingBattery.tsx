import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React from "react";
import styled from "styled-components/native";
import { RingBatteryView } from "../ring/ringBatteryView";

export const MyRingBattery: React.FC = () => {
	const { format } = useI18n();
	const navigation = useRoutesNavigation();

	return (
		<Container onPress={() => navigation.navigate(Routes.MyRing)}>
			<MyRingText>{format("header.my_ring")}</MyRingText>
			<RingBatteryView size={28} />
		</Container>
	);
};

const Container = styled.Pressable`
	flex-direction: row;
	align-items: center;
`;

const MyRingText = styled.Text`
	margin-right: 10px;
`;
