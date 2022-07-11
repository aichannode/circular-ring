import { useServices } from "@core/services";
import { NamedUserRing } from "@domain/ring/ring";
import { Melody, serializeMelody } from "@domain/ring/ringAlarm";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { Switch } from "@ui/components/switch";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { ActivateRingBottomSheet } from "./activateRingBottomSheet";

interface RingCardProps {
	ring: NamedUserRing;
	style?: StyleProp<ViewStyle>;
	onDeleteClicked: () => void;
	selected?: boolean;
}

export const RingCard: React.FC<RingCardProps> = ({ ring, style, onDeleteClicked }) => {
	const { format } = useI18n();
	const options = [format("ring.turnOn"), format("ring.turnOff")];
	const [currentOption, setCurrentOption] = useState(ring.connected ? options[0] : options[1]);
	const { bleDeviceService } = useServices();

	const areYouSureToActivate = useRef<CircularBottomSheetHandle>(null);

	const disconnectAllRings = () => {
		bleDeviceService.disconnect({ dissociate: false });
	};

	const connectToRing = async (ring: NamedUserRing) => {
		disconnectAllRings();
		if (ring.name) {
			await bleDeviceService.saveDeviceAsFavorite(ring.name, ring.id);
		}
		setTimeout(() => {
			bleDeviceService.autoConnectFavoriteDevice();
		}, 200);
	};

	const cancelConnectToRing = () => {
		setCurrentOption(options[1]);
	};

	useEffect(() => {
		setCurrentOption(ring.connected ? options[0] : options[1]);
	}, [ring.connected]);

	useEffect(() => {
		if (ring.connected && currentOption === options[1]) {
			disconnectAllRings();
			if (ring.name) bleDeviceService.favoriteDevice.set({ name: "noring" });
		}
		if (!ring.connected && ring.name && currentOption === options[0]) {
			areYouSureToActivate.current?.present();
		}
	}, [currentOption]);

	return (
		<Container style={style}>
			<Card>
				<DeleteContainer>
					<CrossPressable onPress={onDeleteClicked}>
						<DeleteIcon source={require("@assets/images/close.png")} tintColor={colors.primary} />
					</CrossPressable>
				</DeleteContainer>
				<TopContainer>
					<Switch
						styles={{ width: 120 }}
						options={options}
						containerBgColor={colors.white}
						currentOption={currentOption}
						onSelectOption={() => {
							currentOption === options[0] ? setCurrentOption(options[1]) : setCurrentOption(options[0]);
						}}
						disabled={false}
					/>
					{currentOption === options[0] && (
						<Vibrate
							onPress={() => {
								bleDeviceService.write(serializeMelody(Melody.NOTIF1, 50));
							}}
						>
							<VibrateText>{format("manage_rings.ring.vibrate")}</VibrateText>
						</Vibrate>
					)}
				</TopContainer>
				<RingInfoContainer>
					<RingImage source={require("@assets/images/ring.png")} />
					<RingRightInfoContainer>
						<RingName>{ring.name ?? format("manage_rings.ring.default_name")}</RingName>
						<RingInfo>
							{format("manage_rings.ring.sync_date_prefix")} {dayjs(ring.lastSyncDate).format("DD/MM/YYYY")}
						</RingInfo>
						<RingInfo>
							{format("manage_rings.ring.version_prefix")} {ring.firmware}
						</RingInfo>
						<RingInfo>
							{format("manage_rings.ring.snu_prefix")} {ring.id}
						</RingInfo>
					</RingRightInfoContainer>
				</RingInfoContainer>
			</Card>
			<CircularBottomSheet snapPoints={[600]} ref={areYouSureToActivate}>
				<ActivateRingBottomSheet
					ring={ring}
					connectToRing={connectToRing}
					cancelConnectToRing={cancelConnectToRing}
					onClose={() => areYouSureToActivate.current?.close()}
				/>
			</CircularBottomSheet>
		</Container>
	);
};

const Vibrate = styled.TouchableOpacity`
	border: 1px solid ${colors.gray};
	height: 26px;
	border-radius: 13px;
	margin-left: 13px;
	width: 57px;
`;

const VibrateText = styled.Text`
	font-size: 12px;
	line-height: 26px;
	color: ${colors.gray};
	text-align: center;
`;

const TopContainer = styled.View`
	margin-bottom: 20px;
	display: flex;
	flex-direction: row;
`;

const Container = styled.View``;

const Card = styled.View`
	${whiteCardStyle};
	width: 100%;
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
	top: 0px;
	right: 0px;
`;

const DeleteIcon = styled.Image<{ tintColor: string }>`
	tint-color: ${({ tintColor }) => tintColor};
`;

const CrossPressable = styled.TouchableOpacity`
	padding: 15px;
`;
