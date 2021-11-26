import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { UpdateFailedBottomSheet } from "@ui/screens/myRing/firmwareUpdate/UpdateFailedBottomSheet";
import React, { useRef } from "react";
import styled from "styled-components/native";
import { useObservable } from "micro-observables";
import { UpdateState } from "@domain/device/bleDeviceService";

import { UpdatingComponent } from "./updatingComponent";
import { IsUpToDate } from "./IsUpToDate";

export const RingFirmwareUpdate: React.FC = () => {
	const { bleDeviceService } = useServices();
	const UpdateFailedBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const updateState = useObservable(bleDeviceService.updateState);

	return (
		<Container>
			{updateState.status === UpdateState.IDLE.status ? (
				<IsUpToDate
					connectedRing={connectedRing}
					showUpdateFailed={() => UpdateFailedBottomSheetRef.current?.present()}
				></IsUpToDate>
			) : (
				<UpdatingComponent showUpdateFailed={() => UpdateFailedBottomSheetRef.current?.present()}></UpdatingComponent>
			)}
			<CircularBottomSheet snapPoints={[580]} ref={UpdateFailedBottomSheetRef}>
				<UpdateFailedBottomSheet onClose={() => UpdateFailedBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0px;
`;
