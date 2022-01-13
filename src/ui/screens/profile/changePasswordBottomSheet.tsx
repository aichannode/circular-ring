import { PrimaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";

interface ChangePasswordBottomSheetProps {
	onClose: () => void;
}

export const ChangePasswordBottomSheet: React.FC<ChangePasswordBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();

	return (
		<Container horizontalPadding={0}>
			<Title>{format("change_password.bottom.title")}</Title>
			<Description>{format("change_password.bottom.description")}</Description>
			<Grow />
			<ButtonContainer gap={35}>
				<PrimaryButton onPress={onClose}>{format("ok")}</PrimaryButton>
			</ButtonContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 60px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 51px;
`;

const Description = styled.Text`
	font-size: 16px;
	color: ${colors.textPrimary};
	text-align: center;
`;

const ButtonContainer = styled(Row)``;
