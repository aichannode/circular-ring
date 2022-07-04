import { Storage } from "@core/storage";
import { QuadraryButton } from "@ui/components/buttons";
import { CheckBox } from "@ui/components/checkBox";
import { ResponsiveCenterView } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import styled from "styled-components/native";

interface AlarmWelcomeBottomSheetProps {
	onClose: () => void;
}
export const AlarmWelcomeBottomSheet: React.FC<AlarmWelcomeBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();

	const [dontShowAgain, setDontShowAgain] = useState(false);

	const onCloseBottomSheet = async () => {
		if (dontShowAgain) {
			await Storage.save("welcomeAlarmDontShowAgain", true);
		}
		onClose();
	};

	return (
		<Container>
			<Title>{format("alarm.welcome")}</Title>
			<ImageFinger source={require("@assets/images/ringFinger.png")} />
			<CheckBox value={dontShowAgain} onChange={setDontShowAgain} label={format("alarm.welcome.show_again")} />
			<WarningText>{format("alarm.welcome.warning.info")}</WarningText>
			<QuadraryButton onPress={onCloseBottomSheet}>{format("continue")}</QuadraryButton>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 50px;
`;

const Title = styled(SecondaryText)`
	text-align: center;
`;

const WarningText = styled(SecondaryText)`
	text-align: center;
	color: ${colors.blue};
	font-weight: bold;
`;

const ImageFinger = styled.Image`
	width; 180px;
	height: 180px;
	resize-mode: contain
`;
