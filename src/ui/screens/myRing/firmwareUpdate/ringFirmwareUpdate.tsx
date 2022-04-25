import { useServices } from "@core/services";
import { UpdateState } from "@domain/device/bleDeviceService";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React from "react";
import styled from "styled-components/native";
import { IsUpToDate } from "./IsUpToDate";
import { UpdatingComponent } from "./updatingComponent";

export const RingFirmwareUpdate: React.FC = () => {
	const { bleDeviceService } = useServices();
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const updateState = useObservable(bleDeviceService.updateState);

	return (
		<Container>
			{updateState.status === UpdateState.IDLE.status ? (
				<IsUpToDate connectedRing={connectedRing}></IsUpToDate>
			) : (
				<UpdatingComponent></UpdatingComponent>
			)}
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0px;
	background-color: ${colors.white};
`;
