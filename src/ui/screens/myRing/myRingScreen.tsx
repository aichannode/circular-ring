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

export const MyRingScreen: React.FC = () => {
	const { bleDeviceService } = useServices();
	const { navigate } = useRoutesNavigation();
	const { format } = useI18n();
	const { ringManagementService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);
	const factoryResetBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	const [currentRing, setCurrentRing] = useState<NamedUserRing>(userRings[0]);
	const renameAlert = () => {
		Alert.prompt(format("manage_rings.ring.rename"), "", [
			{
				text: format("global.cancel"),
				onPress: () => {},
				style: "cancel",
			},
			{
				text: format("global.edit"),
				onPress: (newnName) => {
					if (newnName && newnName !== ""){
						bleDeviceService.write(`${Channel.RENAME}${newnName}`);
						userRings.map((ring) => {
							if (ring.id === currentRing.id) {
								setCurrentRing({ ...ring, name: newnName });
								return { ...ring, name: newnName };
							}
							return ring;
						});
					}
				},
			},
		]);
	};
	useEffect(() => {}, [currentRing]);
	return (
		<Container>
			<RingBatteryView size={140} detailed />
			<StyledPrimaryText
				onLongPress={() => {
					renameAlert();
				}}
			>
				{userRings[0].name}
			</StyledPrimaryText>
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
	margin-bottom: 80px;
`;
