import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListItem } from "@ui/components/infoList";
import { RingBatteryView } from "@ui/components/ring/ringBatteryView";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { FactoryResetBottomSheet } from "@ui/screens/myRing/factoryResetBottomSheet";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import { Channel } from "@domain/device/channels";
import { useObservable } from "micro-observables";
import { NamedUserRing } from "@domain/ring/ring";
import { RingViewModel } from "@ui/screens/myRing/viewModel/RingViewModel";
import { colors } from "@ui/styles/colors";

export const MyRingScreen: React.FC = () => {
	const { bleDeviceService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();
	const { ringManagementService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);
	const [currentRing, setCurrentRing] = useState<NamedUserRing>(userRings?.filter((ring) => ring.connected)[0]);
	const factoryResetBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const viewModel = new RingViewModel();

	console.log("Current Rings", userRings);

	const renameAlert = () => {
		Alert.prompt(format("manage_rings.ring.rename"), "", [
			{
				text: format("global.cancel"),
				style: "cancel",
			},
			{
				text: format("global.edit"),
				onPress: (newName) => {
					if (newName && newName !== "") {
						bleDeviceService.write(`${Channel.RENAME}${newName.toUpperCase()}`);
						userRings.map((ring) => {
							if (ring.id === currentRing?.id) {
								const upTodateRing = { ...ring, name: "Circular " + viewModel.formatRingName(newName) };
								setCurrentRing(upTodateRing);
								ringManagementService.updateStoredRings(upTodateRing);
								return { ...ring, name: viewModel.formatRingName(newName) };
							}
							return ring;
						});
					}
				},
			},
		]);
	};

	useEffect(() => {
		console.log("display ring name");
	}, [currentRing]);
	return (
		<Container>
			<RingBatteryView size={140} detailed />
			<StyledPrimaryText
				onPress={() => {
					renameAlert();
				}}
			>
				{currentRing?.name}
			</StyledPrimaryText>
			<InfoListItem
				name={format("ring.firmware")}
				hasDisclosure
				action={() => {
					navigate(Routes.RingFirmwareUpdate);
				}}
			>
				<FirmwareVersionText>{currentRing?.firmware}</FirmwareVersionText>
			</InfoListItem>

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

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0;
`;

const StyledPrimaryText = styled(PrimaryText)`
	margin-top: 20px;
	margin-bottom: 80px;
`;

const FirmwareVersionText = styled.Text`
	font-size: 14px;
	color: ${colors.textPlaceholder};
`;
