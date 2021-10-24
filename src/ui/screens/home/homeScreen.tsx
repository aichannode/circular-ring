import { useServices } from "@core/services";
import { useHomeBanner } from "@domain/homeBanner/hooks";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";
import { colors } from "@ui/styles/colors";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import styled from "styled-components/native";
import { CirclesBanner } from "./circlesBanner";
import { HomeBannerView } from "./homeBanner/homeBannerView";
import { SyncBanner } from "./syncBanner";

export const HomeScreen: React.FC = () => {
	const syncState = useSyncState();
	const { ringManagementService } = useServices();
	const [forceRefreshing, setForceRefreshing] = useState(false);

	const forceRefresh = useCallback(() => {
 
		if (syncState !== SyncState.NONE) {
			return;
		}
		setForceRefreshing(true);
		ringManagementService.syncData();
	}, [syncState, setForceRefreshing]);

	useEffect(() => {
		 ringManagementService.submitFirmwareVersion();
		if (syncState !== SyncState.PREPARING) {
			setForceRefreshing(false);
		}
	}, [syncState]);

	const homeBanner = useHomeBanner();

	return (
		<Container>
			<CirclesBanner />
			<SyncBanner style={{ margin: 10 }} />
			<ScrollView
				style={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						enabled={syncState === SyncState.NONE}
						refreshing={forceRefreshing}
						onRefresh={() => forceRefresh()}
					/>
				}
			>
				{homeBanner && <HomeBannerView banner={homeBanner} style={{ margin: 10 }} />}
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
`;
