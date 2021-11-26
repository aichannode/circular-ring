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
import { BleDeviceService, UpdateState } from "@domain/device/bleDeviceService";
import { useNavigation } from "@react-navigation/core";
import { UserRing } from "@domain/ring/ring";
import { Image } from "react-native";

const startDFU = async (bleService: BleDeviceService) => {
	await bleService.startDfuMode();

	console.log("Starting DFU");
};

export const RingFirmwareUpdate: React.FC = () => {
	const { bleDeviceService } = useServices();
	const UpdateFailedBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const updateState = useObservable(bleDeviceService.updateState);

	// console.log("updateState", updateState);
	// console.log("CONNECTED RING", connectedRing);

	return (
		<Container>
			{updateState.status === UpdateState.IDLE.status ? (
				<NeedToUpdateComponent
					connectedRing={connectedRing}
					showUpdateFailed={() => UpdateFailedBottomSheetRef.current?.present()}
				></NeedToUpdateComponent>
			) : (
				<UpdatingComponent
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
}

const UpdatingComponent: React.FC<I_NeedToUpdateComponent> = ({ showUpdateFailed }) => {
	const { format } = useI18n();
	const [uploadPercent, setUploadPercent] = useState<number>(0);
	const [progress, setProgress] = useState(0);
	const { bleDeviceService } = useServices();
	const updateState = useObservable(bleDeviceService.updateState);
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const { goBack } = useNavigation();
	console.log("DFU Connected RIng", connectedRing?.name);
	console.log("UPDATE STATE", updateState);

	useEffect(() => {
		console.log("UPDATEING COMPONENT updateState", updateState);
		if (updateState.error) {
			console.log("SHOW BOTTOM SHEET");
			showUpdateFailed();
		}
	}, [updateState]);

	useEffect(() => {
		setProgress(uploadPercent * 0.8);
	}, [uploadPercent]);

	useEffect(() => {
		DFUEmitter.addListener("DFUProgress", ({ percent }) => {
			console.log("DFU progress: " + percent + "%");
			if (percent) setUploadPercent(percent);
		});

		DFUEmitter.addListener("DFUStateChanged", ({ state }) => {
			console.log("DFU State:", state);
		});
	}, []);

	return (
		<UpdatingContainer>
			{updateState.status === UpdateState.UPDATE_SUCCESS.status ? (
				<>
					<PrimaryText style={{ fontWeight: "bold", fontSize: 25, textAlign: "center", marginTop: 50 }}>
						{format("updateFirmware.updateSuccess")}
					</PrimaryText>
					<CenterView>
						<Image style={{ height: 100, width: 100, borderWidth: 1 }} source={require("@assets/images/check.png")} />
					</CenterView>
					<PrimaryButton
						onPress={() => {
							bleDeviceService.updateState.set(UpdateState.IDLE);
							goBack();
						}}
						style={{ position: "absolute", bottom: "0%" }}
					>
						{format("global.done")}
					</PrimaryButton>
				</>
			) : (
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
			)}
		</UpdatingContainer>
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

const NeedToUpdateComponent: React.FC<I_NeedToUpdateComponent> = ({ connectedRing }) => {
	const { bleDeviceService } = useServices();
	const { format } = useI18n();
	const { ringManagementService, ringApi } = useServices();
	const [outOfDate, setOutOfDate] = useState(true);
	const userRings = useObservable(ringManagementService.userRings);
	const { goBack } = useNavigation();

	const currentRing: UserRing = userRings.filter((ring) => ring.connected)[0];

	const firmwareDiff = async () => {
		const ringFirmware = await ringApi.getLatestFirmware();

		if (ringFirmware.version !== currentRing.firmware) setOutOfDate(true);
		else {
			console.log("FIRMWARE UPTODATE");
			setOutOfDate(false);
		}
	};

	useEffect(() => {
		firmwareDiff();
	}, [userRings]);

	console.log("FIRMWARE UPDATE CURRENT RING", currentRing);

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
				<VersionText>{currentRing?.firmware?.split("-")[0]}</VersionText>
				{outOfDate ? (
					<OutOfDate>{format("updateFirmware.outofdate")}</OutOfDate>
				) : (
					<UpToDate>{format("updateFirmware.uptodate")}</UpToDate>
				)}
			</VersionContainer>
			<VersionInfo>
				{outOfDate ? format("updateFirmware.newVersionAvailable") : format("updateFirmware.versionIsUptodate")}
			</VersionInfo>
			{outOfDate ? (
				<PrimaryButton
					onPress={() => {
						console.log("Current Rings", connectedRing?.id);
						startDFU(bleDeviceService);
					}}
					style={{ position: "absolute", bottom: "10%" }}
				>
					{format("global.update")}
				</PrimaryButton>
			) : (
				<View style={{ display: "flex", flexDirection: "row", position: "absolute", bottom: "10%" }}>
					<PrimaryButton
						onPress={() => {
							console.log("Current Rings", connectedRing?.id);
							startDFU(bleDeviceService);
						}}
					>
						Update Again
					</PrimaryButton>
					<PrimaryButton
						onPress={() => {
							goBack();
						}}
					>
						{format("global.back")}
					</PrimaryButton>
				</View>
			)}
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
	color: ${colors.green};
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

const UpdatingContainer = styled.View`
	flex: 1;
	align-items: center;
	padding: 0px 50px;
`;

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0px;
`;

const StyledPrimaryText = styled(PrimaryText)`
       color: ${colors.textPlaceholder}
  font-size: 14px;
`;
