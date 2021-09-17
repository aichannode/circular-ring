import { DeviceAutoConnectState } from "@domain/device/deviceService";
import { useAutoConnectState } from "@domain/device/hooks";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

export interface OpenBottomSheetHandle {
	open: () => void;
}
export const NoRingConnectedBottomSheet = React.forwardRef<OpenBottomSheetHandle>(({}, ref) => {
	const { format } = useI18n();
	const bottomSheet = useRef<BottomSheetModal>(null);

	useImperativeHandle(ref, () => ({ open: () => bottomSheet.current?.present() }), []);
	const safeArea = useSafeAreaInsets();
	const renderBackdrop = useCallback(
		// eslint-disable-next-line react/jsx-props-no-spreading
		(props) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
		[]
	);

	const autoConnectState = useAutoConnectState();

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			bottomSheet.current?.close();
		}
	}, [autoConnectState]);

	return (
		<BottomSheetModal
			ref={bottomSheet}
			snapPoints={[580]}
			// bottomInset={safeArea.bottom}
			backdropComponent={renderBackdrop}
			style={{ paddingBottom: safeArea.bottom }}
		>
			<Container style={{ paddingBottom: safeArea.bottom }}>
				<View>
					<Image source={require("@assets/images/ringShadow.png")} />
					<Cover>
						<Image source={require("@assets/images/ringBig.png")} />
					</Cover>
				</View>
				<SecondaryText style={{ textAlign: "center" }}>{format("live.disconnected")}</SecondaryText>
				<PrimaryButton onPress={() => bottomSheet.current?.close()}>{format("ok")}</PrimaryButton>
			</Container>
		</BottomSheetModal>
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
