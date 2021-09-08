import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import { SyncBanner } from "./syncBanner";

interface HomeScreenProps {
	navigation: NavigationProp<{ [k: string]: unknown }>;
}
export const HomeScreen: React.FC<HomeScreenProps> = ({}) => {
	return (
		<Container>
			<MargedSyncBanner />
		</Container>
	);
};

const Container = styled.View``;

const MargedSyncBanner = styled(SyncBanner)`
	margin: 10px;
`;
