import { useServices } from "@core/services";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { RingCard } from "@ui/screens/myRing/ringCard";
import { useObservable } from "micro-observables";
import React from "react";

export const ManageMyRingsScreen = () => {
	const { format } = useI18n();
	const { ringService } = useServices();
	const userRings = useObservable(ringService.userRings);

	return (
		<ScrollScreen contentContainerStyle={{ paddingHorizontal: 20 }}>
			{/*<InfoListHeader>{format("manage_rings.general")}</InfoListHeader>*/}
			{/*<InfoListItem*/}
			{/*	name={format("manage_rings.setup_new_ring")}*/}
			{/*	hasDisclosure*/}
			{/*	action={() => {*/}
			{/*	}}*/}
			{/*/>*/}
			<InfoListHeader>{format("manage_rings.paired_rings_title")}</InfoListHeader>
			<Stack gap={25}>
				{userRings.map((ring) => {
					return <RingCard key={ring.id} ring={ring} />;
				})}
			</Stack>
		</ScrollScreen>
	);
};
