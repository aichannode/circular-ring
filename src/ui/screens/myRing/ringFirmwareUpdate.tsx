import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { UpdateFailedBottomSheet } from "@ui/screens/myRing/UpdateFailedBottomSheet";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { useObservable } from "micro-observables";
import { colors } from "@ui/styles/colors";
import { PrimaryButton } from "@ui/components/buttons";
import { DFUEmitter } from "react-native-nordic-dfu";
import { ChunkedCircle, CircleGradient } from "@ui/components/shapes/chunkedCircle";
import { Device } from "react-native-ble-plx";
import { SecondaryText } from "@ui/components/text";
import { BleDeviceService } from "@domain/device/bleDeviceService";

const startDFU = async (bleService: BleDeviceService) => {
	await bleService.startDfuMode();

	console.log("Starting DFU");
};

export const RingFirmwareUpdate: React.FC = () => {
	const { bleDeviceService } = useServices();
	const UpdateFailedBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const [isUpdating, setIsUpdating] = useState(false);

	console.log("CONNECTED RING", connectedRing?.name);

	return (
		<Container>
			{!isUpdating ? (
				<NeedToUpdateComponent
					connectedRing={connectedRing}
					showUpdateFailed={() => UpdateFailedBottomSheetRef.current?.present()}
					setIsUpdating={setIsUpdating}
				></NeedToUpdateComponent>
			) : (
				<UpdatingComponent
					setIsUpdating={setIsUpdating}
					connectedRing={null}
					showUpdateFailed={() => UpdateFailedBottomSheetRef.current?.present()}
				></UpdatingComponent>
			)}
			<CircularBottomSheet snapPoints={[580]} ref={UpdateFailedBottomSheetRef}>
				<UpdateFailedBottomSheet onClose={() => UpdateFailedBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

interface I_NeedToUpdateComponent {
	connectedRing: Device | null;
	showUpdateFailed: () => void;
	setIsUpdating: (arg0: boolean) => void;
}

const UpdatingComponent: React.FC<I_NeedToUpdateComponent> = ({ showUpdateFailed, setIsUpdating }) => {
	const { format } = useI18n();
	const [uploadPercent, setUploadPercent] = useState<number>(0);
	const [progress, setProgress] = useState(0);
	const { bleDeviceService } = useServices();
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	console.log("DFU Connected RIng", connectedRing?.name);
	const updateState = useObservable(bleDeviceService.updateState);
	console.log("UPDATE STATE", updateState);

	useEffect(() => {
		if (updateState.progress === -1) showUpdateFailed();
		if (updateState.status === "RECONNECTED") setIsUpdating(false);
	}, [updateState]);

	useEffect(() => {
		setProgress(uploadPercent * 0.8);
	}, [uploadPercent]);

	useEffect(() => {
		DFUEmitter.addListener("DFUProgress", ({ percent, currentPart, partsTotal, avgSpeed, speed }) => {
			console.log("DFU progress: " + percent + "%");
			if (percent) setUploadPercent(percent);
		});

		DFUEmitter.addListener("DFUStateChanged", ({ state }) => {
			console.log("DFU State:", state);
		});
	}, []);

	return (
		<>
			<Description>{format("updateFirmware.updating.description")}</Description>
			<View style={{ marginTop: 80 }}>
				<ChunkedCircle
					size={140}
					strokeWidth={12}
					gradient={CircleGradient.PURPLE}
					pathRatio={Math.round(progress + updateState.progress) / 100}
				/>
				<CenterView>
					<BatteryValue style={{ fontSize: 35 }}>
						{Math.round(progress + updateState.progress) ?? "?"}
						{"%"}
					</BatteryValue>
				</CenterView>
			</View>
			<SecondaryText style={{ marginTop: 50 }}>{updateState.status}</SecondaryText>
		</>
	);
};

const BatteryValue = styled.Text`
	font-weight: bold;
`;

const CenterView = styled.View`
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const NeedToUpdateComponent: React.FC<I_NeedToUpdateComponent> = ({ connectedRing, setIsUpdating }) => {
	const { bleDeviceService } = useServices();
	const { format } = useI18n();

	return (
		<>
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
					console.log("Current Rings", connectedRing?.id);
					setIsUpdating(true);
					startDFU(bleDeviceService);
				}}
				style={{ position: "absolute", bottom: "10%" }}
			>
				Update
			</PrimaryButton>
		</>
	);
};

const Description = styled(PrimaryText)`
	margin-top: 32px;
	font-size: 14px;
	text-align: center;
`;

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

// const Container = styled.View`
// 	flex: 1;
// 	align-items: center;
// 	padding: 60px 50px;
// `;

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0px;
`;

const StyledPrimaryText = styled(PrimaryText)`
       color: ${colors.textPlaceholder}
  font-size: 14px;
`;
