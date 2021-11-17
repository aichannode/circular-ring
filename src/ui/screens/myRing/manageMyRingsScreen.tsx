import { useServices } from "@core/services";
import { NamedUserRing } from "@domain/ring/ring";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { DeleteRingBottomSheet } from "@ui/screens/myRing/deleteRingBottomSheet";
import { RingCard } from "@ui/screens/myRing/ringCard";
import { useObservable } from "micro-observables";
import React, { useRef, useState } from "react";

export const ManageMyRingsScreen = () => {
	const { format } = useI18n();
	const { ringManagementService } = useServices();
	const userRings = useObservable(ringManagementService.userRings);

	const deleteRingBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

	const [ringToDelete, setRingToDelete] = useState<NamedUserRing | undefined>(undefined);

	return (
		<ScrollScreen contentContainerStyle={{ paddingHorizontal: 20 }}>
			<InfoListHeader style={{ marginLeft:0 }}>{format("manage_rings.paired_rings_title")}</InfoListHeader>
			<Stack gap={25}>
				{userRings.map((ring) => {
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
