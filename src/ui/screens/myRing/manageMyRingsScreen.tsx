import { useServices } from "@core/services";
import { NamedUserRing } from "@domain/ring/ring";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { DeleteRingBottomSheet } from "@ui/screens/myRing/deleteRingBottomSheet";
import { RingCard } from "@ui/screens/myRing/ringCard";
import { useObservable } from "micro-observables";
import { Dimensions } from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { useFocusEffect } from "@react-navigation/native";
import { DeviceAutoConnectState } from "@domain/device/bleDeviceService";
import { useAutoConnectState } from "@domain/device/hooks";

const width = Dimensions.get("window").width;

export const ManageMyRingsScreen = () => {
	const { format } = useI18n();
	const { ringManagementService, bleDeviceService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);
	const { navigate } = useRoutesNavigation();
	const [rings, setRings] = useState(userRings);

	const autoConnectState = useAutoConnectState();

	console.log("autoConnectState", autoConnectState);

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			console.log("GONNA UPDATE RINGS");
			ringManagementService.userRings.update((rings) => {
				const updatedRings = rings.map((ring) => {
					if (ring.name === bleDeviceService.favoriteDevice.get()?.name) {
						return { ...ring, connected: true };
					} else {
						return { ...ring, connected: false };
					}
				});
				updatedRings.sort((a: NamedUserRing, b: NamedUserRing) => {
					if (a.connected) return -1;
					if (b.connected) return 1;
					return 0;
				});
				return updatedRings;
			});
		}
	}, [autoConnectState]);

	useEffect(() => {
		setRings(userRings);
	}, [userRings]);

	useFocusEffect(
		useCallback(() => {
			ringManagementService.userRings.update((rings) => {
				const updatedRings = rings.map((ring) => {
					if (ring.name === bleDeviceService.favoriteDevice.get()?.name) {
						return { ...ring, connected: true };
					} else {
						return { ...ring, connected: false };
					}
				});
				updatedRings.sort((a: NamedUserRing, b: NamedUserRing) => {
					if (a.connected) return -1;
					if (b.connected) return 1;
					return 0;
				});
				return updatedRings;
			});
			console.log("STOP SCAN MANAGE MY RING");
			bleDeviceService.stopScan();
		}, [])
	);

	const deleteRingBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	const [ringToDelete, setRingToDelete] = useState<NamedUserRing | undefined>(undefined);

	console.log("MANAGE MY RING Rings", rings);
	console.log("MANAGE MY RING  USERRINGS", userRings);
	console.log("MANAGE MY RING FAV DEVICE", bleDeviceService.favoriteDevice.get());

	return (
		<ScrollScreen contentContainerStyle={{ paddingHorizontal: 20 }}>
			<InfoListHeader style={{ marginLeft: 0 }}>{format("manage_rings.general")}</InfoListHeader>
			<InfoListItem
				style={{ marginLeft: -20, marginRight: -20, width }}
				name={format("manage_rings.setup_new_ring")}
				hasDisclosure
				action={() => {
					navigate(Routes.NewRingSetupScreen);
				}}
			></InfoListItem>
			<InfoListHeader style={{ marginLeft: 0 }}>{format("manage_rings.paired_rings_title")}</InfoListHeader>
			<Stack gap={25}>
				{rings.map((ring) => {
					return (
						<RingCard
							key={ring.id}
							ring={ring}
							onDeleteClicked={() => {
								setRingToDelete(ring);
								deleteRingBottomSheetRef.current?.present();
							}}
						/>
					);
				})}
			</Stack>
			<CircularBottomSheet snapPoints={[480]} ref={deleteRingBottomSheetRef}>
				<DeleteRingBottomSheet ring={ringToDelete!} onClose={() => deleteRingBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</ScrollScreen>
	);
};
