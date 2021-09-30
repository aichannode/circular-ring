import { NamedUserRing } from "@domain/ring/ring";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface RingCardProps {
	ring: NamedUserRing;
	style?: StyleProp<ViewStyle>;
	onDeleteClicked: () => void;
}

export const RingCard: React.FC<RingCardProps> = ({ ring, style, onDeleteClicked }) => {
	const { format } = useI18n();

	return (
		<Container style={style}>
			<Card>
				<RingInfoContainer>
					<RingImage source={require("@assets/images/ring.png")} />
					<RingRightInfoContainer>
						<RingName>{ring.name}</RingName>
						<RingInfo>
							{format("manage_rings.ring.sync_date_prefix")} {dayjs(ring.lastSyncDate).format("DD/MM/YYYY")}
						</RingInfo>
						<RingInfo>
							{format("manage_rings.ring.version_prefix")} {ring.firmware}
						</RingInfo>
						<RingInfo>
							{format("manage_rings.ring.mac_address_prefix")} {ring.id}
						</RingInfo>
					</RingRightInfoContainer>
					<DeleteContainer>
						<Pressable onPress={onDeleteClicked}>
							<DeleteIcon source={require("@assets/images/close.png")} tintColor={colors.primary} />
						</Pressable>
					</DeleteContainer>
				</RingInfoContainer>
			</Card>
		</Container>
	);
};

const Container = styled.View``;

const Card = styled.View`
	${whiteCardStyle};
	padding: 22px 18px;
`;

const RingInfoContainer = styled.View`
	flex-direction: row;
`;

const RingImage = styled.Image`
	height: 62px;
	width: 54px;
	resize-mode: cover;
	margin-top: 6px;
`;

const RingRightInfoContainer = styled.View`
	flex: 1;
	margin-left: 20px;
`;

const RingName = styled.Text`
	${textStyles.mediumTitle};
	font-size: 16px;
	margin-right: 24px;
	margin-bottom: 12px;
`;

const RingInfo = styled.Text`
	font-size: 14px;
	color: ${colors.textTertiary};
`;

const DeleteContainer = styled.View`
	position: absolute;
	top: -7px;
	right: -3px;
`;

const DeleteIcon = styled.Image<{ tintColor: string }>`
	tint-color: ${({ tintColor }) => tintColor};
`;
