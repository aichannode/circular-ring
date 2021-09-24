import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { MediumTitleText, SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

interface PairingFailedBottomSheetProps {
	onClose: () => void;
}
export const PairingFailedBottomSheet: React.FC<PairingFailedBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();
	return (
		<Container>
			<Image
				style={{ width: "100%", resizeMode: "cover" }}
				resizeMode="cover"
				source={require("@assets/images/sadCouple.png")}
			/>
			<ResponsiveCenterView maxWidth={270} style={{ flex: 1, justifyContent: "space-around" }}>
				<MediumTitleText>{format("setup.pairing.failed.title")}</MediumTitleText>
				<SecondaryText style={{ textAlign: "center" }}>{format("setup.pairing.failed.message")}</SecondaryText>
				<PrimaryButton onPress={onClose} style={{ width: 100 }}>
					{format("ok")}
				</PrimaryButton>
			</ResponsiveCenterView>
		</Container>
	);
};

const Container = styled.View`
	overflow: hidden;
	flex: 1;
	border-radius: 10px;
`;
