import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { SecondaryText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";

import { useI18n } from "@ui/i18n";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";
import { NamedUserRing } from "@domain/ring/ring";
import { PrimaryText } from "@ui/components/text";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";

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
					<BoldText>Are you sure you want to activate this ring?</BoldText>
					<SecondaryText style={{ textAlign: "center", marginTop: 20 }}>
						All other rings that are paired with your account will go inactive and only this ring will be able to be
						used.
					</SecondaryText>
				</Stack>
				<ButtonContainer>
					<TertiaryButton
						containerBackgroundColor={colors.white}
						onPress={() => {
							setTimeout(() => onClose(), 100);
							cancelConnectToRing();
						}}
					>
						{format("cancel")}
					</TertiaryButton>

					<PrimaryButton
						onPress={() => {
							onClose();
							setTimeout(() => connectToRing(ring), 200);
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
