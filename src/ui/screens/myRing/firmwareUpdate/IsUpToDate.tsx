import { useServices } from "@core/services";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { useObservable } from "micro-observables";
import { colors } from "@ui/styles/colors";
import { PrimaryButton } from "@ui/components/buttons";
import { Device } from "react-native-ble-plx";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { useNavigation } from "@react-navigation/core";
import { UserRing } from "@domain/ring/ring";

interface I_IsUpToDate {
	showUpdateFailed: () => void;
	connectedRing: Device | null;
}

const startUpdate = async (bleService: BleDeviceService) => {
	await bleService.startDfuMode();
};

export const IsUpToDate: React.FC<I_IsUpToDate> = ({ connectedRing }) => {
	const { bleDeviceService } = useServices();
	const { format } = useI18n();
	const { ringManagementService, ringApi } = useServices();
	const [outOfDate, setOutOfDate] = useState(true);
	const userRings = useObservable(ringManagementService.userRings);
	const lastFirmwareVersion = useObservable(ringApi.firmwareVersion);
	const { goBack } = useNavigation();

	const currentRing: UserRing = userRings.filter((ring) => ring.connected)[0];

	const firmwareDiff = async () => {
		if (lastFirmwareVersion !== currentRing.firmware) setOutOfDate(true);
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
						startUpdate(bleDeviceService);
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
							startUpdate(bleDeviceService);
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

const StyledPrimaryText = styled(PrimaryText)`
       color: ${colors.textPlaceholder}
  font-size: 14px;
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
