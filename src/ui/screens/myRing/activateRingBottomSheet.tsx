import { NamedUserRing } from "@domain/ring/ring";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { PrimaryText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

interface ActivateRingBottomSheetProps {
	onClose: () => void;
	ring: NamedUserRing;
	connectToRing: (arg0: NamedUserRing) => void;
	cancelConnectToRing: () => void;
}
export const ActivateRingBottomSheet: React.FC<ActivateRingBottomSheetProps> = ({
	onClose,
	connectToRing,
	ring,
	cancelConnectToRing,
}) => {
	const { format } = useI18n();
	return (
		<Container>
			<Stack align="center">
				<Image source={require("@assets/images/ringShadow.png")} style={{ position: "absolute" }} />
				<Image source={require("@assets/images/ringBig.png")} style={{ marginTop: 40 }} />
				<BoldText style={{ marginTop: 70 }}>{ring.name}</BoldText>
			</Stack>
			<ResponsiveCenterView maxWidth={270} style={{ flex: 1, justifyContent: "space-around" }}>
				<Stack align="center">
					<BoldText>{format("activate.title")}</BoldText>
					<SecondaryText style={{ textAlign: "center", marginTop: 20 }}>{format("activate.message")}</SecondaryText>
				</Stack>
				<ButtonContainer>
					<TertiaryButton
						containerBackgroundColor={colors.white}
						onPress={() => {
							setTimeout(() => onClose(), 100);
							cancelConnectToRing();
						}}
					>
						{format("global.cancel")}
					</TertiaryButton>

					<PrimaryButton
						onPress={() => {
							connectToRing(ring);
							setTimeout(() => onClose(), 200);
						}}
						style={{ width: 100 }}
					>
						{format("ok")}
					</PrimaryButton>
				</ButtonContainer>
			</ResponsiveCenterView>
		</Container>
	);
};

const ButtonContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
`;

const Container = styled.View`
	overflow: hidden;
	flex: 1;
	border-radius: 10px;
	margin-top: 20px;
`;

const BoldText = styled(PrimaryText)`
	font-weight: bold;
	text-align: center;
`;
