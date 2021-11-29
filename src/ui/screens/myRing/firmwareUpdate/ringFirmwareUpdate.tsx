import { useServices } from "@core/services";
import React from "react";
import styled from "styled-components/native";
import { useObservable } from "micro-observables";
import { UpdateState } from "@domain/device/bleDeviceService";

import { UpdatingComponent } from "./updatingComponent";
import { IsUpToDate } from "./IsUpToDate";

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
`;
