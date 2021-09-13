import { useServices } from "@core/services";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringService";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import styled from "styled-components/native";
import { CirclesBanner } from "./circlesBanner";
import { SyncBanner } from "./syncBanner";

export const HomeScreen: React.FC = () => {
	const syncState = useSyncState();
	const { ringService } = useServices();
	const [forceRefreshing, setForceRefreshing] = useState(false);

	const forceRefresh = useCallback(() => {
		if (syncState !== SyncState.NONE) {
			return;
		}
		setForceRefreshing(true);
		ringService.syncData();
	}, [syncState, setForceRefreshing]);

	useEffect(() => {
		if (syncState !== SyncState.PREPARING) {
			setForceRefreshing(false);
		}
	}, [syncState]);

	return (
		<Container>
			<CirclesBanner />
			<MargedSyncBanner />
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						enabled={syncState === SyncState.NONE}
						refreshing={forceRefreshing}
						onRefresh={() => forceRefresh()}
					/>
				}
			/>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

const MargedSyncBanner = styled(SyncBanner)`
	margin: 10px;
`;
