import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListItem } from "@ui/components/infoList";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { FactoryResetBottomSheet } from "@ui/screens/myRing/factoryResetBottomSheet";
import React, { useRef, useState } from "react";
import styled from "styled-components/native";
import { Channel } from "@domain/device/channels";
import { useObservable } from "micro-observables";
import { NamedUserRing } from "@domain/ring/ring";
import { RingViewModel } from "@ui/screens/myRing/viewModel/RingViewModel";
import { colors } from "@ui/styles/colors";
import { DeviceConnectionState } from "@domain/device/bleDeviceService";
import Dialog from "react-native-dialog";

export const MyRingScreen: React.FC = () => {
	const { bleDeviceService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();
	const { ringManagementService } = useServices();
	const factoryResetBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const viewModel = new RingViewModel();
	const userRings = useObservable(ringManagementService.userRings);
	const connected = useObservable(bleDeviceService.connectionState);
	const [showPrompt, setShowPrompt] = useState<boolean>(false);
	const [editedName, setEditedName] = useState<string>("");

	console.log("CONNECTED", connected);

	const currentRing: NamedUserRing = userRings.filter((ring) => ring.connected)[0];

	console.log(
		"Current Rings\n",
		userRings.map((ring) => {
			return `name: |${ring.name}| connected: |${ring.connected}| id: |${ring.id}|`;
		})
	);

	const renameRing = async () => {
		if (editedName && editedName !== "") {
			try {
				await bleDeviceService.write(`${Channel.RENAME}${editedName.toUpperCase()}`);
				bleDeviceService.favoriteDevice.set({ name: "Circular " + viewModel.formatRingName(editedName.toUpperCase()) });
			} catch (err) {
				console.log("error");
			}
		}
	};

	return (
		<Container>
			<Dialog.Container visible={showPrompt}>
				<Dialog.Title>{format("manage_rings.ring.rename")}</Dialog.Title>
				<Dialog.Input value={editedName} onChangeText={setEditedName}></Dialog.Input>
				<Dialog.Button onPress={() => setShowPrompt(false)} label={format("global.cancel")} />
				<Dialog.Button
					label={format("global.edit")}
					onPress={() => {
						setShowPrompt(false);
						renameRing();
					}}
				/>
			</Dialog.Container>
			<RingBatteryView size={140} detailed />
			<EditText
				onPress={() => {
					console.log("Edit");
					setShowPrompt(true);
				}}
			>
				<StyledPrimaryText>{currentRing?.name}</StyledPrimaryText>
				<Pen source={require("@assets/images/pen.png")}></Pen>
			</EditText>
			{connected === DeviceConnectionState.CONNECTED && (
				<InfoListItem
					name={format("ring.firmware")}
					hasDisclosure
					action={() => {
						navigate(Routes.RingFirmwareUpdate);
					}}
				>
					<FirmwareVersionText>{currentRing?.firmware}</FirmwareVersionText>
				</InfoListItem>
			)}

			<InfoListItem
				name={format("ring.manage")}
				hasDisclosure
				action={() => {
					navigate(Routes.ManageMyRings);
				}}
			/>

			<InfoListItem
				style={{ marginTop: 20 }}
				name={format("ring.factory_reset")}
				hasDisclosure
				action={() => {
					factoryResetBottomSheetRef.current?.present();
				}}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={factoryResetBottomSheetRef}>
				<FactoryResetBottomSheet onClose={() => factoryResetBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const EditText = styled.TouchableOpacity`
	display: flex;
	flex-direction: row;
	margin-bottom: 70px;
	height: 30px;
	margin-top: 30px;
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
