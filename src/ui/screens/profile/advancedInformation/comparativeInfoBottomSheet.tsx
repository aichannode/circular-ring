import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import styled from "styled-components/native";

interface ComparativeInfoBottomSheetProps {
	onClose: () => void;
}

export const ComparativeInfoBottomSheet: React.FC<ComparativeInfoBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();

	return (
		<Container horizontalPadding={0}>
			<TopContainer>
				<Title>{format("profile_advanced_info.comparative_info.title")}</Title>
				<Description>{format("profile_advanced_info.comparative_info.description")}</Description>
			</TopContainer>
			<ButtonContainer>
				<PrimaryButton onPress={onClose}>{format("ok")}</PrimaryButton>
			</ButtonContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const TopContainer = styled.View`
	margin-top: 30px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	text-align: center;
`;

const Description = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-top: 30px;
	margin-bottom: 16px;
`;

const ButtonContainer = styled.View`
	height: 38px;
	margin: 30px 0;
`;
