import { useServices } from "@core/services";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface DeleteAccountBottomSheetProps {
	onClose: () => void;
	setAccountDeleted: (value: boolean) => void;
	isAccountDeleted: boolean;
}

export const DeleteAccountBottomSheet = ({
	onClose,
	isAccountDeleted,
	setAccountDeleted,
}: DeleteAccountBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const deleteAccount = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.deleteMe();
			setAccountDeleted(true);
		} catch (error) {
			setErrorMessage(format("global.default_error"));
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<Container>
			{!isAccountDeleted ? (
				<TopContainer>
					<Title>{format("profile_info.delete.bottom.title")}</Title>
					<Description>
						{format("profile_info.delete.bottom.description_start")}
						<DescriptionHighlight>{format("profile_info.delete.bottom.description_highlight")}</DescriptionHighlight>
						<Description>{format("profile_info.delete.bottom.description_end")}</Description>
					</Description>
				</TopContainer>
			) : (
				<TopContainer>
					<Description>{format("profile_info.delete.bottom.confirmation")}</Description>
				</TopContainer>
			)}
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : !isAccountDeleted ? (
					<Row gap={35}>
						<TertiaryButton containerBackgroundColor={colors.white} onPress={onClose}>
							{format("global.cancel")}
						</TertiaryButton>
						<PrimaryButton onPress={deleteAccount}>{format("profile_info.delete.bottom.action")}</PrimaryButton>
					</Row>
				) : (
					<Row gap={35}>
						<PrimaryButton onPress={onClose}>{format("ok")}</PrimaryButton>
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
	margin-bottom: 50px;
	text-align: center;
`;

const Description = styled.Text`
	font-size: 16px;
	color: ${colors.textPrimary};
	text-align: center;
`;

const DescriptionHighlight = styled.Text`
	color: ${colors.orangeRed};
	font-weight: 800;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 70px;
	height: 38px;
	justify-content: center;
	flex-direction: row;
`;
