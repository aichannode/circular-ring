import { useServices } from "@core/services";
import { DeviceSetupState } from "@domain/device/bleDeviceService";
import { useScannedDevices, useSetupState } from "@domain/device/hooks";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { Grow, ResponsiveCenterView, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { PrimaryText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Image, Platform, View } from "react-native";
import styled from "styled-components/native";
import { PairingFailedBottomSheet } from "./pairingFailedBottomSheet";

export const RingSetupScreen: React.FC = () => {
	const { userService } = useServices();
	const { format } = useI18n();
	const { bluetoothService, bleDeviceService, ringManagementService } = useServices();

	const pairingFailedBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const setupState = useSetupState();
	const devices = useScannedDevices();

	const logout = useCallback(async () => {
		await userService.logout();
	}, []);

	useEffect(() => {
		if (setupState === DeviceSetupState.READY_TO_SCAN) {
			bleDeviceService.startScan();
		}
		if (setupState === DeviceSetupState.LOCATION_DISABLED) {
			bleDeviceService.checkSettings();
		}
		console.log("setupState", setupState);
	}, [setupState]);

	const [isConnecting, setConnecting] = useState(false);

	return (
		<Container>
			{(() => {
				switch (setupState) {
					case DeviceSetupState.DISABLED:
					case DeviceSetupState.LOCATION_DISABLED:
						return (
							<ResponsiveCenterView>
								<Stack gap={50} align={"center"}>
									<DisabledTitle>
										{format(
											setupState === DeviceSetupState.DISABLED
												? "setup.scan.disabled.title"
												: "setup.scan.location_disabled.title"
										)}
									</DisabledTitle>
									<View>
										<Image source={require("@assets/images/ringShadow.png")} />
										<Cover>
											<Image source={require("@assets/images/ringBig.png")} />
										</Cover>
									</View>
									<DisabledMessage>
										{format(
											setupState === DeviceSetupState.DISABLED
												? "setup.scan.disabled.message"
												: "setup.scan.location_disabled.message"
										)}
									</DisabledMessage>
									{Platform.OS === "android" && (
										<PrimaryButton
											onPress={async () => {
												bluetoothService.enable();
												bleDeviceService.checkSettings();
												if (setupState === DeviceSetupState.LOCATION_DISABLED) {
													bleDeviceService.requestLocation();
												}
											}}
										>
											{format(
												setupState === DeviceSetupState.DISABLED
													? "setup.scan.disabled.enable"
													: "setup.scan.location_disabled.enable"
											)}
										</PrimaryButton>
									)}
								</Stack>
							</ResponsiveCenterView>
						);
					case DeviceSetupState.SCANNING:
					case DeviceSetupState.CONNECTING:
					case DeviceSetupState.FINISHED:
						return (
							<>
								<CloseContainer>
									<ClosePressable onPress={logout}>
										<CloseImage source={require("@assets/images/crossOrange.png")} />
									</ClosePressable>
								</CloseContainer>

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
										<StyledDivider />
										{devices.map((device) => (
											<DeviceWrapper
												key={device.id}
												onPress={async () => {
													bleDeviceService.stopScan();
													setConnecting(true);
													await bleDeviceService.connect(device);
													try {
														await ringManagementService.registerConnectedRing();
														setConnecting(false);
													} catch (e) {
														setConnecting(false);
														if ((e as { statusCode: number }).statusCode === 409) {
															pairingFailedBottomSheet.current?.present();
														}
													}
												}}
											>
												<Image source={require("@assets/images/ring.png")} />
												<DeviceName>{device.name}</DeviceName>
												<Grow />
												<Image source={require("@assets/images/disclosure.png")} />
											</DeviceWrapper>
										))}
									</ResponsiveCenterView>
								)}
							</>
						);
				}
			})()}
			<CircularBottomSheet snapPoints={[600]} ref={pairingFailedBottomSheet}>
				<PairingFailedBottomSheet onClose={() => pairingFailedBottomSheet.current?.close()} />
			</CircularBottomSheet>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	align-items: center;
	justify-content: flex-start;
	padding-vertical: 50px;
`;

const CloseContainer = styled.View`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const ClosePressable = styled.TouchableOpacity`
	margin: 0px 40px 40px 0px;
`;

const CloseImage = styled.Image``;

const DisabledTitle = styled.Text`
	${textStyles.bigTitle};
`;

const Cover = styled.View`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const DisabledMessage = styled(SecondaryText)`
	text-align: center;
`;

const Message = styled(SecondaryText)`
	margin-top: 80px;
	margin-bottom: 40px;
	text-align: center;
`;

const StyledDivider = styled(Divider)`
	margin-bottom: 40px;
`;

const DeviceWrapper = styled.Pressable`
	${roundedWhiteCardStyle};
	flex-direction: row;
	align-items: center;
	align-self: stretch;
	padding: 15px 14px;
	margin-bottom: 10px;
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
	margin-left: 15px;
`;

const InstructionsArrow = styled.Image<{ hidden?: boolean }>`
	${({ hidden }) => hidden && "opacity: 0"};
`;
