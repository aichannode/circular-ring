import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListItem } from "@ui/components/infoList";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { UpdateFailedBottomSheet } from "@ui/screens/myRing/UpdateFailedBottomSheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { Channel } from "@domain/device/channels";
import { useObservable } from "micro-observables";
import { NamedUserRing } from "@domain/ring/ring";
import { RingViewModel } from "@ui/screens/myRing/viewModel/RingViewModel";
import { colors } from "@ui/styles/colors";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { NordicDFU, DFUEmitter } from "react-native-nordic-dfu";

const startDFU = async (device_id: string, bleService) => {
	await bleService.startDfuMode();

	console.log("Starting DFU");
};

export const RingFirmwareUpdate: React.FC = () => {
	const { bleDeviceService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();
	const { ringManagementService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);
	const UpdateFailedBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const viewModel = new RingViewModel();
	const [currentRing, setCurrentRing] = useState<NamedUserRing>(userRings[0]);
	const connectedRing = useObservable(bleDeviceService.connectedDevice);

	return (
		<Container>
			<StyledPrimaryText>Current version</StyledPrimaryText>
			<VersionContainer
				style={{
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 3,
					},
					shadowOpacity: 0.29,
					shadowRadius: 4.65,

					elevation: 7,
				}}
			>
				<VersionText>0.32.1</VersionText>
				<OutOfDate>{format("updateFirmware.outofdate")}</OutOfDate>
			</VersionContainer>
			<VersionInfo>{format("updateFirmware.newVersionAvailable")}</VersionInfo>
			<PrimaryButton
				onPress={() => {
					if (connectedRing) {
						console.log("Current Rings", connectedRing?.id);
						// startDFU(connectedRing?.id, bleDeviceService);
						UpdateFailedBottomSheetRef.current.present();
					}
				}}
				style={{ position: "absolute", bottom: "10%" }}
			>
				{" "}
				Update
			</PrimaryButton>
			<CircularBottomSheet snapPoints={[580]} ref={UpdateFailedBottomSheetRef}>
				<UpdateFailedBottomSheet onClose={() => UpdateFailedBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const VersionInfo = styled.Text`
	text-align: center;
	margin-horizontal: 60px;
	color: ${colors.textPlaceholder};
	margin-top: 20%;
`;

const VersionContainer = styled.View`
  overflow-hidden;
  background-color: white;
       justify-content: center;
       border-radius: 10px;
  margin-top: 24px;
`;

const VersionText = styled.Text`
	margin-top: 16px;
	margin-horizontal: 24px;
	font-size: 41px;
	text-align: center;
`;

const UpToDate = styled.Text`
	font-size: 18px;
	color: ${colors.orangeRed};
	margin: auto;
	margin-top: 12px;
	margin-bottom: 22px;
`;

const OutOfDate = styled.Text`
	font-size: 18px;
	color: ${colors.orangeRed};
	margin: auto;
	margin-top: 12px;
	margin-bottom: 22px;
`;

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0;
`;

const StyledPrimaryText = styled(PrimaryText)`
       color: ${colors.textPlaceholder}
  font-size: 14px;
`;
