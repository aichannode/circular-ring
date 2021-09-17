import { DeviceAutoConnectState } from "@domain/device/deviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";

export const NoRingConnectedBottomSheet = React.forwardRef<BottomSheetModal | null>(({}, ref) => {
	const { format } = useI18n();
	const bottomSheet = useRef<BottomSheetModal>(null);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	useImperativeHandle(ref, () => bottomSheet.current!, []);

	const autoConnectState = useAutoConnectState();

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			bottomSheet.current?.close();
		}
	}, [autoConnectState]);

	return (
		<CircularBottomSheet snapPoints={[580]} ref={bottomSheet}>
			<Container>
				<View>
					<Image source={require("@assets/images/ringShadow.png")} />
					<Cover>
						<Image source={require("@assets/images/ringBig.png")} />
					</Cover>
				</View>
				<SecondaryText style={{ textAlign: "center" }}>{format("live.disconnected")}</SecondaryText>
				<PrimaryButton onPress={() => bottomSheet.current?.close()}>{format("ok")}</PrimaryButton>
			</Container>
		</CircularBottomSheet>
	);
});

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 20px;
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
