import { useServices } from "@core/services";
import { UpdateState } from "@domain/device/bleDeviceService";
import { useObservable } from "micro-observables";
import React from "react";
import styled from "styled-components/native";
import { IsUpToDate } from "./IsUpToDate";
import { UpdatingComponent } from "./updatingComponent";
interface RingFirmwareUpdateProps {
	showCross?: boolean;
	setByPassForcedFirmwareUpdate: (value: boolean) => void;
}

export const RingFirmwareUpdate: React.FC<RingFirmwareUpdateProps> = ({ showCross, setByPassForcedFirmwareUpdate }) => {
	const { bleDeviceService } = useServices();
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const updateState = useObservable(bleDeviceService.updateState);

	return (
		<Container>
			{showCross && (
				<CloseContainer>
					<ClosePressable onPress={() => setByPassForcedFirmwareUpdate(true)}>
						<CloseImage source={require("@assets/images/crossOrange.png")} />
					</ClosePressable>
				</CloseContainer>
			)}
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

const CloseContainer = styled.View`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const ClosePressable = styled.TouchableOpacity`
	margin: 0px 40px 40px 0px;
`;

const CloseImage = styled.Image``;
