import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { NamedUserRing } from "@domain/ring/ring";
import { useServices } from "@core/services";
import { useObservable } from "micro-observables";

interface NoRingBannerProps {
	style?: StyleProp<ViewStyle>;
}

export const NoRingBanner: React.FC<NoRingBannerProps> = ({ style }) => {
	const { format } = useI18n();

	const { appStateService } = useServices();
	const userRings = useObservable(appStateService.userRings);
	const currentRing: NamedUserRing = userRings.filter((ring) => ring.connected)[0];

	if (currentRing) return null;

	return (
		<View style={{ margin: 10 }}>
			<View
				style={[
					style,
					{
						display: "flex",
						flexDirection: "row",

						backgroundColor: colors.white,
						paddingHorizontal: 10,
						paddingVertical: 5,
					},
				]}
			>
				<>
					<Icon source={require("@assets/images/noRing.png")} />
					<SyncInfo>{format("home.banner.no_ring")}</SyncInfo>
				</>
			</View>
		</View>
	);
};

const SyncInfo = styled(SecondaryText)`
	margin-left: 15px;
`;

const Icon = styled.Image`
	resize-mode: contain;
	height: 19px;
`;
