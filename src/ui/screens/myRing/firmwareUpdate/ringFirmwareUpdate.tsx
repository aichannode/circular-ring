import { useServices } from "@core/services";
import { UpdateState } from "@domain/device/bleDeviceService";
import { SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useState } from "react";
import WebView from "react-native-webview";
import styled from "styled-components/native";
import { IsUpToDate } from "./IsUpToDate";
import { UpdatingComponent } from "./updatingComponent";
interface RingFirmwareUpdateProps {
	showCross?: boolean;
	setByPassForcedFirmwareUpdate: (value: boolean) => void;
}

export const RingFirmwareUpdate: React.FC<RingFirmwareUpdateProps> = ({ showCross, setByPassForcedFirmwareUpdate }) => {
	const { bleDeviceService } = useServices();
	const connectedRing = useObservable(bleDeviceService.connectedDevice);
	const updateState = useObservable(bleDeviceService.updateState);
	const [showWebview, setShowWebview] = useState(false);
	const { format } = useI18n();

	if (showWebview)
		return (
			<>
				<ScrollScreen contentContainerStyle={{ paddingVertical: 0, marginTop: 40 }}>
					<StyledWebView source={{ uri: "https://www.circular.xyz/release-notes?tab=ringtab" }} />
					<ButtonContainer>
						<SecondaryButton onPress={() => setShowWebview(false)}>{format("global.back")}</SecondaryButton>
					</ButtonContainer>
				</ScrollScreen>
			</>
		);

	return (
		<Container>
			{showCross && (
				<CloseContainer>
					<ClosePressable onPress={() => setByPassForcedFirmwareUpdate(true)}>
						<CloseImage source={require("@assets/images/crossOrange.png")} />
					</ClosePressable>
				</CloseContainer>
			)}
			{updateState.status === UpdateState.IDLE.status ? (
				<IsUpToDate setShowWebview={setShowWebview} connectedRing={connectedRing}></IsUpToDate>
			) : (
				<UpdatingComponent></UpdatingComponent>
			)}
		</Container>
	);
};

const ButtonContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	align-items: center;
`;

const StyledWebView = styled(WebView)`
	flex: 1;
`;

const Container = styled.View`
	flex: 1;
	align-items: center;
	padding: 60px 0px;
	background-color: ${colors.white};
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
