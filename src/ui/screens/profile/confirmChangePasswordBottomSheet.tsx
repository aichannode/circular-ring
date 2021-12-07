import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import styled from "styled-components/native";

interface ComfirmChangePasswordBottomSheetProps {
	onClose: () => void;
}

export const ConfirmChangePasswordBottomSheet: React.FC<ComfirmChangePasswordBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();


	return (
		<Container horizontalPadding={0}>
			<Description>{format("change_password.bottom.confirm")}</Description>
			<Grow />
			<ButtonContainer gap={35}>
				<PrimaryButton onPress={onClose}>
					{format("ok")}
				</PrimaryButton>
			</ButtonContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 60px;
`;

const Description = styled.Text`
	font-size: 16px;
	color: ${colors.textPrimary};
	text-align: center;
`;

const ButtonContainer = styled(Row)``;
