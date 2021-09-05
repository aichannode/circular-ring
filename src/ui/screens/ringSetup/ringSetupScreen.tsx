import { useServices } from "@core/services";
import { delay } from "@core/utils";
import { DeviceBondState } from "@domain/device/deviceService";
import { useDevices, usePairingState } from "@domain/device/hooks";
import { PrimaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { PrimaryText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";

export const RingSetupScreen: React.FC = () => {
	const { format } = useI18n();
	const { bluetoothService, deviceService, ringService } = useServices();

	const pairingState = usePairingState();
	const devices = useDevices();

	useEffect(() => {
		if (pairingState === DeviceBondState.ENABLED) {
			deviceService.startScan();
		} else {
			deviceService.stopScan();
		}
		if (pairingState === DeviceBondState.FINISHED) {
			ringService.listenBattery();
		}
	}, [pairingState]);

	const setupUserRing = async () => delay(2000); // Mock before having user signup and network layer

	return (
		<Container>
			{(() => {
				switch (pairingState) {
					case DeviceBondState.DISABLED:
						return (
							<>
								<Message>{format("setup.scan.disabled.message")}</Message>
								{Platform.OS === "android" && (
									<PrimaryButton
										onPress={async () => {
											bluetoothService.enable();
										}}
									>
										{format("setup.scan.disabled.enable")}
									</PrimaryButton>
								)}
							</>
						);
					case DeviceBondState.ENABLED:
						return (
							<>
								<PrimaryText>{format("setup.scan.enabled.title")}</PrimaryText>
								{/* Image */}
								<Message>{format("setup.scan.enabled.message")}</Message>
								<Divider />
								{devices.map((device) => (
									<DeviceWrapper
										key={device.id}
										onPress={async () => {
											await deviceService.connect(device);
											await setupUserRing();
										}}
									>
										<PrimaryText>{device.name}</PrimaryText>
									</DeviceWrapper>
								))}
							</>
						);
					case DeviceBondState.ON_PROGRESS:
						return <Message>{format("setup.connection.pending")}</Message>;
					case DeviceBondState.FINISHED:
						return <Message>{format("setup.connection.success")}</Message>;
				}
			})()}
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 50px;
	background-color: ${colors.white};
`;

const Message = styled(SecondaryText)`
	max-width: 230px;
	margin-vertical: 40px;
`;

const DeviceWrapper = styled.Pressable`
	${whiteCardStyle};
	margin-top: 20px;
	align-self: stretch;
	padding: 10px 14px;
`;
