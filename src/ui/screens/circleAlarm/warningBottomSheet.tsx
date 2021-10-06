import { QuadraryButton } from "@ui/components/buttons";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";

interface WarningBottomSheetProps {
	message: string;
	onClose: () => void;
}
export const WarningBottomSheet: React.FC<WarningBottomSheetProps> = ({ message, onClose }) => {
	const { format } = useI18n();

	return (
		<Container>
			<Title>{format("alarm.new.warning.title")}</Title>
			<Description>{message}</Description>
			<QuadraryButton style={{ alignSelf: "center" }} onPress={() => onClose()}>
				{format("alarm.new.warning.button")}
			</QuadraryButton>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	padding-vertical: 20px;
`;

const Title = styled(TitleText)`
	margin-top: 60px;
	align-self: center;
`;

const Description = styled.Text`
	${textStyles.primary};
	align-self: center;
	justify-content: center;
	margin-top: 30px;
	margin-bottom: 80px;
	padding: 0 44px;
	text-align: center;
`;
