import { useServices } from "@core/services";
import { PrimaryButton, Tertiarybutton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback } from "react";
import styled from "styled-components/native";

interface LogoutBottomSheetProps {
	onCancel: () => void;
}

export const LogoutBottomSheet: React.FC<LogoutBottomSheetProps> = ({ onCancel }) => {
	const { userService } = useServices();
	const { format } = useI18n();

	const logout = useCallback(async () => {
		await userService.logout();
	}, []);

	return (
		<Container horizontalPadding={0}>
			<Title>{format("profile.logout_bottom_sheet.title")}</Title>
			<Description>{format("profile.logout_bottom_sheet.description")}</Description>
			<Grow />
			<ButtonContainer gap={35}>
				<Tertiarybutton containerBackgroundColor={colors.white} onPress={onCancel}>
					{format("global.cancel")}
				</Tertiarybutton>
				<PrimaryButton onPress={logout}>{format("profile.logout_bottom_sheet.logout")}</PrimaryButton>
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
