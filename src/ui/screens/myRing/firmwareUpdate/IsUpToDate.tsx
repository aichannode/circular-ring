import { useServices } from "@core/services";
import { useRingBattery } from "@domain/device/hooks";
import { UserRing } from "@domain/ring/ring";
import { useNavigation } from "@react-navigation/core";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton } from "@ui/components/buttons";
import { PrimaryText } from "@ui/components/text";
import { IfAdmin } from "@ui/containers/IfAdmin";
import { useI18n } from "@ui/i18n";
import { UpdateFailedBottomSheet } from "@ui/screens/myRing/firmwareUpdate/UpdateFailedBottomSheet";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Device } from "react-native-ble-plx";
import styled from "styled-components/native";

interface I_IsUpToDate {
	connectedRing: Device | null;
}

export const IsUpToDate: React.FC<I_IsUpToDate> = ({ connectedRing }) => {
	const { bleDeviceService } = useServices();
	const { format } = useI18n();
	const { ringApi, appStateService } = useServices();
	const [outOfDate, setOutOfDate] = useState(true);
	const userRings = useObservable(appStateService.userRings);
	const lastFirmwareVersion = useObservable(ringApi.firmwareVersion);
	const { goBack } = useNavigation();
	const ringBattery = useRingBattery();

	const currentRing: UserRing = userRings.filter((ring) => ring.connected)[0];
	const UpdateFailedBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	const startUpdate = async () => {
		await UpdateFailedBottomSheetRef.current?.close();
		if (ringBattery && ringBattery?.charge <= 19) {
			setTimeout(() => {
				UpdateFailedBottomSheetRef.current?.present();
			}, 250);
		} else await bleDeviceService.startDfuMode();
	};

	const firmwareDiff = async () => {
		if (lastFirmwareVersion !== currentRing.firmware) setOutOfDate(true);
		else {
			setOutOfDate(false);
		}
	};

	useEffect(() => {
		firmwareDiff();
	}, [userRings]);

	return (
		<>
			<StyledPrimaryText>{format("updateFirmware.currentVersion")}</StyledPrimaryText>
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
						startUpdate();
					}}
					style={{ position: "absolute", bottom: "10%" }}
				>
					{format("global.update")}
				</PrimaryButton>
			) : (
				// use to debug need to be deleted
				<View style={{ display: "flex", flexDirection: "row", position: "absolute", bottom: "10%" }}>
					<IfAdmin>
						<PrimaryButton
							onPress={() => {
								startUpdate();
							}}
						>
							Update Again
						</PrimaryButton>
					</IfAdmin>
					<PrimaryButton
						onPress={() => {
							goBack();
						}}
					>
						{format("global.back")}
					</PrimaryButton>
				</View>
			)}
			<CircularBottomSheet snapPoints={[580]} ref={UpdateFailedBottomSheetRef}>
				<UpdateFailedBottomSheet
					startUpdate={startUpdate}
					onClose={() => UpdateFailedBottomSheetRef.current?.close()}
				/>
			</CircularBottomSheet>
		</>
	);
};

const StyledPrimaryText = styled(PrimaryText)`
	color: ${colors.textPlaceholder};
	font-size: 14px;
`;

const VersionInfo = styled.Text`
	text-align: center;
	margin-horizontal: 60px;
	color: ${colors.textPlaceholder};
	margin-top: 20%;
`;

const VersionContainer = styled.View`
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
	color: ${colors.redOrange};
	margin: auto;
	margin-top: 12px;
	margin-bottom: 22px;
`;
