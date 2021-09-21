import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";

interface NoRingConnectedBottomSheetProps {
	onClose: () => void;
}
export const NoRingConnectedBottomSheet: React.FC<NoRingConnectedBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();

	return (
		<Container>
			<View>
				<Image source={require("@assets/images/ringShadow.png")} />
				<Cover>
					<Image source={require("@assets/images/ringBig.png")} />
				</Cover>
			</View>
			<SecondaryText style={{ textAlign: "center" }}>{format("live.disconnected")}</SecondaryText>
			<PrimaryButton onPress={onClose}>{format("ok")}</PrimaryButton>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 20px;
`;

const Cover = styled.View`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;
