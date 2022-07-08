import { useServices } from "@core/services";
import { DeviceConnectionState } from "@domain/device/bleDeviceService";
import { Channel } from "@domain/device/channels";
import { NamedUserRing } from "@domain/ring/ring";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListItem } from "@ui/components/infoList";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { FactoryResetBottomSheet } from "@ui/screens/myRing/factoryResetBottomSheet";
import { RingViewModel } from "@ui/screens/myRing/viewModel/RingViewModel";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import Dialog from "react-native-dialog";
import styled from "styled-components/native";
import { DataModeBottomSheet } from "./dataModeBottomSheet";

const RING_NAME_PREFIX = "Circular ";

export const MyRingScreen: React.FC = () => {
	const { bleDeviceService, appStateService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();
	const factoryResetBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const dataModeBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const viewModel = new RingViewModel();
	const userRings = useObservable(appStateService.userRings);
	const currentRing: NamedUserRing = userRings.filter((ring) => ring.connected)[0];
	const connected = useObservable(bleDeviceService.connectionState);
	const [showPrompt, setShowPrompt] = useState<boolean>(false);
	const [editedName, setEditedName] = useState<string>(
		currentRing?.name ? currentRing?.name.slice(RING_NAME_PREFIX.length) : ""
	);

	const performanceMode = useObservable(appStateService.performanceMode);

	useEffect(() => {
		const currentRing: NamedUserRing = userRings.filter((ring) => ring.connected)[0];
		setEditedName(currentRing?.name ? currentRing?.name.slice(RING_NAME_PREFIX.length) : "");
	}, [currentRing]);

	const renameRing = async () => {
		if (editedName && editedName !== "") {
			try {
				bleDeviceService.favoriteDevice.set({ name: RING_NAME_PREFIX + viewModel.formatRingName(editedName) });
				await bleDeviceService.write(`${Channel.RENAME}${viewModel.formatRingName(editedName)}`);
				appStateService.userRings.set(
					userRings.map((ring) => {
						if (ring.connected)
							return {
								...ring,
								name: RING_NAME_PREFIX + viewModel.formatRingName(editedName),
							};
						else return ring;
					})
				);
			} catch (err) {
				Alert.alert("Error", format("ring.battery.error"), [{ text: "OK", onPress: () => console.log("OK Pressed") }]);
			}
		}
	};

	return (
		<Container>
			<Dialog.Container visible={showPrompt}>
				<Dialog.Title>{format("manage_rings.ring.rename")}</Dialog.Title>
				<Dialog.Input
					autoCapitalize="characters"
					autoCompleteType="off"
					autoCorrect={false}
					value={editedName}
					onChangeText={setEditedName}
				/>
				<Dialog.Button onPress={() => setShowPrompt(false)} label={format("global.cancel")} />
				<Dialog.Button
					label={format("global.edit")}
					onPress={() => {
						setShowPrompt(false);
						renameRing();
					}}
				/>
			</Dialog.Container>
			<RingBatteryView size={140} detailed style={{ marginBottom: 30 }} />
			{connected === DeviceConnectionState.CONNECTED && (
				<>
					<EditText
						onPress={() => {
							setShowPrompt(true);
						}}
					>
						<StyledPrimaryText>{currentRing?.name}</StyledPrimaryText>
						<Pen source={require("@assets/images/pen.png")}></Pen>
					</EditText>
					<InfoListItem
						name={format("ring.firmware")}
						hasDisclosure
						action={() => {
							navigate(Routes.RingFirmwareUpdate);
						}}
					>
						<FirmwareVersionText>{currentRing?.firmware}</FirmwareVersionText>
					</InfoListItem>
				</>
			)}
			<InfoListItem
				name={format("ring.manage")}
				hasDisclosure
				action={() => {
					navigate(Routes.ManageMyRings);
				}}
			/>
			{connected === DeviceConnectionState.CONNECTED && (
				<InfoListItem
					name={format("ring.data_mode")}
					hasDisclosure
					action={() => {
						dataModeBottomSheetRef.current?.present();
					}}
				>
					<FirmwareVersionText>
						{performanceMode ? format("ring.data_mode.performance") : format("ring.data_mode.eco")}
					</FirmwareVersionText>
				</InfoListItem>
			)}

			<InfoListItem
				style={{ marginTop: 20 }}
				textStyle={{ color: "red" }}
				name={format("ring.factory_reset")}
				action={() => {
					factoryResetBottomSheetRef.current?.present();
				}}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={factoryResetBottomSheetRef}>
				<FactoryResetBottomSheet onClose={() => factoryResetBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[480]} ref={dataModeBottomSheetRef}>
				<DataModeBottomSheet onClose={() => dataModeBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const EditText = styled.TouchableOpacity`
	display: flex;
	flex-direction: row;
	margin-bottom: 70px;
	height: 30px;
`;

const Pen = styled.Image``;

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0;
`;

const StyledPrimaryText = styled(PrimaryText)`
	margin-right: 10px;
`;

const FirmwareVersionText = styled.Text`
	font-size: 14px;
	color: ${colors.textPlaceholder};
`;
