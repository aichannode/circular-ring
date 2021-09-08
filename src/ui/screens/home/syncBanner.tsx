import { useServices } from "@core/services";
import { useSyncState } from "@domain/ring/hooks";
import { SyncState } from "@domain/ring/ringService";
import { PrimaryButton } from "@ui/components/buttons";
import { Grow, row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface SyncBannerProps {
	style?: StyleProp<ViewStyle>;
}
export const SyncBanner: React.FC<SyncBannerProps> = ({ style }) => {
	const syncState = useSyncState();
	const { format } = useI18n();
	const { ringService } = useServices();

	if (syncState === SyncState.NONE) {
		return null;
	}
	return (
		<Container style={style}>
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
								<PrimaryButton light onPress={() => ringService.syncData()}>
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
		</Container>
	);
};

const Container = styled.View`
	padding: 7px 15px;
	${row("center")};
	${whiteCardStyle};
	border-radius: 2px;
`;

const SyncInfo = styled(SecondaryText)`
	margin-left: 15px;
`;

const Icon = styled.Image`
	resize-mode: contain;
	height: 19px;
`;
