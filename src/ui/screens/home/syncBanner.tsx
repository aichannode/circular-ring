import { useServices } from "@core/services";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringManagementService";
import { PrimaryButton } from "@ui/components/buttons";
import { Grow } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useEffect } from "react";
import { Dimensions, StyleProp, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import styled from "styled-components/native";

interface SyncBannerProps {
	style?: StyleProp<ViewStyle>;
	onRetry: () => void;
}

const { width } = Dimensions.get("screen");

export const SyncBanner: React.FC<SyncBannerProps> = ({ style, onRetry }) => {
	const { ringManagementService } = useServices();
	const FBCQuantity = useObservable(ringManagementService.FBCQuantity);
	const syncState = useSyncState();
	const { format } = useI18n();
	const progressWidth = useSharedValue(10);
	const progressStyle = useAnimatedStyle(() => {
		return {
			height: 2,
			width: progressWidth.value,
			display: "flex",
		};
	});

	useEffect(() => {
		if (syncState === SyncState.SYNCING) {
			progressWidth.value = 10;
			progressWidth.value = withRepeat(
				withDelay(
					0,
					withTiming((width - 20) * 0.9, {
						duration: (FBCQuantity / 30) * 1000 + 5000,
					})
				),
				1
			);
		}
	}, [syncState]);

	if (syncState === SyncState.NONE || syncState === SyncState.PREPARING) return null;

	return (
		<View style={{ margin: 10 }}>
			{syncState === SyncState.SYNCING && (
				<Animated.View style={[progressStyle, { backgroundColor: colors.redOrange }]} />
			)}
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
				{(() => {
					switch (syncState) {
						case SyncState.SYNCING:
							return (
								<>
									<Spinner size={19} />
									<SyncInfo>{format("home.sync.syncing")}</SyncInfo>
								</>
							);
						case SyncState.ERROR:
							return (
								<>
									<Icon source={require("@assets/images/sync.png")} />
									<SyncInfo>{format("home.sync.error")}</SyncInfo>
									<Grow />
									<PrimaryButton light onPress={onRetry}>
										{format("home.sync.retry")}
									</PrimaryButton>
								</>
							);
						case SyncState.SUCCESS:
							return (
								<>
									<Icon source={require("@assets/images/check.png")} />
									<SyncInfo>{format("home.sync.success")}</SyncInfo>
								</>
							);
					}
				})()}
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
