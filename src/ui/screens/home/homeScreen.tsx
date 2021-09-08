import { useServices } from "@core/services";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import { SyncBanner } from "./syncBanner";

interface HomeScreenProps {
	navigation: NavigationProp<{ [k: string]: unknown }>;
}
export const HomeScreen: React.FC<HomeScreenProps> = ({}) => {
	const { deviceService, ringService } = useServices();

	useEffect(() => {
		ringService.syncData();
	}, []);

	return (
		<Container>
			<MargedSyncBanner />
			<Text onPress={() => deviceService.write("RWF1S10")}>GOOOOOO GOOO</Text>
		</Container>
	);
};

const Container = styled.View``;

const MargedSyncBanner = styled(SyncBanner)`
	margin: 10px;
`;
