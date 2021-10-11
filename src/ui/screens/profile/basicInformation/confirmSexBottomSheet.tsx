import { useServices } from "@core/services";
import { Sex } from "@domain/user/user";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface ConfirmSexBottomSheetProps {
	sex: Sex;
	onClose: () => void;
}

export const ConfirmSexBottomSheet = ({ sex, onClose }: ConfirmSexBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveSex = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.updateUserInfo({ sex });
			setLoading(false);
			onClose();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, []);

	return (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.sex.title")}</Title>
				<Description>{format("profile_info.bottom_sheet.sex.description")}</Description>
			</TopContainer>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<Row gap={35}>
						<TertiaryButton containerBackgroundColor={colors.white} onPress={onClose}>
							{format("global.cancel")}
						</TertiaryButton>
						<PrimaryButton onPress={saveSex}>{format("global.continue")}</PrimaryButton>
					</Row>
				)}
			</BottomContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const TopContainer = styled.View`
	margin-top: 40px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 65px;
	text-align: center;
`;

const Description = styled.Text`
	font-size: 16px;
	color: ${colors.textPrimary};
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
	flex-direction: row;
`;
