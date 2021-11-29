import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { MediumTitleText, PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";

interface UpdateFailedBottomSheetProps {
	onClose: () => void;
	startUpdate: () => Promise<void>;
}

export const UpdateFailedBottomSheet: React.FC<UpdateFailedBottomSheetProps> = ({ startUpdate, onClose }) => {
	const { format } = useI18n();

	return (
		<Container horizontalPadding={0}>
			<View style={{ marginTop: 40 }}>
				<Image source={require("@assets/images/ringShadow.png")} />
				<Cover>
					<Image source={require("@assets/images/ringBig.png")} />
				</Cover>
			</View>
			<Title>{format("updateFirmware.updateFailed")}</Title>
			<Description>{format("updateFirmware.updateFailed.description")}</Description>
			<Grow />
			<ButtonContainer gap={35} style={{ height: 38 }}>
				<TertiaryButton key={"cancel"} containerBackgroundColor={colors.white} onPress={onClose}>
					{format("global.back")}
				</TertiaryButton>

				<PrimaryButton
					key={"ok"}
					onPress={async () => {
						console.log("ASYNC SET IDLE");
						startUpdate();
					}}
				>
					{format("retry")}
				</PrimaryButton>
			</ButtonContainer>
		</Container>
	);
};

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

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled(MediumTitleText)`
	font-size: 16px;
	text-align: center;
	margin-top: 30px;
`;

const Description = styled(PrimaryText)`
	margin-top: 32px;
	font-size: 14px;
	text-align: center;
`;

const ButtonContainer = styled(Row)`
	margin: 30px 0;
`;
