import { useServices } from "@core/services";
import { InfoListItem } from "@ui/components/infoList";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import React from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";

export const MyRingScreen: React.FC = () => {
	const { bleDeviceService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();

	return (
		<Container>
			<RingBatteryView size={140} detailed />
			<StyledPrimaryText
				onLongPress={() => {
					bleDeviceService.write("RWF1S10");
					Alert.alert("Data added");
				}}
			>
				My Ring
			</StyledPrimaryText>
			<InfoListItem
				name={format("ring.manage")}
				hasDisclosure
				action={() => {
					navigate(Routes.ManageMyRings);
				}}
			/>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0;
`;

const StyledPrimaryText = styled(PrimaryText)`
	margin-bottom: 80px;
`;
