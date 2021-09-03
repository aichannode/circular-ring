import { useServices } from "@core/services";
import { PairingState } from "@domain/device/deviceService";
import { usePairingState } from "@domain/device/hooks";
import { NavigationProp } from "@react-navigation/native";
import { PrimaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { PrimaryText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";

interface RingSetupScreenProps {
	navigation: NavigationProp<{ [k: string]: unknown }>;
}
export const RingSetupScreen: React.FC<RingSetupScreenProps> = () => {
	const { format } = useI18n();
	const { bluetoothService } = useServices();

	const pairingState = usePairingState();

	const { userService } = useServices();

	useEffect(() => {
		userService.loginWithEmail("test@betomorrow.com", "fail");
	}, []);

	useEffect(() => {
		bluetoothService.init();
	}, []);

	return (
		<Container>
			{(() => {
				switch (pairingState) {
					case PairingState.DISABLED:
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
					default:
						return (
							<>
								<PrimaryText>{format("setup.scan.enabled.title")}</PrimaryText>
								{/* Image */}
								<Message>{format("setup.scan.enabled.message")}</Message>
								<Divider />
							</>
						);
				}
			})()}
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 50px;
`;

const Message = styled(SecondaryText)`
	max-width: 230px;
	margin-vertical: 40px;
`;
