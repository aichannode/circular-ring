import { useServices } from "@core/services";
import { DeviceSetupState } from "@domain/device/deviceService";
import { useScannedDevices, useSetupState } from "@domain/device/hooks";
import { PrimaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { PrimaryText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useEffect } from "react";
import { Image, Platform } from "react-native";
import styled from "styled-components/native";

export const RingSetupScreen: React.FC = () => {
	const { format } = useI18n();
	const { bluetoothService, deviceService, ringService } = useServices();

	const setupState = useSetupState();
	const devices = useScannedDevices();

	useEffect(() => {
		if (setupState === DeviceSetupState.READY_TO_SCAN) {
			deviceService.startScan();
		}
	}, [setupState]);

	const isConnecting = setupState === DeviceSetupState.CONNECTING;

	return (
		<Container>
			{(() => {
				switch (setupState) {
					case DeviceSetupState.DISABLED:
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
					case DeviceSetupState.SCANNING:
					case DeviceSetupState.CONNECTING:
						return (
							<>
								<ResponsiveCenterView>
									<Instructions hidden={isConnecting}>
										<Image source={require("@assets/images/clock.png")} />
										<InstructionsText>{format("setup.scan.enabled.title")}</InstructionsText>
									</Instructions>
									<Stack align="center">
										<Image source={require("@assets/images/ringShadow.png")} style={{ position: "absolute" }} />
										<InstructionsArrow source={require("@assets/images/arrowDown.png")} hidden={isConnecting} />
										<Image source={require("@assets/images/ringBig.png")} />
										<Message>
											{isConnecting ? format("setup.connection.pending") : format("setup.scan.enabled.message")}
										</Message>
									</Stack>
								</ResponsiveCenterView>
								{isConnecting ? (
									<Spinner />
								) : (
									<ResponsiveCenterView maxWidth={330}>
										<Divider />
										{devices.map((device) => (
											<DeviceWrapper
												key={device.id}
												onPress={async () => {
													deviceService.stopScan();
													await deviceService.connect(device);
													await ringService.registerCurrentRing();
												}}
											>
												<Image source={require("@assets/images/ring.png")} />
												<DeviceName>{device.name}</DeviceName>
											</DeviceWrapper>
										))}
									</ResponsiveCenterView>
								)}
							</>
						);
				}
			})()}
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	align-items: center;
	justify-content: flex-start;
	padding-vertical: 50px;
`;

const Message = styled(SecondaryText)`
	margin-top: 80px;
	margin-bottom: 40px;
	text-align: center;
`;

const DeviceWrapper = styled.Pressable`
	${roundedWhiteCardStyle};
	flex-direction: row;
	align-items: center;
	margin-top: 20px;
	align-self: stretch;
	padding: 10px 14px;
`;

const Instructions = styled.View<{ hidden?: boolean }>`
	${({ hidden }) => hidden && "opacity: 0"};
	flex-direction: row;
	align-items: center;
	margin-bottom: 10px;
`;

const InstructionsText = styled(SecondaryText)`
	margin-left: 5px;
	font-weight: 500;
	color: ${colors.primary};
`;

const DeviceName = styled(PrimaryText)`
	font-weight: 500;
	margin-left: 10px;
`;

const InstructionsArrow = styled.Image<{ hidden?: boolean }>`
	${({ hidden }) => hidden && "opacity: 0"};
`;
